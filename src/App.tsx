import "./App.css";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";
import { GAMESTATES, GameState } from "./models/GameState";

import { Campaign } from "./models/Campaign";
import { createCampaign, createEmptyCampaign, createGameForArena, markCurrentLocationCompleted, setActiveLocationForCampaign } from "./game/CampaignTools";

import { LOCATIONSTATUS, Location } from "./models/World";
import WorldMap from "./views/WorldMap";

import iconMap from "./components/icons/map.png";
import iconCharacter from "./components/icons/character.png";
import HeroView from "./views/HeroView";

import frostTrollLogo from "./views/pics/frosttrolllogo.png";
import Arena from "./views/Arena";
import Hero from "./game/Hero";
import { generateRandomWorld } from "./utils/RandomWorldGenerator";

const isMobile = false;

function App() {
	const [campaign, setCampaign] = useState<Campaign>(createEmptyCampaign());

	const [gameState, setGameState] = useState<GameState | null>(null);

	const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

	const [vm, setVm] = useState<string>("MAP"); // MAP || CHARACTER

	useEffect(() => {
		if(campaign.id === "EMPTY") {
			setCampaign(createCampaign());
		}
	}, [campaign.id]);

	useEffect(() => {
		const loc = campaign.world.get(campaign.currentLocationId);
		if (loc) {
			// console.log(`Current Location ${loc.arena[0].name}`);
			setCurrentLocation(loc);
		}
	}, [campaign.currentLocationId]);

	function newCampaign() {
		console.log("CREATE NEW CAMPAIGN");
		setCurrentLocation(null);
		setGameState(null);

		setTimeout(() => {
			setCampaign({...createCampaign()});
		}, 500)
		
	}

	function arenaDone(gs: GameState) {
		// console.log("ARENA COMPLETED: ", gs.state, " : ", campaign);

		const ngs = { ...gs };

		if (ngs.state === GAMESTATES.ARENA_COMPLETED) {
			ngs.hero.arenaReset(campaign.options);
			setCampaign({ ...markCurrentLocationCompleted({ ...campaign, hero: ngs.hero }) });
		} else {
			setCampaign({ ...campaign, hero: gs.hero });
		}
		setGameState(null);
	}

	function startArena() {
		if (currentLocation) {
			const ar = currentLocation.arena[0];
			if (ar) {
				// console.log(`Start Arena ${ar.name}`, campaign);
				setGameState(createGameForArena(ar, campaign));
			}
		}
	}

	function selectNextLocation(lid: string) {
		if (currentLocation?.status === LOCATIONSTATUS.COMPLETED) {
			setCampaign(setActiveLocationForCampaign(campaign, lid));
		}
	}

	function updateHero(hero: Hero) {
		setCampaign({ ...campaign, hero: hero });
	}

	function updateCampaign(campaign: Campaign) {
		// console.log("Update Campaign", campaign.currentLocationId);
		setCampaign({ ...campaign });
	}

	const backend = isMobile ? TouchBackend : HTML5Backend;

	let viewMode = "MENU";

	if (gameState !== null) {
		viewMode = "ARENA";
	}

	// console.log(campaign.id, currentLocation);

	return (
		<DndProvider backend={backend}>
			{gameState === null && (
				<div className="main-screen">
					<nav>
						<button onClick={() => setVm("MAP")} className={`left ${vm === "MAP" ? "selected" : ""}`}>
							<img src={iconMap} alt="Map" />
							Map
						</button>
						<div className="logo">
							<img src={frostTrollLogo} alt="Frost Troll" />
							<div className="txt">
								<h2>Frost Troll</h2>
								<h3>Quest</h3>
							</div>
						</div>
						<button onClick={() => setVm("CHARACTER")} className={`right ${vm === "CHARACTER" ? "selected" : ""}`}>
							<img src={iconCharacter} alt="Character" />
							Character
						</button>
					</nav>
					{/* <MainMenu campaign={campaign} update={setCampaign} /> */}
					{vm === "MAP" && <WorldMap campaign={campaign} updateCampaign={updateCampaign} startArena={startArena} />}
					{/* {currentLocation && <LocationView loc={currentLocation} onArenaSelect={startArena} onSelectLocation={selectNextLocation}/>} */}
					{vm === "CHARACTER" && <HeroView hero={campaign.hero} updateHero={updateHero} />}

					{campaign.hero.isDead() && (
						<div className="death">
							<h2>
								Our brave hero <span>{campaign.hero.getName()}</span> is dead...
							</h2>
							<div className="restart">
								<div className="empty"></div>
								<div className="btn">
									<button onClick={newCampaign}>Try again</button>
								</div>
								<div className="empty"></div>
							</div>
						</div>
					)}
				</div>
			)}
			{gameState !== null && <Arena gs={gameState} onArenaFinished={arenaDone} />}
		</DndProvider>
	);
}

export default App;
