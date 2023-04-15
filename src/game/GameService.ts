import { Card, OldCardData } from "../models/Card";
import { Deck } from "./Deck";
import { Arena } from "./Arena";
import { GAMESTATES, GameState } from "../models/GameState";

export function createGame(cardSet: OldCardData[], arena: Arena): GameState {
	return {
		id: "testGame",
		turn: 0,
		myHealth: 0,
		myMaxHealth: 50,
		aps: 0,
		maxAps: 4,
		deck: new Deck(cardSet),
		state: GAMESTATES.WAITING,
		hand: [],
		arena: arena,
	};
}

export function startGame(gameState: GameState): GameState {
	gameState.state = GAMESTATES.MYTURN;
	gameState.hand = gameState.deck.drawCards(5);
	gameState.arena.resetArena();
	gameState.turn = 1;
	gameState.aps = gameState.maxAps;
	gameState.myHealth = gameState.myMaxHealth;
	return { ...gameState };
}

export function attackWithCard(gameState: GameState, card: Card, enemyIndex: number): GameState {
	if (gameState.aps < card.handed) {
		console.log("Not enough Action Points");
		return { ...gameState };
	}
	const enemy = gameState.arena.enemies[enemyIndex];
	enemy.takeDamage(card.damage);

    if(enemy.isDead()) {
        gameState = enemy.atDeath(gameState);
    }

	gameState.aps -= card.handed;

	gameState.deck.discardCards([card]);
	gameState.hand = gameState.hand.filter((c) => c.name !== card.name);

	return { ...gameState };
}

export function endTurn(gameState: GameState): GameState {

    // Events at the end of the player turn
    gameState.arena.enemies.forEach((enemy) => { 
        gameState = enemy.atEndOfPlayerTurn(gameState);
    });

    gameState.state = GAMESTATES.ENEMYTURN;

	// Move cards from hand to discard
	gameState.deck.discardCards(gameState.hand);
	gameState.hand = [];

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

	// Draw 5 cards
	gameState.hand = gameState.deck.drawCards(5);

    gameState.arena.enemies.forEach((enemy) => { 
        gameState = enemy.atStartOfPlayerTurn(gameState);
    });

	return { ...gameState };
}
