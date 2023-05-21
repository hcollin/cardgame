import { ArenaState } from "../models/ArenaState";

import healthIcon from "./icons/health.png";
import armorIcon from "./icons/armor.png";
import energyIcon from "./icons/energy.png";
import experienceIcon from "./icons/experience.png";
import dodgeIcon from "./icons/dodge.png";
import drIcon from "./icons/damagereduction.png";
import goldIcon from "./icons/gold.png";

import "./hero-info.scss";
import ValueCircle from "./common/valueCircle/ValueCircle";
import Icon from "./Icon";

function HeroInfo(props: { arenaState: ArenaState }) {
	const { arenaState } = props;

	const hero = arenaState.hero;

	const hen = hero.getEnergy();
	const hmen = hero.getBaseEnergy();
	const energyBar: boolean[] = new Array<boolean>(Math.max(hen, hmen)).fill(false).reduce((bar, act, i) => {
		if (i < hen) {
			bar.push(true);
		} else {
			bar.push(false);
		}

		return bar;
	}, [] as boolean[]);

	return (
		<div className="hero-info">

			<div className="durability">
				<ValueCircle className="dodge" value={hero.getDodge()} maxValue={100} size={245} gaugeColor="#0F0A" gaugeBgColor="#000E" thickness={10} />
				<ValueCircle className="block" value={hero.getArmor()} maxValue={100} size={215} gaugeColor="#48FA" gaugeBgColor="#000E" thickness={10} />
				<ValueCircle
					className="health"
					value={hero.getHealth()}
					maxValue={hero.getMaxHealth()}
					size={195}
					gaugeBgColor="#000E"
					gaugeColor="#F00A"
					thickness={20}
				/>

				<ValueCircle
					flip
					className="armor"
					value={hero.getDamageReduction()}
					maxValue={20}
					size={120}
					sizeY={60}
					gaugeColor="#FA0A"
					gaugeBgColor="#000E"
					thickness={20}
					startPoint={0.1}
					endPoint={0.4}
				/>

				<div className="values">
					<div className="health-value">
						<Icon type="health" />
						{hero.getHealth()}
					</div>
					<div className="block-value">
						<Icon type="block" />
						{hero.getArmor()}
					</div>
					<div className="dodge-value">
						<Icon type="dodge" />
						{hero.getDodge()}
					</div>
					<div className="armor-value">
						<Icon type="damagereduction" />
						{hero.getDamageReduction()}
					</div>
				</div>
			</div>
			<div className="energy-bar">
				{energyBar.map((energyACtive, i) => {
					return <Icon type="energy" className={energyACtive ? "active" : "spent"} key={`energy-${i}`}/>;
				})}
			</div>

		</div>
	);
}

export default HeroInfo;
