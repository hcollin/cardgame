import { GameState } from "../models/GameState";
import ArmorValueContainer from "./ArmorValueContainer";
import EnergyValueContainer from "./EnergyValueContainer";
import HealthValueContainer from "./HealthValueContainer";

import healthIcon from "./icons/health.png";
import armorIcon from "./icons/armor.png";
import energyIcon from "./icons/energy.png";
import experienceIcon from "./icons/experience.png";


import "./hero-info.css";
import { getBaseArmorValue } from "../game/HeroTools";

function HeroInfo(props: { gameState: GameState }) {
	const { gameState } = props;

	const healthPercentage = Math.round((gameState.hero.health / gameState.hero.maxHealth) * 100);

	const percCns: string[] = ["current"];
	if (healthPercentage < 50) {
		percCns.push("low");
	}
	return (
		<div className="hero-info">
			
			<div className="value energy">
				<div className="icon"><img src={energyIcon} alt="Energy" /></div>
				<div className="values">
					<span className="main">{gameState.hero.aps}</span>
					<span className="base"> / {gameState.hero.maxAps}</span>
				</div>
			</div>

			<div className="value health">
				<div className="icon"><img src={healthIcon} alt="Health" /></div>
				<div className="values">
					<span className="main">{gameState.hero.health}</span>
					<span className="base"> / {gameState.hero.maxHealth}</span>
				</div>
			</div>

			<div className="value armor">
				<div className="icon"><img src={armorIcon} alt="Armor" /></div>
				<div className="values">
					<span className="main">{gameState.hero.armor}</span>
					<span className="base"> / {getBaseArmorValue(gameState.hero)}</span>
				</div>
			</div>


			<div className="small-value experience">
				<div className="icon"><img src={experienceIcon} alt="Experience" /></div>
				<div className="value">{gameState.hero.experience}</div>
			</div>

		</div>
	);
}

export default HeroInfo;


