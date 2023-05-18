import { endTurn } from "../game/GameService";
import { ARENASTATES, ArenaState } from "../models/ArenaState";


import "./arena-header.css";

function ArenaHeader(props: { arenaState: ArenaState; updatearenaState: (as: ArenaState) => void }) {
	const { arenaState } = props;

	function handleEndTurn() {
		if (arenaState && arenaState.state === ARENASTATES.MYTURN) {
			props.updatearenaState(endTurn(arenaState));
		}
	}

	const endTurnActive = arenaState.hero.getEnergy() === 0;

	return (
		<header className="arena-header">
			<div className="title">Frost Troll <span>Quest</span></div>
			<div className="data">
				{arenaState.state === ARENASTATES.MYTURN && (
					<>
						<span className="turn-info">Turn <big>{arenaState.turn}</big></span>
						<span className="state-info"><small>in</small> {arenaState.arena.name}</span>
					</>
				)}
				{arenaState.state === ARENASTATES.ENEMYTURN && <span className="header-enemy">Enemy turn</span>}
			</div>
			<div className={`end-turn ${endTurnActive ? "clickme": ""}`}>
				<button onClick={handleEndTurn} disabled={arenaState.state !== ARENASTATES.MYTURN}>
					End Turn
				</button>
			</div>
		</header>
	);
}

export default ArenaHeader;
