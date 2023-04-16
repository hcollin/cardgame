import { endTurn } from "../game/GameService";
import { GAMESTATES, GameState } from "../models/GameState";

import "./arena-header.css";

function ArenaHeader(props: { gameState: GameState, updateGameState: (gs: GameState) => void }) {
	const { gameState } = props;


    function handleEndTurn() {
		if (gameState && gameState.state === GAMESTATES.MYTURN) {
			console.log("end turn");
			props.updateGameState(endTurn(gameState));
		}
	}

	return (
		<header className="arena-header">
			<div className="title">Frost Troll Quest</div>
			<div className="data">
				{gameState.state === GAMESTATES.MYTURN && (
					<span className="header-info">
						{" "}
						Turn {gameState.turn}
						<br />
						{gameState.arena.name}
					</span>
				)}
				{gameState.state === GAMESTATES.ENEMYTURN && <span className="header-enemy">Enemy turn</span>}
			</div>
			<div className="end-turn">
				<button onClick={handleEndTurn} disabled={gameState.state !== GAMESTATES.MYTURN}>
					End Turn
				</button>
			</div>
		</header>
	);
}

export default ArenaHeader;
