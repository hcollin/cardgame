import { Card, DAMAGETYPE, TARGETS } from "../models/Card";
import { Deck } from "./Deck";

import { createCardsFromItem } from "./ItemTools";
import { v4 } from "uuid";
import { EmptyArena } from "../data/EmptyArena";
import { ITEMSLOT } from "../models/HeroStats";
import Hero from "./Hero";
import { RaceHuman } from "../data/Races";
import { ClassWarrior } from "../data/Classes";
import { Enemy } from "./Enemy";
import { Hand } from "./Hand";
import { effStore } from "../utils/usePlayerEffect";
import { ARENASTATES, ArenaState } from "../models/ArenaState";


/**
 * Creates an empty Arena State
 * 
 * @param hero 
 * @returns 
 */
export function createArenaState(hero?: Hero): ArenaState {
	return {
		id: v4(),
		turn: 0,
		leftHandDeck: new Deck([]),
		rightHandDeck: new Deck([]),
		leftHand: new Hand("LEFT"),
		rightHand: new Hand("RIGHT"),
		state: ARENASTATES.INIT,
		arena: new EmptyArena(),
		hero: hero || new Hero(RaceHuman, ClassWarrior),
		playedCardsThisTurn: [],
	};
}

export function createDecks(as: ArenaState): ArenaState {
	const rightHandItem = as.hero.getEquippedItem(ITEMSLOT.RIGHT_HAND);
	const leftHandItem = as.hero.getEquippedItem(ITEMSLOT.LEFT_HAND);

	if (rightHandItem) {
		as.rightHandDeck = new Deck(createCardsFromItem(rightHandItem, "RIGHT"));
		const ring = as.hero.getEquippedItem(ITEMSLOT.RIGHT_FINGER);
		if (ring) {
			as.rightHandDeck.addCards(createCardsFromItem(ring, "RIGHT"));
		}
	}
	if (leftHandItem) {
		as.leftHandDeck = new Deck(createCardsFromItem(leftHandItem, "LEFT"));
		const ring = as.hero.getEquippedItem(ITEMSLOT.LEFT_FINGER);
		if (ring) {
			console.log("Ring on left hand", ring);
			as.leftHandDeck.addCards(createCardsFromItem(ring, "LEFT"));
		}
	}
	// as.leftHandDeck = new Deck(createCardsFromItem(left, "LEFT"));
	// as.rightHandDeck = new Deck(createCardsFromItem(right, "RIGHT"));

	return { ...as };
}

export function playItemCard(arenaState: ArenaState, card: Card, targetIndex?: number): ArenaState {
	if (arenaState.hero.getEnergy() < card.apCost) {
		console.log("Not enough Action Points");
		return { ...arenaState };
	}

	// If the card has an onUse effect, use it
	arenaState = card.onUse(arenaState, card);

	// If target is specified, use the card on the target
	if (targetIndex !== undefined && targetIndex > -1) {
		let allTargets: number[] = [targetIndex];

		if (card.allowedTargets.includes(TARGETS.ALLENEMIES)) {
			allTargets = arenaState.arena.enemies.map((e, i) => i);
		} else if (card.allowedTargets.includes(TARGETS.ADJACENT)) {
			if (targetIndex > 0) {
				allTargets.push(targetIndex - 1);
			}
			if (targetIndex < arenaState.arena.enemies.length - 1) {
				allTargets.push(targetIndex + 1);
			}
		}

		

		allTargets.forEach((ind) => {
			const enemy = arenaState.arena.enemies[ind];

			if (!enemy.isDead()) {
				enemy.beforeDamage();

				card.damage.forEach((dmg) => {
					enemy.takeDamage(dmg, arenaState);
				});

				card.effectsOnHit.forEach((effect) => {
					enemy.causeEffect(effect);
				});

				if (enemy.isDead()) {
					arenaState.hero.gainExperience(enemy.getExperienceValue());
					arenaState = enemy.atDeath(arenaState);
				}
			}
		});
	}

	effStore.addEffect("CARD", `Played card ${card.name}`);

	arenaState.hero.useEnergy(card.apCost);
	// arenaState.hero.aps -= card.apCost;

	arenaState.playedCardsThisTurn.push(card);

	// Discard used card
	if (card.hand === "RIGHT") {
		arenaState.rightHand.discardCard(card, arenaState);
	} else {
		arenaState.leftHand.discardCard(card, arenaState);
	}

	if (checkForWin(arenaState)) {
		return { ...arenaState, state: ARENASTATES.ARENA_VICTORY };
	}


	return { ...arenaState };
}

export function killTargetEnemy(as: ArenaState, enemyId: string): ArenaState {

	const enemy = as.arena.enemies.find((e) => e.id === enemyId);

	if (!enemy) { return as; }

	enemy.takeDamage({
		amount: enemy.getHealth() * 2,
		type: DAMAGETYPE.SLASH,
		variation: 0
	}, as);

	as.hero.gainExperience(enemy.getExperienceValue());


	return { ...as };
}

export function endTurn(arenaState: ArenaState): ArenaState {
	// Item onEndOfTurn effects
	arenaState.hero.getItemSlots().forEach((item) => {
		if (item.onEndOfTurn) {
			arenaState = item.onEndOfTurn(arenaState);
		}
	});

	// Events at the end of the player turn
	arenaState.arena.enemies.forEach((enemy) => {
		arenaState = enemy.atEndOfPlayerTurn(arenaState);
		arenaState = enemy.cleanUpEndOfPlayerTurn(arenaState);
	});

	arenaState.state = ARENASTATES.ENEMYTURN;

	// Move cards from hand to discard
	arenaState.leftHand.discardAll(arenaState);
	arenaState.rightHand.discardAll(arenaState);
	
	arenaState.playedCardsThisTurn = [];

	if (checkForDeath(arenaState)) {
		return { ...arenaState, state: ARENASTATES.DEAD };
	}

	if (checkForWin(arenaState)) {
		return { ...arenaState, state: ARENASTATES.ARENA_VICTORY };
	}

	// Events at the start of the enemy turn
	arenaState.arena.enemies.forEach((enemy) => {
		arenaState = enemy.atStartOfEnemyTurn(arenaState);
	});

	return { ...arenaState };
}

export function endEnemyTurn(arenaState: ArenaState): ArenaState {
	// Resolve enemy actions
	arenaState = arenaState.arena.enemies.reduce(
		(as, enemy) => {
			return enemy.resolveAction(as);
		},
		{ ...arenaState },
	);

	arenaState.arena.enemies.forEach((enemy) => {
		arenaState = enemy.atEndOfEnemyTurn(arenaState);
		arenaState = enemy.cleanUpEndOfEnemyTurn(arenaState);
	});

	// arenaState.hero.armor = getBaseArmorValue(arenaState.hero);

	if (checkForDeath(arenaState)) {
		return { ...arenaState, state: ARENASTATES.DEAD };
	}

	if (checkForWin(arenaState)) {
		return { ...arenaState, state: ARENASTATES.ARENA_VICTORY };
	}

	arenaState.state = ARENASTATES.MYTURN;
	arenaState.hero.turnReset();
	arenaState.turn++;
	// arenaState.hero.aps = arenaState.hero.maxAps;

	// Draw X cards to both hands
	arenaState.leftHand.drawNewHand(arenaState);
	arenaState.rightHand.drawNewHand(arenaState);
	
	arenaState.arena.enemies.forEach((enemy) => {
		arenaState = enemy.atStartOfPlayerTurn(arenaState);
	});

	return { ...arenaState };
}

export function checkForWin(as: ArenaState): boolean {
	// Count all dead enemies in the arena
	const deadEnemies = as.arena.enemies.filter((enemy) => enemy.isDead()).length;

	return deadEnemies === as.arena.enemies.length;
}

export function checkForDeath(as: ArenaState): boolean {
	return as.hero.getHealth() <= 0;
}
