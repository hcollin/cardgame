import { startGame } from "../game/GameService";
import { GameState } from "../models/GameState";



function MainMenu(props: { gs: GameState, update: (gs: GameState) => void }) {

    function startGameHandler() {
        const gs = startGame(props.gs);
        props.update({...gs});
    }

    return (
        <div>
            <h1>Main menu</h1>

            <button onClick={startGameHandler}>Start game</button>
        </div>
    )
}

export default MainMenu;