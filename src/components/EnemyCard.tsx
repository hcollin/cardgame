import { Enemy } from "../game/Enemy";

import attImg from "./pics/attack.png";
import healthImg from "./pics/health.png";

import "./enemycard.css";
import { EffectRow } from "./EffectIcon";
import { useDrop } from "react-dnd";

interface EnemyCardProps {
	enemy: Enemy;
	index: number;
	onClick?: (index: number) => void;
	onSelect?: (enemy: Enemy) => void;
	onDrop?: (enemy: Enemy) => void;
}

export default function EnemyCard(props: EnemyCardProps) {
	
	const [{isOver, canDrop}, drop] = useDrop({
		accept: "Card",
		drop: (item: any) => {
			if(props.onDrop) {
				props.onDrop(props.enemy);
			}
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
		})
	});
		
	
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

	if (props.enemy.isDead()) {
		return null;
	}

    const stats = props.enemy.getStats();
	
	const cn = `enemy ${isOver ? "isOverTrue" : ""}`;
	return (
		<div className={cn} onClick={handleClick} ref={drop}>
            {props.enemy.image.length > 10 && <img src={props.enemy.image} alt={props.enemy.getName()} />}
            <div className="data">
                <h1>{props.enemy.getName()}</h1>

				<EffectRow effects={stats.effects} />

                <footer>
                    <div className="att"><img src={attImg} alt="Attack Damage" /> {stats.damage}</div>
                    <div className="health"><img src={healthImg} alt="Health" /> {stats.health}</div>
                </footer>
            </div>
			
		</div>
	);
}
