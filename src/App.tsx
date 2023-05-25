import "./App.css";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";

import { Campaign } from "./models/Campaign";
import { createCampaign, createEmptyCampaign, createGameForArena, getActiveLocation, markCurrentLocationCompleted } from "./game/CampaignTools";

import { WORLDLOCATIONTYPE } from "./models/LocationModels";

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
import WorldLocation, { ArenaWorldLocation, VillageWorldLocation } from "./game/WorldLocation";
import useClassData from "./utils/observable/useClassData";
import VillageView from "./views/VillageView";
import CharacterSheet from "./components/chrsheet/CharacterSheet";


const isMobile = false;

function App() {
	const [campaign, setCampaign] = useState<Campaign>(createEmptyCampaign());

	const [arenaState, setArenaState] = useState<ArenaState | null>(null);

	const village = useClassData<VillageWorldLocation>(null);

	const [currentLocation, setCurrentLocation] = useState<WorldLocation | null>(null);

	const [vm, setVm] = useState<string>("MAP"); // MAP || CHARACTER

	useEffect(() => {
		if (campaign.id === "EMPTY") {
			const camp = createCampaign();
			// console.log(Array.from(camp.world.values()).map((l) => l.name).join(", "));
			setCampaign(camp);
		}
	}, [campaign.id]);

	useEffect(() => {
		// const actWorld = getActiveWorld(campaign);

		const loc = getActiveLocation(campaign);
		// const loc = campaign.world.get(campaign.currentLocationId);

		if (loc) {
			// console.log(`Current Location ${loc.arena[0].name}`);
			setCurrentLocation(loc);
		}
	}, [campaign]);

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

			const isFinal = loc.nextLocationIds.length === 0;
			setCampaign({ ...markCurrentLocationCompleted({ ...campaign, hero: ngs.hero }, isFinal) });
		} else {
			setCampaign({ ...campaign, hero: as.hero });
		}
		setArenaState(null);
	}

	function leaveVillage() {
		
		village.set(null);
		setCampaign({ ...markCurrentLocationCompleted({ ...campaign }, false) });
	}

	function startArena() {
		if (currentLocation) {
			// Start Arena
			if (currentLocation.type === WORLDLOCATIONTYPE.ARENA) {
				const arLoc = currentLocation as ArenaWorldLocation;
				const ar = arLoc.arena;
				if (ar) {
					effStore.clear();
					console.log(`Start Arena ${ar.name}`, campaign);
					setArenaState(createGameForArena(ar, campaign));
				}
			}

			// Start Village
			if (currentLocation.type === WORLDLOCATIONTYPE.VILLAGE) {
				console.log("START VILLAGE!");
				village.set(currentLocation as VillageWorldLocation);
			}
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

	// console.log("APP.tsx: Render!:", village);

	let viewMode = "MAP";
	if(arenaState !== null) { viewMode = "ARENA"; }
	if(village.instance !== null) { viewMode = "VILLAGE"; }

	// <TestView /> is used to quickly test something like css.
	// return <TestView />;

	return (
		<DndProvider backend={backend}>
			{viewMode === "MAP" && (
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
							<span> Character </span>
						</button>
					</nav>

					{vm === "MAP" && <WorldNodeMap campaign={campaign} updateCampaign={updateCampaign} startArena={startArena} />}
					{vm === "CHARACTER" && <HeroView hero={campaign.hero} updateHero={updateHero} />}
					{/* {vm === "CHARACTER" && <CharacterSheet campaign={campaign} full/>} */}

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
			{viewMode === "ARENA" && arenaState !== null && <Arena as={arenaState} onArenaFinished={arenaDone} />}
			{viewMode === "VILLAGE" && village.instance !== null && village !== null && <VillageView villageLoc={village.instance} campaign={campaign} onLeaveVillage={leaveVillage} updateCampaign={setCampaign}/>}
			<div className="version">
				{metaData.buildMajor}.{metaData.buildMinor}.{metaData.buildRevision} {metaData.buildTag}
			</div>
		</DndProvider>
	);
}

export default App;
