import { GameState } from "../models/GameState";
import ArmorValueContainer from "./ArmorValueContainer";
import EnergyValueContainer from "./EnergyValueContainer";
import HealthValueContainer from "./HealthValueContainer";

import "./hero-info.css";

function HeroInfo(props: { gameState: GameState }) {
	const { gameState } = props;

	const healthPercentage = Math.round((gameState.hero.health / gameState.hero.maxHealth) * 100);

	const percCns: string[] = ["current"];
	if (healthPercentage < 50) {
		percCns.push("low");
	}
	return (
		<div className="hero-info">
			<EnergyValueContainer hero={gameState.hero} />
			<HealthValueContainer hero={gameState.hero} />
			<ArmorValueContainer hero={gameState.hero} />
			{/* <div className="energy">
				{gameState.hero.aps}
				<small>MAX: {gameState.hero.maxAps}</small>
			</div> */}
			{/* <div className="armor">
				<span className="default">{gameState.hero.armor}</span>

			</div> */}
			{/* <div className="health">
				<div
					className={percCns.join(" ")}
					style={!percCns.includes("low") ? { top: `${100 - healthPercentage}%` } : { bottom: `${healthPercentage}%` }}
				>
					{gameState.hero.health}
				</div>
				<div className="meter">
					<div className="bar" style={{ height: `${healthPercentage}%` }}></div>
				</div>
				<div className="max">{gameState.hero.maxHealth}</div>
			</div> */}
			{/* <div className="effects">EF</div> */}

			{/* <div className="numbers">
				<h3>Armor</h3>
				<h1>
					{gameState.hero.armor} <small>/ {gameState.hero.defaultArmor}</small>
				</h1>
				<h3>Health</h3>
				<h1>
					{gameState.hero.health} <small> / {gameState.hero.maxHealth}</small>
				</h1>
				<h3>Energy</h3>
				<h1>
					{gameState.hero.aps} <small> / {gameState.hero.maxAps}</small>
				</h1>
			</div> */}
		</div>
	);
}

export default HeroInfo;
