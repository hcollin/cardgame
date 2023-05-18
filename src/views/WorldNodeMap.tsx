import { useEffect, useState } from "react";
import { Campaign } from "../models/Campaign";
import { LOCATIONSTATUS, Location } from "../models/World";
import { useWindowDimensions } from "../utils/useWindowDimensions";


import iconCamp from "./icons/camp.png";
import iconDungeon from "./icons/dungeon.png";
import iconForest from "./icons/forest.png";
import iconMountain from "./icons/mountain.png";
import iconCastle from "./icons/castle.png";
import iconHut from "./icons/hut.png";
import iconTent from "./icons/tent.png";
import iconGraveyard from "./icons/graveyard.png";

import "./world-map.css";

import { activateLocation, createCampaign, getActiveWorld } from "../game/CampaignTools";

interface RouteCoords {
	x: number;
	y: number;
	dx: number;
	dy: number;
}

function WorldNodeMap(props: { campaign: Campaign; updateCampaign: (c: Campaign) => void; startArena: () => void }) {
	const { height, width } = useWindowDimensions();

	// const locations = world.getLocationsArray();

	const [nodes, setNodes] = useState<(Location | null)[][]>(buildNodes(props.campaign));

	const [hoverNode, setHoverNode] = useState<Location | null>(null);

	useEffect(() => {
		const newMapLocs = buildNodes(props.campaign);

		// if (newMapLocs.filter((l) => l.status === LOCATIONSTATUS.SELECTABLE).length === 0) {
		// 	// console.log("MAP COMPLETED");
		// }
		// console.log("building nodes");

		setNodes(newMapLocs);
	}, [props.campaign]);


	const world = getActiveWorld(props.campaign);
	if(!world) { return null; }
	world.activeLocationId = props.campaign.currentLocationId;
	
	

	function selectLocation(mloc: Location) {
		// console.log("SELECT LOCATION", mloc);

		if (mloc.status === LOCATIONSTATUS.ACTIVE) {
			props.startArena();
			return;
		}

		if (mloc.status !== LOCATIONSTATUS.SELECTABLE) {
			return;
		}

		// if (mloc.id === props.campaign.currentLocationId) {
		// 	props.startArena();
		// 	return;
		// }
		
		props.updateCampaign(activateLocation(props.campaign, mloc.id));
	}

	function restartCampaign() {
		console.log("RESTART CAMPAIGN");
		const nCampaign = createCampaign();
		// setMapLocs(buildNodeLocations(nCampaign));
		props.updateCampaign(nCampaign);
	}

	const isMobile = width <= 600 || height <= 600;
	
	const tilt = width > height && !isMobile ? "tilt" : "";


	const nodeSize = isMobile ? 50 : 6 * 12;

	const nodeStyle: React.CSSProperties = {
		width: `${nodeSize}px`,
		height: `${nodeSize}px`,
	};
	
	
	const curLoc = world.locations.get(props.campaign.currentLocationId);

	return (
		<div className={`world-map`}>
			<div className={`map-nodes ${tilt}`}>
				<div className="routes">
					{nodes.map((depth, y) => {
						return depth.map((loc, x) => {
							if (!loc) {
								return null;
							}

							return loc.nextLocations.map((to, ind) => {
								const target = world.locations.get(to);
								if (!target) return null;
								return <RouteLine key={`${loc.id}-route-${ind}`} from={loc} to={target} size={nodeSize} tilt={width > height} isMobile={isMobile} />;
							});
						});
					})}
				</div>

				{nodes.map((depth, y) => {
					return (
						<div className="depth" key={`map-depth-${y}`}>
							{depth.map((loc, x) => {
								if (!loc) {
									return <div className="node empty" key={`node-${y}-${x}`} style={nodeStyle}></div>;
								}

								const cns: string[] = ["node"];
								// if (hoverNode && hoverNode.nextLocations.includes(loc.id)) {
								// 	cns.push("next");
								// }

								return (
									<div className={cns.join(" ")} key={`node-${y}-${x}`} style={nodeStyle}>
										{/* {routesTo.map((to, ind) => { */}
										{/* return <RouteLine key={`${loc.id}-route-${ind}`} from={routeFrom} to={to} size={nodeSize} tilt={width > height} />; */}
										{/* })} */}

										<LocationNode
											location={loc}
											selectLocation={selectLocation}
											onHover={setHoverNode}
											isActive={loc.id === props.campaign.currentLocationId}
										/>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>

			 
			{curLoc && <LocationInfo loc={curLoc} />}
			<div className="map-title">{world.name}</div>
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
	const world = getActiveWorld(campaign);
	if(!world) { return []; }
	world.updateLocationStatuses();
	const locArr = world.getLocationsArray();
	// const locArr = Array.from(updateLocations(campaign.world, campaign.currentLocationId).values());

	const depth = campaign.options.mapDepth + 1;

	const nnmap: (Location | null)[][] = [];

	for (let d = 0; d < depth; d++) {
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

	// nnmap.forEach((row) => {
	// 	console.log(row);
	// });

	return nnmap.reverse();
}

function LocationNode(props: { location: Location; selectLocation: (mloc: Location) => void; isActive: boolean; onHover?: (loc: Location | null) => void }) {
	function handleClick() {
		props.selectLocation(props.location);
	}

	function handleHover() {
		if (props.onHover) {
			props.onHover(props.location);
		}
	}

	function handleHoverEnd() {
		if (props.onHover) {
			props.onHover(null);
		}
	}

	const dx = props.location.loc !== undefined && props.location.loc.x >= 0 ? props.location.loc.dx * 33 : 0;
	const dy = props.location.loc !== undefined && props.location.loc.y >= 0 ? props.location.loc.dy * 33 : 0;

	const style: React.CSSProperties = {
		left: `${dx}%`,
		top: `${dy}%`,
	};
	// console.log(props.location.loc, dx, dy, style);

	const cns: string[] = ["location-node-two"];
	if (props.location.status === LOCATIONSTATUS.SELECTABLE) cns.push("selectable");
	if (props.location.status === LOCATIONSTATUS.ACTIVE) cns.push("active");
	// if(props.isActive) cns.push("active");
	if (props.location.status === LOCATIONSTATUS.COMPLETED) cns.push("completed");

	return (
		<div className={cns.join(" ")} onClick={handleClick} style={style} onMouseOver={handleHover} onMouseOut={handleHoverEnd}>
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
			{props.isActive && <div className="active-ring"></div>}
		</div>
	);
}

function RouteLine(props: { from: Location; to: Location; size: number; tilt: boolean, isMobile: boolean }) {
	const { from, to, size, tilt } = props;

	if (!from.loc || !to.loc) return null;

	// if (from.loc.x !== 2) return null;
	// if (from.loc.y !== 3) return null;

	// if(from.loc.x > 0) return null;
	// if(from.loc.y > 0) return null;

	// Three drawing options: one from top-left to bottom-right, one from bottom-left to top-right, and one from center-left to center-right.
	// The first and third can be drawn using the same calculations
	// if the target x is smaller than the origin x the second option is used

	let width,
		height,
		cx,
		cy,
		sx,
		sy,
		ex,
		ey = 0;

	width = tilt ? size * 2 : size * Math.abs(Math.max(to.loc.x, from.loc.x) - Math.min(from.loc.x, to.loc.x) + 1);
	height = tilt ? size * Math.abs(Math.max(to.loc.x, from.loc.x) - Math.min(from.loc.x, to.loc.x) + 1) : size * 2;

	if (to.loc.x >= from.loc.x) {
		// This calculcation handles the first and third options

		cx = tilt ? from.loc.y * size : from.loc.x * size;
		cy = tilt ? from.loc.x * size : from.loc.y * size;

		sx = tilt ? size / 2 : size / 2;
		sy = tilt ? size / 2 : size * 1.5;

		ex = tilt ? width - size / 2 : width - size / 2;
		ey = tilt ? height - size / 2 : size / 2;
	} else {
		cx = tilt ? from.loc.y * size : to.loc.x * size;
		cy = tilt ? to.loc.x * size : from.loc.y * size;

		sx = tilt ? size / 2 : width - size / 2;
		sy = tilt ? height - size / 2 : size * 1.5;

		ex = tilt ? width - size / 2 : size / 2;
		ey = tilt ? size / 2 : size / 2;
	}

	const positioning: React.CSSProperties = {
		// top: `${cy}px`,
		left: `${cx}px`,
	};

	if (tilt) {
		positioning.top = `${cy}px`;
	} else {
		positioning.bottom = `${cy}px`;
	}

	const swidth = props.isMobile ? 3 : 6;

	return (
		<svg width={width} height={height} style={positioning}>
			{/* <rect x={0} y={0} width={width} height={height} fill="transparent" stroke="red" strokeWidth={3} /> */}
			<line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#0006" strokeWidth={swidth} strokeDasharray={10} />
		</svg>
	);
}



function LocationInfo(props: { loc: Location }) {

	const { loc } = props;

	const arena = loc.arena[0];

	return (
		<div className="location-info">
			{loc.name}, {loc.status}. {arena.getDifficulty()}, {arena.enemies.map((e) => e.getName()).join(", ")}
		</div>
	)
}

export default WorldNodeMap;
