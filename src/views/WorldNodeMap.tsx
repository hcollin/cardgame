import { CSSProperties, useEffect, useState } from "react";
import { Campaign } from "../models/Campaign";
import { LOCATIONSTATUS, Location } from "../models/World";
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

	const [nodes, setNodes] = useState<(Location | null)[][]>(buildNodes(props.campaign));

	useEffect(() => {
		const newMapLocs = buildNodes(props.campaign);

		// if (newMapLocs.filter((l) => l.status === LOCATIONSTATUS.SELECTABLE).length === 0) {
		// 	// console.log("MAP COMPLETED");
		// }

		setNodes(newMapLocs);
	}, [props.campaign]);

	function selectLocation(mloc: Location) {
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
		// setMapLocs(buildNodeLocations(nCampaign));
		props.updateCampaign(nCampaign);
	}

	return (
		<div className="world-map">
			<div className="map-nodes">
				{nodes.map((depth, y) => {
					return (
						<div className="depth" key={`map-depth-${y}`}>
							{depth.map((loc, x) => {
								if (!loc) {
									return <div className="node empty" key={`node-${y}-${x}`}></div>;
								}

								return (
									<div className="node" key={`node-${y}-${x}`} >
										<LocationNode location={loc} selectLocation={selectLocation} />
									</div>
								);
							})}
						</div>
					);
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

function buildNodes(campaign: Campaign): (Location | null)[][] {
	const locArr = Array.from(campaign.world.values());

	const nnmap: (Location | null)[][] = [];
	for (let d = 0; d < campaign.options.mapDepth; d++) {
		const darr: (Location | null)[] = [];

		for (let w = 0; w < campaign.options.mapWidth; w++) {
			const loc = locArr.find((l) => {
				if (!l.loc) return false;
				return l.loc.x === w && l.loc.y === d;
			});
			if (loc) {
				darr.push(loc);
			} else {
				darr.push(null);
			}
		}
		nnmap.push([...darr]);
	}

	console.log(nnmap);
	// nnmap.forEach((row) => {
	// 	console.log(row);
	// });
	return nnmap;
}

function LocationNode(props: { location: Location; selectLocation: (mloc: Location) => void }) {
	function handleClick() {
		props.selectLocation(props.location);
	}

	const dx = props.location.loc !== undefined && props.location.loc.x >= 0 ? props.location.loc.dx * 33 : 0;
	const dy = props.location.loc !== undefined && props.location.loc.y >= 0 ? props.location.loc.dy * 33 : 0;
	
	
	const style: React.CSSProperties ={
		left: `${dx}%`,
		top: `${dy}%`,
	};
	console.log(props.location.loc, dx ,dy, style);

	return (
		<div className="location-node-two" onClick={handleClick} style={style}>
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
	);
}

export default WorldNodeMap;
