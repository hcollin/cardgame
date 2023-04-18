

import Arena from "./components/Arena";

import "./App.css";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createGame, startGame } from "./game/GameService";
import { useEffect, useState } from "react";
import { GAMESTATES, GameState } from "./models/GameState";
import { selectNextLocation } from "./game/WorldTools";
import { arnd } from "rndlib";
import MainMenu from "./components/MainMenu";

const isMobile = false;


function App() {

	const [gameState, setGameState] = useState<GameState>(createGame());

	const backend = isMobile ? TouchBackend : HTML5Backend;

	
	// Actual Arena states as an array
	const arenaStates = [GAMESTATES.ARENA_MYTURN, GAMESTATES.ARENA_ENEMYTURN, GAMESTATES.ARENAWON, GAMESTATES.ENEMYTURN, GAMESTATES.MYTURN];

	return (
		<DndProvider backend={backend}>
			{gameState.state === GAMESTATES.INIT && <MainMenu gs={gameState} update={setGameState}/>}
			{arenaStates.includes(gameState.state) && <Arena gs={gameState} />}
		</DndProvider>
	)
}

export default App;
