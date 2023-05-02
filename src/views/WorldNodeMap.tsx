


import { CSSProperties, useEffect, useState } from "react";
import { Campaign } from "../models/Campaign";
import { LOCATIONSTATUS, Location, MapLocation, NodeLocation } from "../models/World";
import { buildMapLocations, buildNodeLocations } from "../game/WorldTools";
import { useWindowDimensions } from "../utils/useWindowDimensions";

import Banner from "../components/Banner";

import iconCamp from "./icons/camp.png";
import iconDungeon from "./icons/dungeon.png";
import iconForest from "./icons/forest.png";
import iconMountain from "./icons/mountain.png";
import iconCastle from "./icons/castle.png";
import iconHut from "./icons/hut.png";
import iconTent from "./icons/tent.png";
import iconGraveyard from "./icons/graveyard.png";
import iconLocked from "./icons/locked.png";
import iconCompleted from "./icons/completed.png";

import "./world-map.css";
import DifficultyMeter from "../components/DifficultyMeter";
import { createCampaign } from "../game/CampaignTools";

function WorldNodeMap(props: { campaign: Campaign; updateCampaign: (c: Campaign) => void; startArena: () => void }) {
	const { height, width } = useWindowDimensions();

	const locations = props.campaign.world;

	const [mapLocs, setMapLocs] = useState<NodeLocation[]>(buildNodeLocations(props.campaign));

	useEffect(() => {
		const newMapLocs = buildNodeLocations(props.campaign);

		if (newMapLocs.filter((l) => l.status === LOCATIONSTATUS.SELECTABLE).length === 0) {
			// console.log("MAP COMPLETED");
		}

		setMapLocs(newMapLocs);
	}, [props.campaign]);

	function selectLocation(mloc: NodeLocation) {
		if (mloc.status === LOCATIONSTATUS.ACTIVE) {
			props.startArena();
			return;
		}

		if (mloc.status !== LOCATIONSTATUS.SELECTABLE) {
			return;
		}
		props.updateCampaign({ ...props.campaign, currentLocationId: mloc.id });
	}

	function restartCampaign() {
		console.log("RESTART CAMPAIGN");
		const nCampaign = createCampaign();
		setMapLocs(buildNodeLocations(nCampaign));
		props.updateCampaign(nCampaign);
	}

	
	return (
		<div className="world-map">
			<div className="nodes">
				{mapLocs.map((ml, i) => {
					return <LocationNode key={ml.id} location={ml} selectLocation={selectLocation} />;
					// return <LocationNode key={ml.id} location={ml} maxDepth={maxDepth} maxTrak={maxTrak} nodeSpace={nps} selectLocation={selectLocation} />;
				})}
			</div>
			<div className="map-title">World Map</div>
			{props.campaign.hero.isDead() && (
				<div className="death">
					<h2>
						Our brave hero <span>{props.campaign.hero.getName()}</span> is dead...
					</h2>
					<div className="restart">
						<div className="empty"></div>
						<div className="btn">
							<button onClick={restartCampaign}>Restart</button>
						</div>
						<div className="empty"></div>
					</div>
				</div>
			)}
		</div>
	);
}

function LocationNode(props: { location: NodeLocation; selectLocation: (mloc: NodeLocation) => void }) {
	function handleClick() {
		props.selectLocation(props.location);
	}

    const nodeStyle: CSSProperties = {
		left: props.location.x + "px",
        top: props.location.y + "px",
		// marginLeft: (maxWidth / 2) * -1 + "px",
		// bottom: "50%",
		// marginBottom: (maxDepth / 2) * -1 + props.location.depth * props.nodeSpace + "px",
		// width: props.nodeSpace + "px",
		// height: props.nodeSpace + "px",
	};

	return (
		<div className="location-node-two" style={nodeStyle} onClick={handleClick}>
			<div className="icon">
				{props.location.icon === "dungeon" && <img src={iconDungeon} alt="dungeon" />}
				{props.location.icon === "forest" && <img src={iconForest} alt="forest" />}
				{props.location.icon === "mountain" && <img src={iconMountain} alt="mountain" />}
				{props.location.icon === "camp" && <img src={iconCamp} alt="camp" />}
				{props.location.icon === "castle" && <img src={iconCastle} alt="castle" />}
				{props.location.icon === "hut" && <img src={iconHut} alt="hut" />}
				{props.location.icon === "tent" && <img src={iconTent} alt="tent" />}
				{props.location.icon === "graveyard" && <img src={iconGraveyard} alt="graveyard" />}
			</div>
		</div>
	)

}

export default WorldNodeMap;
