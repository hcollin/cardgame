import { Card, OldCardData } from "../models/Card";
import { Deck } from "./Deck";
import { Arena } from "./Arena";
import { GAMESTATES, GameState } from "../models/GameState";
import { Item } from "../models/Items";
import { createCardsFromItem } from "./ItemTools";
import { LongSword } from "../data/items/LongSword";
import { Shield } from "../data/items/Shield";

export function createGame(cardSet: OldCardData[], arena: Arena): GameState {
	return {
		id: "testGame",
		turn: 0,
		myHealth: 0,
		myMaxHealth: 50,
		aps: 0,
		maxAps: 4,
		leftHandDeck: new Deck([]),
		rightHandDeck: new Deck([]),
		leftHand: [],
		rightHand: [],
		state: GAMESTATES.WAITING,
		arena: arena,
	};
}

export function selectItems(gs: GameState, left: Item, right: Item): GameState {
	gs.leftHandDeck = new Deck(createCardsFromItem(left, "LEFT"));
	gs.rightHandDeck = new Deck(createCardsFromItem(right, "RIGHT"));

	return { ...gs };
}

export function startGame(gameState: GameState): GameState {
	gameState.state = GAMESTATES.MYTURN;

    gameState = selectItems(gameState, Shield, LongSword);

	gameState.rightHand = gameState.rightHandDeck.drawCards(3);
	gameState.leftHand = gameState.leftHandDeck.drawCards(3);

	gameState.arena.resetArena();
	gameState.turn = 1;
	gameState.aps = gameState.maxAps;
	gameState.myHealth = gameState.myMaxHealth;
	return { ...gameState };
}

export function playItemCard(gameState: GameState, card: Card, targetIndex?: number): GameState {
	if (gameState.aps < card.apCost) {
		console.log("Not enough Action Points");
		return { ...gameState };
	}

	// If the card has an onUse effect, use it
	gameState = card.onUse(gameState);

	// If target is specified, use the card on the target
	if (targetIndex !== undefined) {
		const enemy = gameState.arena.enemies[targetIndex];
		card.damage.forEach((dmg) => {
			enemy.takeDamage(dmg);
		});

		if (enemy.isDead()) {
			gameState = enemy.atDeath(gameState);
		}
	}

	gameState.aps -= card.apCost;

	// Discard used card
	if (card.hand === "RIGHT") {
		gameState.rightHandDeck.discardCards([card]);
		gameState.rightHand = gameState.rightHand.filter((c) => c.id !== card.id);
	} else {
		gameState.leftHandDeck.discardCards([card]);
		gameState.leftHand = gameState.leftHand.filter((c) => c.id !== card.id);
	}

	return { ...gameState };
}

export function endTurn(gameState: GameState): GameState {
	// Events at the end of the player turn
	gameState.arena.enemies.forEach((enemy) => {
		gameState = enemy.atEndOfPlayerTurn(gameState);
	});

	gameState.state = GAMESTATES.ENEMYTURN;

	// Move cards from hand to discard
	gameState.leftHandDeck.discardCards(gameState.leftHand);
	gameState.rightHandDeck.discardCards(gameState.rightHand);
	gameState.leftHand = [];
	gameState.rightHand = [];

	// Events at the start of the enemy turn
	gameState.arena.enemies.forEach((enemy) => {
		gameState = enemy.atStartOfEnemyTurn(gameState);
	});

	return { ...gameState };
}

export function endEnemyTurn(gameState: GameState): GameState {
	gameState.arena.enemies.forEach((enemy) => {
		// Each enemy attacks
		gameState.myHealth -= enemy.attack();
	});

	gameState.arena.enemies.forEach((enemy) => {
		gameState = enemy.atEndOfEnemyTurn(gameState);
	});

	gameState.state = GAMESTATES.MYTURN;
	gameState.turn++;
	gameState.aps = gameState.maxAps;

	// Draw 3 cards to both hands
	gameState.leftHand = gameState.leftHandDeck.drawCards(3);
	gameState.rightHand = gameState.rightHandDeck.drawCards(3);

	gameState.arena.enemies.forEach((enemy) => {
		gameState = enemy.atStartOfPlayerTurn(gameState);
	});

	return { ...gameState };
}
