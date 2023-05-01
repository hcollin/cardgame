import { Campaign } from "../models/Campaign";
import { GAMESTATES, GameState } from "../models/GameState";

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

function ArenaDevTools(props: { gs: GameState; update: (gs: GameState) => void }) {
	function killHero() {
		props.gs.hero.takeDamage(100000);
		props.gs.state = GAMESTATES.DEAD;
		props.update({ ...props.gs });
	}

    function winArena() {
        props.gs.state = GAMESTATES.ARENA_VICTORY;
        props.update({ ...props.gs });
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
