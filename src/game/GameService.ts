import { Card, TARGETS } from "../models/Card";
import { Deck } from "./Deck";
import { GAMESTATES, GameState } from "../models/GameState";
import { createCardsFromItem } from "./ItemTools";
import { v4 } from "uuid";
import { EmptyArena } from "../data/EmptyArena";
import { ITEMSLOT } from "../models/HeroStats";
import Hero from "./Hero";
import { RaceHuman } from "../data/Races";
import { ClassWarrior } from "../data/Classes";

export function createGame(hero?: Hero): GameState {
	return {
		id: v4(),
		turn: 0,
		leftHandDeck: new Deck([]),
		rightHandDeck: new Deck([]),
		leftHand: [],
		rightHand: [],
		state: GAMESTATES.INIT,
		arena: new EmptyArena(),
		// world: createWorld(LOCATIONS),
		// currentLocationId: "",
		hero: hero || new Hero(RaceHuman, ClassWarrior),
		playedCardsThisTurn: [],
	};
}

export function createDecks(gs: GameState): GameState {
	const rightHandItem = gs.hero.getEquippedItem(ITEMSLOT.RIGHT_HAND);
	const leftHandItem = gs.hero.getEquippedItem(ITEMSLOT.LEFT_HAND);

	if (rightHandItem) {
		gs.rightHandDeck = new Deck(createCardsFromItem(rightHandItem, "RIGHT"));
		const ring = gs.hero.getEquippedItem(ITEMSLOT.RIGHT_FINGER);
		if (ring) {
			gs.rightHandDeck.addCards(createCardsFromItem(ring, "RIGHT"));
		}
	}
	if (leftHandItem) {
		gs.leftHandDeck = new Deck(createCardsFromItem(leftHandItem, "LEFT"));
		const ring = gs.hero.getEquippedItem(ITEMSLOT.LEFT_FINGER);
		if (ring) {
			console.log("Ring on left hand", ring);
			gs.leftHandDeck.addCards(createCardsFromItem(ring, "LEFT"));
		}
	}
	// gs.leftHandDeck = new Deck(createCardsFromItem(left, "LEFT"));
	// gs.rightHandDeck = new Deck(createCardsFromItem(right, "RIGHT"));

	return { ...gs };
}

// export function startGame(gameState: GameState): GameState {

// 	const nextLoc = selectNextLocation(gameState);
// 	gameState.currentLocationId = nextLoc.id;
// 	gameState.arena = nextLoc.arena[0];

// 	console.log("NEXT ARENA", nextLoc.arena[0].name)

// 	gameState.state = GAMESTATES.MYTURN;

// 	gameState = selectItems(gameState, Shield, arnd([LongSword, Mace]));
// 	// gameState = selectItems(gameState, Shield, Mace);

// 	gameState.rightHandDeck.shuffleDeck();
// 	gameState.leftHandDeck.shuffleDeck();

// 	gameState.rightHand = gameState.rightHandDeck.drawCards(3);
// 	gameState.leftHand = gameState.leftHandDeck.drawCards(3);

// 	gameState.arena.resetArena();
// 	gameState.turn = 1;

// 	return { ...gameState };
// }

export function playItemCard(gameState: GameState, card: Card, targetIndex?: number): GameState {
	if (gameState.hero.getEnergy() < card.apCost) {
		console.log("Not enough Action Points");
		return { ...gameState };
	}

	// If the card has an onUse effect, use it
	gameState = card.onUse(gameState, card);

	// If target is specified, use the card on the target
	if (targetIndex !== undefined && targetIndex > -1) {
		let allTargets: number[] = [targetIndex];

		if (card.allowedTargets.includes(TARGETS.ALLENEMIES)) {
			allTargets = gameState.arena.enemies.map((e, i) => i);
		} else if (card.allowedTargets.includes(TARGETS.ADJACENT)) {
			if (targetIndex > 0) {
				allTargets.push(targetIndex - 1);
			}
			if (targetIndex < gameState.arena.enemies.length - 1) {
				allTargets.push(targetIndex + 1);
			}
		}

		allTargets.forEach((ind) => {
			const enemy = gameState.arena.enemies[ind];

			if (!enemy.isDead()) {
				enemy.beforeDamage();

				card.damage.forEach((dmg) => {
					enemy.takeDamage(dmg);
				});

				card.effectsOnHit.forEach((effect) => {
					enemy.causeEffect(effect);
				});

				if (enemy.isDead()) {
					gameState.hero.gainExperience(enemy.getExperienceValue());
					gameState = enemy.atDeath(gameState);
				}
			}
		});
	}

	gameState.hero.useEnergy(card.apCost);
	// gameState.hero.aps -= card.apCost;

	gameState.playedCardsThisTurn.push(card);

	// Discard used card
	if (card.hand === "RIGHT") {
		gameState.rightHandDeck.discardCards([card]);
		gameState.rightHand = [...gameState.rightHand.filter((c) => c.id !== card.id)];
	} else {
		gameState.leftHandDeck.discardCards([card]);
		gameState.leftHand = gameState.leftHand.filter((c) => c.id !== card.id);
	}

	if (checkForWin(gameState)) {
		return { ...gameState, state: GAMESTATES.ARENA_VICTORY };
	}

	return { ...gameState };
}

export function endTurn(gameState: GameState): GameState {
	// Item onEndOfTurn effects
	gameState.hero.getItemSlots().forEach((item) => {
		if (item.onEndOfTurn) {
			gameState = item.onEndOfTurn(gameState);
		}
	});

	// Events at the end of the player turn
	gameState.arena.enemies.forEach((enemy) => {
		gameState = enemy.atEndOfPlayerTurn(gameState);
		gameState = enemy.cleanUpEndOfPlayerTurn(gameState);
	});

	gameState.state = GAMESTATES.ENEMYTURN;

	// Move cards from hand to discard
	gameState.leftHandDeck.discardCards(gameState.leftHand);
	gameState.rightHandDeck.discardCards(gameState.rightHand);
	gameState.leftHand = [];
	gameState.rightHand = [];

	gameState.playedCardsThisTurn = [];

	if (checkForDeath(gameState)) {
		return { ...gameState, state: GAMESTATES.DEAD };
	}

	if (checkForWin(gameState)) {
		return { ...gameState, state: GAMESTATES.ARENA_VICTORY };
	}

	// Events at the start of the enemy turn
	gameState.arena.enemies.forEach((enemy) => {
		gameState = enemy.atStartOfEnemyTurn(gameState);
	});

	return { ...gameState };
}

export function endEnemyTurn(gameState: GameState): GameState {
	// Resolve enemy actions
	gameState = gameState.arena.enemies.reduce(
		(gs, enemy) => {
			return enemy.resolveAction(gs);
		},
		{ ...gameState },
	);

	gameState.arena.enemies.forEach((enemy) => {
		gameState = enemy.atEndOfEnemyTurn(gameState);
		gameState = enemy.cleanUpEndOfEnemyTurn(gameState);
	});

	// gameState.hero.armor = getBaseArmorValue(gameState.hero);

	if (checkForDeath(gameState)) {
		return { ...gameState, state: GAMESTATES.DEAD };
	}

	if (checkForWin(gameState)) {
		return { ...gameState, state: GAMESTATES.ARENA_VICTORY };
	}

	gameState.state = GAMESTATES.MYTURN;
	gameState.hero.turnReset();
	gameState.turn++;
	// gameState.hero.aps = gameState.hero.maxAps;

	// Draw X cards to both hands
	gameState.leftHand = gameState.leftHandDeck.drawCards(gameState.hero.getHandSize("LEFT"));
	gameState.rightHand = gameState.rightHandDeck.drawCards(gameState.hero.getHandSize("RIGHT"));

	gameState.arena.enemies.forEach((enemy) => {
		gameState = enemy.atStartOfPlayerTurn(gameState);
	});

	return { ...gameState };
}

export function checkForWin(gs: GameState): boolean {
	// Count all dead enemies in the arena
	const deadEnemies = gs.arena.enemies.filter((enemy) => enemy.isDead()).length;

	return deadEnemies === gs.arena.enemies.length;
}

export function checkForDeath(gs: GameState): boolean {
	return gs.hero.getHealth() <= 0;
}
