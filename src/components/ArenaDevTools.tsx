import { killTargetEnemy } from "../game/GameService";
import { Campaign } from "../models/Campaign";
import { DAMAGETYPE } from "../models/Card";
import { ARENASTATES, ArenaState } from "../models/ArenaState";

import isDev from "../utils/isDevelopment";

const styles: React.CSSProperties = {
	position: "absolute",
	top: "40%",
	left: "0px",
	width: "100px",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",

	backgroundColor: "rgba(55,55,55,0.5)",
	borderRadius: "1rem",
	padding: "1rem",
	color: "white",
};

function ArenaDevTools(props: { as: ArenaState; update: (as: ArenaState) => void }) {
	function killHero() {
		props.as.hero.takeDamage(100000);
		props.as.state = ARENASTATES.DEAD;
		props.update({ ...props.as });
	}

	function winArena() {


		const arenaState = props.as.arena.enemies.reduce((as, curr) => {

			as = killTargetEnemy(as, curr.id);

			return { ...as };
		}, props.as);

		// arenaState.state = arenaState.ARENA_VICTORY;
		props.update({ ...arenaState });
	}

	if(!isDev()) {
		return null;
	}

	return (
		<div className="arena-dev-tools" style={styles}>
			<div>DEV TOOLS</div>
			<button onClick={killHero}>Kill Hero</button>
			<button onClick={winArena}>Win Now</button>
		</div>
	);
}

export default ArenaDevTools;
