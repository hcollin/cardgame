import { useState, useEffect, CSSProperties } from "react";
import { TestArena } from "../data/TestArena";
import { createGame, startGame, endEnemyTurn, playItemCard, endTurn } from "../game/GameService";
import { Card, TARGETS } from "../models/Card";
import { GameState, GAMESTATES } from "../models/GameState";
import EnemyCard from "./EnemyCard";
import HandCard from "./HandCard";

import "./arena.css";
import ArenaHeader from "./ArenaHeader";
import HeroInfo from "./HeroInfo";
import { Enemy } from "../game/Enemy";
import TargetHero from "./TargetHero";

function Arena(props: {gs: GameState}) {
	const [gameState, setGameState] = useState<GameState>(props.gs);

	const [targetIndex, setTarget] = useState<number | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	const [isDragging, setIsDragging] = useState<boolean>(false);

	// useEffect(() => {
	// 	const gs = createGame(new TestArena());
	// 	setGameState(startGame(gs));
	// }, []);

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

	function playCardOnHero() {
		setTarget(-2);
	}

	function onEnemyDrop(e: Enemy) {
		const eIndex = gameState.arena.enemies.findIndex((enemy) => enemy.id === e.id);
		// console.log(`Dropped ${selectedCard?.name} on ${e.getName()} at index ${eIndex}.`);
		if (eIndex > -1) {
			setTarget(eIndex);
		}
	}

	if (!gameState) return null;

	const arenaStyle: CSSProperties = {
		backgroundColor: gameState.arena.background,
		height: "100vh",		
	};
	if(gameState.arena.bgImage) {
		// console.log(gameState.arena);
		arenaStyle.backgroundImage = `url(${gameState.arena.bgImage})`;
		arenaStyle.backgroundSize = "cover";
	}

	const arenaActive = gameState.state !== GAMESTATES.DEAD && gameState.state !== GAMESTATES.ARENA_COMPLETED;


	return (
		<div className="arena" style={arenaStyle}>
			<ArenaHeader gameState={gameState} updateGameState={setGameState} />

			<div className="enemies">§
				{gameState.arena.enemies.map((enemy, index) => {
					return <EnemyCard key={enemy.id} enemy={enemy} index={index} onClick={onEnemyClick} onDrop={onEnemyDrop} />;
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
							key={card.id}
							card={card}
							onDragStart={(c: Card) => {
								setIsDragging(true);
							}}
							onDragEnd={(c: Card) => {
								setSelectedCard(c);
								setIsDragging(false);
							}}
							// onClick={onHandCardClick}

							// selected={selectedCard && selectedCard.id === card.id ? true : false}
						/>
					);
				})}
			</div>

			<div className="righthand">
				{gameState.rightHand.map((card, index) => {
					return (
						<HandCard
							key={card.id}
							card={card}
							onDragStart={(c: Card) => {
								setIsDragging(true);
								setSelectedCard(c);
							}}
							onDragEnd={(c: Card) => {
								setSelectedCard(c);
								setIsDragging(false);
							}}
							// selected={selectedCard && selectedCard.id === card.id ? true : false}
						/>
					);
				})}
				<div>
					<div className="deck">{gameState.rightHandDeck.deckSize()}</div>
					<div className="deck discard">{gameState.rightHandDeck.discardSize()}</div>
				</div>
			</div>

			<HeroInfo gameState={gameState} />

			{isDragging && (
				<TargetHero onDrop={playCardOnHero}/>
			)}
		</div>
	);
}

export default Arena;
