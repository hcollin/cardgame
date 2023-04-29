import { useState, useEffect, CSSProperties } from "react";

import { endEnemyTurn, playItemCard } from "../game/GameService";
import { Card } from "../models/Card";
import { GameState, GAMESTATES } from "../models/GameState";

import "./arena.css";
import { Enemy } from "../game/Enemy";
import ArenaHeader from "../components/ArenaHeader";
import EnemyCard from "../components/EnemyCard";
import HandCard from "../components/HandCard";
import HeroInfo from "../components/HeroInfo";
import TargetHero from "../components/TargetHero";
import CardHand from "../components/CardHand";

function Arena(props: { gs: GameState; onArenaFinished: (gameState: GameState) => void }) {
	const [gameState, setGameState] = useState<GameState>(props.gs);

	const [targetIndex, setTarget] = useState<number | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	const [isDragging, setIsDragging] = useState<boolean>(false);

	// useEffect(() => {
	// 	const gs = createGame(new TestArena());
	// 	setGameState(startGame(gs));
	// }, []);

	useEffect(() => {
		console.log("STATE:", gameState.state);
		if (gameState.state === GAMESTATES.ENEMYTURN) {
			setTimeout(() => {
				setGameState(endEnemyTurn(gameState));
			}, 1000);
		}
		if (gameState.state === GAMESTATES.ARENA_COMPLETED || gameState.state === GAMESTATES.DEAD) {
			setTimeout(() => {
				props.onArenaFinished(gameState);
			}, 2000);
		}
	}, [gameState.state]);

	useEffect(() => {
		if (targetIndex !== null && selectedCard !== null) {
			const card = selectedCard;
			const target = targetIndex;
			setTarget(null);
			setSelectedCard(null);
			// console.log(`Card ${card.name} attacks enemy ${target}`);
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
	if (gameState.arena.bgImage) {
		// console.log(gameState.arena);
		arenaStyle.backgroundImage = `url(${gameState.arena.bgImage})`;
		arenaStyle.backgroundSize = "cover";
	}

	const arenaActive = gameState.state !== GAMESTATES.DEAD && gameState.state !== GAMESTATES.ARENA_COMPLETED;

	return (
		<div className="arena" style={arenaStyle}>
			<ArenaHeader gameState={gameState} updateGameState={setGameState} />

			<div className="enemies">
				{gameState.arena.enemies.map((enemy, index) => {
					return <EnemyCard key={enemy.id} enemy={enemy} index={index} onClick={onEnemyClick} onDrop={onEnemyDrop} />;
				})}
			</div>

			<CardHand gs={gameState} side="LEFT" onDrag={setIsDragging} onSelect={setSelectedCard}/>
		
			<CardHand gs={gameState} side="RIGHT" onDrag={setIsDragging} onSelect={setSelectedCard}/>

			<HeroInfo gameState={gameState} />

			{isDragging && <TargetHero onDrop={playCardOnHero} />}

			{gameState.state === GAMESTATES.DEAD && (
				<div className="large-info dead">
					<span>Defeat</span>
				</div>
			)}

			{gameState.state === GAMESTATES.ARENA_COMPLETED && (
				<div className="large-info victory">
					<span>Victory</span>
				</div>
			)}
		</div>
	);
}

export default Arena;
