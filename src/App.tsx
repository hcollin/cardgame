import Arena from "./components/Arena";

import "./App.css";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createGame } from "./game/GameService";
import { useEffect, useState } from "react";
import { GAMESTATES, GameState } from "./models/GameState";

import { arnd } from "rndlib";
import MainMenu from "./components/MainMenu";
import { Campaign } from "./models/Campaign";
import {
	createCampaign,
	createGameForArena,
	createGameFromCampaign,
	markCurrentLocationCompleted,
	selectActiveLocationFromCampaign,
	setActiveLocationForCampaign,
} from "./game/CampaignTools";
import HeroView from "./components/HeroView";
import { LOCATIONSTATUS, Location } from "./models/World";
import LocationView from "./components/LocationView";
import { resetHero } from "./game/HeroTools";
import { HeroStats } from "./models/HeroStats";
import WorldMap from "./components/WorldMap";

import iconMap from "./components/icons/map.png";
import iconCharacter from "./components/icons/character.png";

const isMobile = false;

function App() {
	const [campaign, setCampaign] = useState<Campaign>(createCampaign());

	const [gameState, setGameState] = useState<GameState | null>(null);

	const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

	const [vm, setVm] = useState<string>("MAP"); // MAP || CHARACTER

	useEffect(() => {
		const loc = campaign.world.get(campaign.currentLocationId);
		if (loc) {
			console.log(`Current Location ${loc.arena[0].name}`);
			setCurrentLocation(loc);
		}
	}, [campaign.currentLocationId]);

	function arenaDone(gs: GameState) {
		console.log("ARENA COMPLETED: ", gs.state, " : ", campaign);



		const ngs = { ...gs };

		if (ngs.state === GAMESTATES.ARENA_COMPLETED) {
			setCampaign({ ...markCurrentLocationCompleted(campaign), hero: resetHero(ngs.hero, false) });
		} else {
			setCampaign({ ...campaign, hero: gs.hero });
		}
		setGameState(null);
	}

	function startArena() {
		if (currentLocation) {

			const ar = currentLocation.arena[0];
			if (ar) {
				console.log(`Start Arena ${ar.name}`, campaign);
				setGameState(createGameForArena(ar, campaign.hero));
			}
		}
	}

	function selectNextLocation(lid: string) {
		if (currentLocation?.status === LOCATIONSTATUS.COMPLETED) {
			setCampaign(setActiveLocationForCampaign(campaign, lid));
		}
	}

	function updateHero(hero: HeroStats) {
		setCampaign({ ...campaign, hero: hero });
	}

	function updateCampaign(campaign: Campaign) {
		console.log("Update Campaign", campaign.currentLocationId);
		setCampaign({ ...campaign });
	}

	const backend = isMobile ? TouchBackend : HTML5Backend;

	let viewMode = "MENU";

	if (gameState !== null) {
		viewMode = "ARENA";
	}




	return (
		<DndProvider backend={backend}>
			{gameState === null && (
				<div className="main-screen">
					<nav>
						<button onClick={() => setVm("MAP")}>
							<img src={iconMap} alt="Map" />
							Map
							</button>
						<button onClick={() => setVm("CHARACTER")}>
							<img src={iconCharacter} alt="Character" />
							Character
						</button>
					</nav>
					{/* <MainMenu campaign={campaign} update={setCampaign} /> */}
					{vm === "MAP" && <WorldMap campaign={campaign} updateCampaign={updateCampaign} startArena={startArena} />}
					{/* {currentLocation && <LocationView loc={currentLocation} onArenaSelect={startArena} onSelectLocation={selectNextLocation}/>} */}
					{vm === "CHARACTER" && <HeroView hero={campaign.hero} updateHero={updateHero} />}
				</div>
			)}
			{gameState !== null && <Arena gs={gameState} onArenaFinished={arenaDone} />}
		</DndProvider>
	);
}


export default App;
