import { GameState } from "../models/GameState";

import healthIcon from "./icons/health.png";
import armorIcon from "./icons/armor.png";
import energyIcon from "./icons/energy.png";
import experienceIcon from "./icons/experience.png";
import dodgeIcon from "./icons/dodge.png";
import drIcon from "./icons/damagereduction.png";

import "./hero-info.css";

function HeroInfo(props: { gameState: GameState }) {
	const { gameState } = props;

	return (
		<div className="hero-info">
			<div className="small-value experience">
				<div className="icon">
					<img src={experienceIcon} alt="Experience" />
				</div>
				<div className="value">{gameState.hero.getExperience()}</div>
			</div>

			<div className="name-info">
				<h1>{gameState.hero.getName()}</h1>
				<h2>
					level {gameState.hero.getLevel()} {gameState.hero.getClassName()}
				</h2>
			</div>

			<div className="value energy">
				<div className="icon">
					<img src={energyIcon} alt="Energy" />
				</div>
				<div className="values">
					<span className="main">{gameState.hero.getEnergy()}</span>
					<span className="base"> / {gameState.hero.getEffectedEnergy()}</span>
				</div>
			</div>

			<div className="value health">
				<div className="icon">
					<img src={healthIcon} alt="Health" />
				</div>
				<div className="values">
					<span className="main">{gameState.hero.getHealth()}</span>
					<span className="base"> / {gameState.hero.getMaxHealth()}</span>
				</div>
			</div>

			<div className="value armor">
				<div className="icon">
					<img src={armorIcon} alt="Armor" />
				</div>
				<div className="values">
					<span className="main">{gameState.hero.getArmor()}</span>
					<span className="base"> / {gameState.hero.getEffectedArmor()}</span>
				</div>
			</div>

			<div className="small-value dodge">
				<div className="icon">
					<img src={dodgeIcon} alt="Dodge" />
				</div>
				<div className="value">{gameState.hero.getDodge()}%</div>
			</div>

			<div className="small-value damage-reduction">
				<div className="icon">
					<img src={drIcon} alt="Damage Reduction" />
				</div>
				<div className="value">{gameState.hero.getDamageReduction()}</div>
			</div>
		</div>
	);
}

export default HeroInfo;
