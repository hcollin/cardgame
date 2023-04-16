import { GameState } from "../models/GameState";

import "./hero-info.css";

function HeroInfo(props: {gameState: GameState}) {
    const {gameState} = props;
    return (
        <div className="hero-info">
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
			</div>
    );
}

export default HeroInfo;