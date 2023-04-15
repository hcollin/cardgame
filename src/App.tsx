import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { attackWithCard, createGame, endEnemyTurn, endTurn, startGame } from "./game/GameService";
import { CardSetA } from "./data/CardSetA";

import { TestArena } from "./data/TestArena";
import { GAMESTATES, GameState } from "./models/GameState";
import HandCard from "./components/HandCard";
import EnemyCard from "./components/EnemyCard";
import { Card } from "./models/Card";

function App() {
	const [gameState, setGameState] = useState<GameState>(createGame(CardSetA, new TestArena()));

	const [targetIndex, setTarget] = useState<number | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	useEffect(() => {
		const gs = createGame(CardSetA, new TestArena());
		setGameState(startGame(gs));
	}, []);

	useEffect(() => {
		console.log(gameState.state);
		if (gameState.state === GAMESTATES.ENEMYTURN) {
			setTimeout(() => {
				setGameState(endEnemyTurn(gameState));
			}, 1000);
		}
	}, [gameState.state]);

  useEffect(() => {
    if(targetIndex !== null && selectedCard !== null) {
      const card = selectedCard;
      const target = targetIndex;
      setTarget(null);
      setSelectedCard(null);
      console.log(`Card ${card.name} attacks enemy ${target}`);
      setGameState(attackWithCard(gameState, card, target));
      
    }
  }, [targetIndex, selectedCard])

	function handleEndTurn() {
		if (gameState && gameState.state === GAMESTATES.MYTURN) {
			console.log("end turn");
			setGameState(endTurn(gameState));
		}
	}

	function onHandCardClick(c: Card) {
		setSelectedCard((prev) => {
			if (prev && prev.id === c.id) {
        return null;
			}
			return c;
		});
	}

	function onEnemyClick(index: number) {
		setTarget((prev) => {
			if (prev === index) {
				return null;
			}
			return index;
		});
	}

	if (!gameState) return null;

	console.log(gameState);

	return (
		<div className="game-test-arena" style={{ backgroundColor: gameState.arena.background, height: "100vh", padding: "1rem" }}>
			<h1>
				Arena: {gameState.arena.name} {gameState.state}
			</h1>
			<h2>
				Health: {gameState.myHealth} / {gameState.myMaxHealth} <br />
        APS: {gameState.aps} / {gameState.maxAps}
			</h2>

			{gameState.state === GAMESTATES.MYTURN && (
				<div className="commands">
					TURN: {gameState.turn}
					<button onClick={handleEndTurn}>End Turn</button>
				</div>
			)}

			{gameState.state === GAMESTATES.ENEMYTURN && <div className="commands">Enemy turn</div>}

			<h2>Enemies</h2>
			<div className="enemies">
				{gameState.arena.enemies.map((enemy, index) => {
					return <EnemyCard key={`enemy-${index}`} enemy={enemy} index={index} onClick={onEnemyClick}/>;
				})}
			</div>

			<h2>
				Hand (Deck: {gameState.deck.deckSize()} Discard: {gameState.deck.discardSize()})
			</h2>
			<div className="hand">
				{gameState.hand.map((card, index) => {
					return <HandCard key={`card-${index}`} card={card} onClick={onHandCardClick} selected={selectedCard && selectedCard.id === card.id ? true : false} />;
				})}
			</div>
		</div>
	);
}

export default App;
