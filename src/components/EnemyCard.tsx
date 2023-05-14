import { ENEMYSTATUS, Enemy } from "../game/Enemy";

import { EffectRow } from "./EffectIcon";
import { useDrop } from "react-dnd";
import { Card, DAMAGETYPE, TARGETS } from "../models/Card";
import { EFFECTS } from "../models/Effects";
import { useEffect, useState } from "react";

import blockImg from "./icons/armor.png";
import healthImg from "./icons/health.png";

import deadImg from "./icons/skull.png";

import "./enemycard.css";
import "./enemy-card.css";
import { GameState } from "../models/GameState";

interface EnemyCardProps {
	enemy: Enemy;
	index: number;
	size?: "mini" | "small" | "medium" | "big";
	gs: GameState;
	onClick?: (index: number) => void;
	onSelect?: (enemy: Enemy) => void;
	onDrop?: (enemy: Enemy) => void;
}

const DAMAGECLEANTIMEOUT = 3000;

export default function EnemyCard(props: EnemyCardProps) {
	const enemy = props.enemy;

	const [currentDamage, setCurrentDamage] = useState<{ type: DAMAGETYPE; amount: number; ts: number }[]>([]);

	const [{ isOver, canDrop, isDragging }, drop] = useDrop({
		accept: "Card",
		drop: (item: any) => {
			if (props.onDrop) {
				props.onDrop(props.enemy);
			}
		},
		canDrop: (card: Card) => {
			return card.allowedTargets.includes(TARGETS.ENEMY) || card.allowedTargets.includes(TARGETS.ALLENEMIES);
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
			isDragging: !!monitor.getItem(),
		}),
	});

	// Showing damage on the card and clearing it after a while
	useEffect(() => {
		setCurrentDamage((prev) => {
			return prev.concat(
				props.enemy.damageTaken.map((d) => {
					return { ...d, ts: Date.now() };
				}),
			);
		});

		setTimeout(() => {
			setCurrentDamage((prev) => {
				return prev.filter((d) => {
					return Date.now() - d.ts < DAMAGECLEANTIMEOUT;
				});
			});
		}, DAMAGECLEANTIMEOUT);
	}, [props.enemy.damageTaken]);

	function handleClick() {
		if (props.onClick) {
			props.onClick(props.index);
			return;
		}
		if (props.onSelect) {
			props.onSelect(props.enemy);
			return;
		}
	}

	function clearDamage() {
		setTimeout(() => {}, 2000);
	}

	// if (props.enemy.isDead()) {
	// 	return null;
	// }

	const stats = enemy.getStats(props.gs);
	const cns: string[] = ["enemy-card"];
	const contCns: string[] = ["enemy-container", props.size || "medium"];

	if (!enemy.isDead()) {
		if (isDragging && canDrop && !isOver) cns.push("valid-target");
		if (isDragging && canDrop && isOver) cns.push("isOverTrue");
		if (isDragging && !canDrop) cns.push("invalid-target");

		if (enemy.effectIsActive(EFFECTS.STUNNED)) { cns.push("is-stunned no-action"); contCns.push("no-action")}
		if (enemy.effectIsActive(EFFECTS.BURNING)) cns.push("is-burning");
		if (enemy.effectIsActive(EFFECTS.POISONED)) cns.push("is-poisoned");
		if (enemy.effectIsActive(EFFECTS.FROZEN)) {cns.push("is-frozen no-action"); contCns.push("no-action")}
	} else {
		cns.push("is-dead");
	}

	cns.push(props.size || "medium");

	

	// cns.push(stats.size.toLowerCase());
	// const cn = `enemy ${isDragging ? (canDrop ? (isOver ? "isOverTrue" : "valid-target") : "invalid-target"): ""}`;
	const cn = cns.join(" ");

	return (
		<div className={contCns.join(" ")} ref={drop}>
			<div className={cn} onClick={handleClick} >
				{props.enemy.image.length > 10 && (
					<div className="img-container">
						<img src={props.enemy.image} alt={props.enemy.getName()} />
						<div className="shadow"></div>
					</div>
				)}

				{/* <div className="layout">&nbsp;</div> */}

				<div className="content layout">
					<div className="name">{enemy.getName()}</div>

					<div className="health">{stats.health}</div>

					{stats.block > 0 && <div className="block">{stats.block}</div>}

					<div className="groups">{stats.groups.join(" ")}</div>
				</div>
			</div>
			{stats.status === ENEMYSTATUS.ALIVE && <div className="next-action">{stats.action}</div>}
			{currentDamage.length > 0 && (
				<div className="damage-taken">
					{currentDamage.map((dmg, index) => {
						const cns: string[] = ["hit"];
						cns.push(dmg.type.toLowerCase());
						if (props.enemy.isVulnerableTo(dmg.type)) cns.push("vulnerable");
						if (props.enemy.isResistantTo(dmg.type)) cns.push("resistant");

						if (currentDamage.length > 2) cns.push("small");
						return (
							<div key={`hit-${props.enemy.id}-${index}`} className={cns.join(" ")}>
								{dmg.amount}
							</div>
						);
					})}
				</div>
			)}
			<EffectRow effects={stats.effects} />
			{enemy.isDead() && <div className="tombstone">
				<img src={deadImg} alt="Dead" />
			</div>	}
		</div>
	);
}
