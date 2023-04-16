import { useState, useEffect } from "react";
import { TestArena } from "../data/TestArena";
import { createGame, startGame, endEnemyTurn, playItemCard, endTurn } from "../game/GameService";
import { Card } from "../models/Card";
import { GameState, GAMESTATES } from "../models/GameState";
import EnemyCard from "./EnemyCard";
import HandCard from "./HandCard";

import "./arena.css";
import ArenaHeader from "./ArenaHeader";
import HeroInfo from "./HeroInfo";

function Arena() {
	const [gameState, setGameState] = useState<GameState>(createGame(new TestArena()));

	const [targetIndex, setTarget] = useState<number | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	useEffect(() => {
		const gs = createGame(new TestArena());
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
		if (targetIndex !== null && selectedCard !== null) {
			const card = selectedCard;
			const target = targetIndex;
			setTarget(null);
			setSelectedCard(null);
			console.log(`Card ${card.name} attacks enemy ${target}`);
			setGameState(playItemCard(gameState, card, targetIndex));
		}
	}, [targetIndex, selectedCard]);

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

	return (
		<div className="arena" style={{ backgroundColor: gameState.arena.background, height: "100vh" }}>
		
            <ArenaHeader gameState={gameState} updateGameState={setGameState} />

			<div className="enemies">
				{gameState.arena.enemies.map((enemy, index) => {
					return <EnemyCard key={`enemy-${index}`} enemy={enemy} index={index} onClick={onEnemyClick} />;
				})}
			</div>

			<div className="lefthand">
				<div>
					<div className="deck">{gameState.leftHandDeck.deckSize()}</div>
					<div className="deck discard">{gameState.leftHandDeck.discardSize()}</div>
				</div>

				{gameState.leftHand.map((card, index) => {
					return (
						<HandCard
							key={`card-left-${index}`}
							card={card}
							onClick={onHandCardClick}
							selected={selectedCard && selectedCard.id === card.id ? true : false}
						/>
					);
				})}
			</div>

			<div className="righthand">
				{gameState.rightHand.map((card, index) => {
					return (
						<HandCard
							key={`card-right-${index}`}
							card={card}
							onClick={onHandCardClick}
							selected={selectedCard && selectedCard.id === card.id ? true : false}
						/>
					);
				})}
				<div>
					<div className="deck">{gameState.rightHandDeck.deckSize()}</div>
					<div className="deck discard">{gameState.rightHandDeck.discardSize()}</div>
				</div>
			</div>

			<HeroInfo gameState={gameState} />
		</div>
	);
}

export default Arena;
