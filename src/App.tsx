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

const isMobile = false;

function App() {
	const [campaign, setCampaign] = useState<Campaign>(createCampaign());

	const [gameState, setGameState] = useState<GameState | null>(null);

	const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

	// useEffect(() => {
	// 	if (campaign.currentLocationId !== "") {
	// 		console.log("Start Arena!", campaign.currentLocationId);
	// 		// setGameState(createGameFromCampaign(campaign));
	// 	}
	// }, [campaign]);

	useEffect(() => {
		const loc = campaign.world.get(campaign.currentLocationId);
		if (loc) {
			console.log(`Current Location ${loc.arena[0].name}`);
			setCurrentLocation(loc);
		} else {
			const nloc = selectActiveLocationFromCampaign(campaign);
			if (nloc) {
				console.log("New location", nloc.arena[0].name);
				setCurrentLocation(nloc);
				setCampaign({...campaign, currentLocationId: nloc.id});
			}
		}
	}, [campaign.currentLocationId]);

	function arenaDone(gs: GameState) {
		console.log("ARENA COMPLETED: ", gs.state," : ", campaign);

		const ngs = { ...gs };
		
		if (ngs.state === GAMESTATES.ARENA_COMPLETED) {
			setCampaign({ ...markCurrentLocationCompleted(campaign), hero: resetHero(ngs.hero, false) });
		} else {
			setCampaign({ ...campaign, hero: gs.hero });
		}
		setGameState(null);
	}

	function startArena(arenaIndex: number) {
		if (currentLocation) {
			const ar = currentLocation.arena[arenaIndex];
			if (ar) {
				console.log(`Start Arena ${ar.name}`, campaign);
				setGameState(createGameForArena(ar, campaign.hero));
			}
		}
	}

	function selectNextLocation(lid: string) {
		if(currentLocation?.status === LOCATIONSTATUS.COMPLETED) {
			setCampaign(setActiveLocationForCampaign(campaign, lid));
		}
	}

	function updateHero(hero: HeroStats) {
		setCampaign({...campaign, hero: hero});
	}

	const backend = isMobile ? TouchBackend : HTML5Backend;

	let viewMode = "MENU";

	if(gameState !== null) {
		viewMode = "ARENA";
	}
	



	return (
		<DndProvider backend={backend}>
			{gameState === null && (
				<div className="main-screen">
					<MainMenu campaign={campaign} update={setCampaign} />
					{currentLocation && <LocationView loc={currentLocation} onArenaSelect={startArena} onSelectLocation={selectNextLocation}/>}
					<HeroView hero={campaign.hero} updateHero={updateHero}/>
				</div>
			)}
			{gameState !== null && <Arena gs={gameState} onArenaFinished={arenaDone} />}
		</DndProvider>
	);
}


export default App;
