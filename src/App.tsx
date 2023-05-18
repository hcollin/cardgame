import "./App.css";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";

import { Campaign } from "./models/Campaign";
import {
	createCampaign,
	createEmptyCampaign,
	createGameForArena,
	getActiveLocation,
	getActiveWorld,
	markCurrentLocationCompleted,
	setActiveLocationForCampaign,
} from "./game/CampaignTools";

import { LOCATIONSTATUS, LocationData, WORLDLOCATIONTYPE } from "./models/World";

import iconMap from "./components/icons/map.png";
import iconCharacter from "./components/icons/character.png";
import HeroView from "./views/HeroView";

import frostTrollLogo from "./views/pics/frosttrolllogo.png";
import Arena from "./views/Arena";
import Hero from "./game/Hero";

import WorldNodeMap from "./views/WorldNodeMap";
import { effStore } from "./utils/usePlayerEffect";

import { ArenaState, ARENASTATES } from "./models/ArenaState";

import metaData from "./metadata.json";

const isMobile = false;

function App() {
	const [campaign, setCampaign] = useState<Campaign>(createEmptyCampaign());

	const [arenaState, setArenaState] = useState<ArenaState | null>(null);

	const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

	const [vm, setVm] = useState<string>("MAP"); // MAP || CHARACTER

	useEffect(() => {
		if (campaign.id === "EMPTY") {
			const camp = createCampaign();
			// console.log(Array.from(camp.world.values()).map((l) => l.name).join(", "));
			setCampaign(camp);
		}
	}, [campaign.id]);

	useEffect(() => {
		const actWorld = getActiveWorld(campaign);

		const loc = getActiveLocation(campaign);
		// const loc = campaign.world.get(campaign.currentLocationId);

		if (loc) {
			// console.log(`Current Location ${loc.arena[0].name}`);
			setCurrentLocation(loc);
		}
	}, [campaign.currentLocationId]);

	function newCampaign() {
		setCurrentLocation(null);
		setArenaState(null);

		setTimeout(() => {
			setCampaign({ ...createCampaign() });
		}, 500);
	}

	function arenaDone(as: ArenaState) {
		const ngs = { ...as };

		if (ngs.state === ARENASTATES.ARENA_COMPLETED) {
			ngs.hero.arenaReset(campaign.options);

			const loc = getActiveLocation(campaign);

			// const loc = campaign.world.get(campaign.currentLocationId);
			if (!loc) {
				throw new Error("App.tsx:arenaDone: Location not found");
			}

			const isFinal = loc.nextLocations.length === 0;
			setCampaign({ ...markCurrentLocationCompleted({ ...campaign, hero: ngs.hero }, isFinal) });
		} else {
			setCampaign({ ...campaign, hero: as.hero });
		}
		setArenaState(null);
	}

	function startArena() {
		if (currentLocation) {
			// Start Arena
			if (currentLocation.type === WORLDLOCATIONTYPE.ARENA) {
				const ar = currentLocation.arena[0];
				if (ar) {
					effStore.clear();
					console.log(`Start Arena ${ar.name}`, campaign);
					setArenaState(createGameForArena(ar, campaign));
				}
			}

			// Start Village
			if (currentLocation.type === WORLDLOCATIONTYPE.VILLAGE) {
				console.log("START VILLAGE!");
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

	if (arenaState !== null) {
		viewMode = "ARENA";
	}

	// console.log("APP.tsx: Render!:");

	return (
		<DndProvider backend={backend}>
			{arenaState === null && (
				<div className="main-screen">
					<nav>
						<button onClick={() => setVm("MAP")} className={`left ${vm === "MAP" ? "selected" : ""}`}>
							<img src={iconMap} alt="Map" />
							<span>Map</span>
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
							<span> Character</span>
						</button>
					</nav>

					{vm === "MAP" && <WorldNodeMap campaign={campaign} updateCampaign={updateCampaign} startArena={startArena} />}
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
			{arenaState !== null && <Arena as={arenaState} onArenaFinished={arenaDone} />}
			<div className="version">
				{metaData.buildMajor}.{metaData.buildMinor}.{metaData.buildRevision} {metaData.buildTag}
			</div>
		</DndProvider>
	);
}

export default App;
