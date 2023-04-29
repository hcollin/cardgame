import { ENEMYSTATUS, Enemy } from "../game/Enemy";

import attImg from "./pics/attack.png";
import healthImg from "./pics/health.png";

import "./enemycard.css";
import { EffectRow } from "./EffectIcon";
import { useDrop } from "react-dnd";
import { Card, DAMAGETYPE, TARGETS } from "../models/Card";
import { EFFECTS } from "../models/Effects";
import { useEffect, useState } from "react";

interface EnemyCardProps {
	enemy: Enemy;
	index: number;
	onClick?: (index: number) => void;
	onSelect?: (enemy: Enemy) => void;
	onDrop?: (enemy: Enemy) => void;
}

const DAMAGECLEANTIMEOUT = 2000;

export default function EnemyCard(props: EnemyCardProps) {
	const [currentDamage, setCurrentDamage] = useState<{ type: DAMAGETYPE; amount: number; ts: number }[]>([]);

	const [{ isOver, canDrop, isDragging }, drop] = useDrop({
		accept: "Card",
		drop: (item: any) => {
			if (props.onDrop) {
				props.onDrop(props.enemy);
			}
		},
		canDrop: (card: Card) => {
			return card.allowedTargets.includes(TARGETS.ENEMY);
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

	const stats = props.enemy.getStats();
	const cns: string[] = ["enemy"];
	if (!props.enemy.isDead()) {
		if (isDragging && canDrop && !isOver) cns.push("valid-target");
		if (isDragging && canDrop && isOver) cns.push("isOverTrue");
		if (isDragging && !canDrop) cns.push("invalid-target");

		if (props.enemy.effectIsActive(EFFECTS.STUNNED)) cns.push("is-stunned no-action");
		if (props.enemy.effectIsActive(EFFECTS.BURNING)) cns.push("is-burning");
		if (props.enemy.effectIsActive(EFFECTS.POISONED)) cns.push("is-poisoned");
		if (props.enemy.effectIsActive(EFFECTS.FROZEN)) cns.push("is-frozen no-action");
	} else {
		cns.push("is-dead");
	}

	cns.push(stats.size.toLowerCase());
	// const cn = `enemy ${isDragging ? (canDrop ? (isOver ? "isOverTrue" : "valid-target") : "invalid-target"): ""}`;
	const cn = cns.join(" ");

	return (
		<div className={cn} onClick={handleClick} ref={drop}>
			{props.enemy.image.length > 10 && <img src={props.enemy.image} alt={props.enemy.getName()} />}
			<div className="data">
				<h1>{props.enemy.getName()}</h1>

				<EffectRow effects={stats.effects} />

				<footer>
					<div className="health">
						<img src={healthImg} alt="Health" /> {stats.health}
					</div>
				</footer>
			</div>
			{stats.status === ENEMYSTATUS.ALIVE && <div className="next-action">{stats.action}</div>}
			{currentDamage.length > 0 && (
				<div className="damage-taken">
					{currentDamage.map((dmg, index) => {
						const cns: string[] = ["hit"];
						cns.push(dmg.type.toLowerCase());
						if(props.enemy.isVulnerableTo(dmg.type)) cns.push("vulnerable");
						if(props.enemy.isResistantTo(dmg.type)) cns.push("resistant");

						if (currentDamage.length > 2) cns.push("small");
						return (
							<div key={`hit-${props.enemy.id}-${index}`} className={cns.join(" ")}>
								{dmg.amount}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
