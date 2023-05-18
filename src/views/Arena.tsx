import { useState, useEffect, CSSProperties } from "react";

import { endEnemyTurn, playItemCard } from "../game/GameService";
import { Card, TARGETS } from "../models/Card";
import { ARENASTATES, ArenaState } from "../models/ArenaState";

import { Enemy } from "../game/Enemy";
import ArenaHeader from "../components/ArenaHeader";
import EnemyCard from "../components/EnemyCard";

import HeroInfo from "../components/HeroInfo";
import TargetHero from "../components/TargetHero";
import CardHand from "../components/CardHand";
import { Item } from "../models/Items";
import ItemCard from "../components/ItemCard";
import ArenaDevTools from "../components/ArenaDevTools";
import PlayerEffectsDisplay from "../components/PlayerEffectDIsplay";

import ArenaConsumables from "../components/Consumables";

import "./arena.css";
function Arena(props: { as: ArenaState; onArenaFinished: (arenaState: ArenaState) => void }) {
	const [arenaState, setarenaState] = useState<ArenaState>(props.as);

	const [targetIndex, setTarget] = useState<number | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	const [isDragging, setIsDragging] = useState<boolean>(false);

	// useEffect(() => {
	// 	const as = createGame(new TestArena());
	// 	setarenaState(startGame(as));
	// }, []);

	useEffect(() => {
		// Some delay on for opponent actions
		if (arenaState.state === ARENASTATES.ENEMYTURN) {
			setTimeout(() => {
				setarenaState(endEnemyTurn(arenaState));
			}, 1000);
		}

		// If hero is dead, wait and return to map screen
		if (arenaState.state === ARENASTATES.DEAD) {
			setTimeout(() => {
				props.onArenaFinished(arenaState);
			}, 2000);
		}

		// If all enemies are dead, show victory and then move to rewards
		if (arenaState.state === ARENASTATES.ARENA_VICTORY) {
			setTimeout(() => {
				setarenaState({ ...arenaState, state: ARENASTATES.ARENA_REWARDS });
			}, 2000);
		}

		// If the arena is completed, wait and return to map screen
		if (arenaState.state === ARENASTATES.ARENA_COMPLETED) {
			props.onArenaFinished(arenaState);
		}
	}, [arenaState.state]);

	useEffect(() => {
		if (targetIndex !== null && selectedCard !== null) {
			const card = selectedCard;
			const target = targetIndex;
			setTarget(null);
			setSelectedCard(null);
			// console.log(`Card ${card.name} attacks enemy ${target}`);
			setarenaState(playItemCard(arenaState, card, targetIndex));
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
		const eIndex = arenaState.arena.enemies.findIndex((enemy) => enemy.id === e.id);
		if (eIndex > -1) {
			setTarget(eIndex);
		}
	}

	function updatearenaState(as: ArenaState) {
		setarenaState(as);
	}

	function completeArena() {
		arenaState.hero.gold += arenaState.arena.getGoldReward();
		setarenaState({ ...arenaState, state: ARENASTATES.ARENA_COMPLETED });
	}

	function selectAndPlayCard(card: Card) {
		if (card.allowedTargets.includes(TARGETS.SELF)) {
			setSelectedCard(card);
			setTarget(-2);
		} else {
			const enemiesAlive = arenaState.arena.enemies.filter((e) => !e.isDead());
			if (enemiesAlive.length === 1) {
				const eIndex = arenaState.arena.enemies.findIndex((enemy) => enemy.id === enemiesAlive[0].id);
				setSelectedCard(card);
				setTarget(eIndex);
			}
		}
	}

	if (!arenaState) return null;

	const arenaStyle: CSSProperties = {
		backgroundColor: arenaState.arena.background,
		height: "100vh",
	};

	if (arenaState.arena.bgImage) {
		// console.log(arenaState.arena);
		arenaStyle.backgroundImage = `url(${arenaState.arena.bgImage})`;
		arenaStyle.backgroundSize = "cover";
	}

	// const arenaActive = arenaState.state !== arenaState.DEAD && arenaState.state !== arenaState.ARENA_COMPLETED;

	const enemyCardSize = arenaState.arena.enemies.length > 3 ? "small" : "medium";

	return (
		<div className="arena" style={arenaStyle}>
			<ArenaHeader arenaState={arenaState} updatearenaState={setarenaState} />

			<div className="enemies">
				{arenaState.arena.enemies.map((enemy, index) => {
					return (
						<EnemyCard
							key={enemy.id}
							enemy={enemy}
							index={index}
							onClick={onEnemyClick}
							onDrop={onEnemyDrop}
							size={enemyCardSize}
							as={arenaState}
						/>
					);
				})}
			</div>

			<CardHand as={arenaState} side="LEFT" onDrag={setIsDragging} onSelect={setSelectedCard} onPlay={selectAndPlayCard} />

			<CardHand as={arenaState} side="RIGHT" onDrag={setIsDragging} onSelect={setSelectedCard} onPlay={selectAndPlayCard} />

			<HeroInfo arenaState={arenaState} />

			{isDragging && <TargetHero onDrop={playCardOnHero} />}

			{arenaState.state === ARENASTATES.DEAD && (
				<div className="large-info dead">
					<span>Defeat</span>
				</div>
			)}

			{arenaState.state === ARENASTATES.ARENA_VICTORY && (
				<div className="large-info victory">
					<span>Victory</span>
				</div>
			)}

			{arenaState.state === ARENASTATES.ARENA_REWARDS && <RewardsScreen as={arenaState} onCompleteArena={completeArena} />}
			<div id="zoomedContent"></div>

			<PlayerEffectsDisplay />

			<ArenaConsumables as={arenaState} update={updatearenaState} />

			<ArenaDevTools as={arenaState} update={setarenaState} />
		</div>
	);
}

export default Arena;

function RewardsScreen(props: { as: ArenaState; onCompleteArena: () => void }) {
	const [itemRewards, setItemRewards] = useState<Item[]>(() => {
		return props.as.arena.getRewardOptions();
	});

	function pickItem(item: Item) {
		props.as.hero.addItem(item);
		props.onCompleteArena();
	}

	function healHero() {
		props.as.hero.healHero(Math.round(props.as.hero.getMaxHealth() * 0.33));
		props.onCompleteArena();
	}

	function gainExperience() {
		props.as.hero.gainExperience(props.as.hero.getLevel() * 50);
		props.onCompleteArena();
	}

	return (
		<div className="rewards-container">
			<div className="reward-bar">
				<div className="title">Pick a reward</div>

				<div className="rewards">
					{itemRewards.map((item, index) => {
						return <ItemCard key={item.id} item={item} onClick={pickItem} />;
					})}

					<div className="heal" onClick={healHero}>
						Heal {Math.round(props.as.hero.getMaxHealth() * 0.33)}{" "}
					</div>

					<div className="experience" onClick={gainExperience}>
						Gain <big>{props.as.hero.getLevel() * 50}</big> bonus experience.
					</div>
				</div>
			</div>
		</div>
	);
}
