import { Enemy } from "../game/Enemy";

import attImg from "./pics/attack.png";
import healthImg from "./pics/health.png";

import "./enemycard.css";
import { EffectRow } from "./EffectIcon";

interface EnemyCardProps {
	enemy: Enemy;
	index: number;
	onClick?: (index: number) => void;
	onSelect?: (enemy: Enemy) => void;
}

export default function EnemyCard(props: EnemyCardProps) {
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
	return (
		<div className="enemy" onClick={handleClick}>
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
