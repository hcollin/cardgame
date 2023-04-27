import { CSSProperties, useEffect, useState } from "react";
import { Campaign } from "../models/Campaign";
import { LOCATIONSTATUS, Location, MapLocation } from "../models/World";
import { buildMapLocations } from "../game/WorldTools";
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


function WorldMap(props: { campaign: Campaign, updateCampaign: (c: Campaign) => void, startArena: () => void }) {

    const { height, width } = useWindowDimensions();

    const locations = props.campaign.world;

    const [mapLocs, setMapLocs] = useState<MapLocation[]>(buildMapLocations(props.campaign));

    useEffect(() => {
        setMapLocs(buildMapLocations(props.campaign));
    }, [props.campaign])


    function selectLocation(mloc: MapLocation) {
        if(mloc.status === LOCATIONSTATUS.ACTIVE) {
            props.startArena();
            return;
        }

        if (mloc.status !== LOCATIONSTATUS.SELECTABLE) {
            return;
        }
        props.updateCampaign({ ...props.campaign, currentLocationId: mloc.id });
    }

    const maxDepth = Math.max(...mapLocs.map((l) => l.depth)) + 1;
    const maxTrak = Math.max(...mapLocs.map((l) => l.trak)) + 1;

    const nps = Math.min(width / maxTrak, (height - 100) / maxDepth) * 0.8;

    return (
        <div className="world-map">

            <div className="nodes">
                {mapLocs.map((ml, i) => {

                    return (
                        <LocationNode key={ml.id} location={ml} maxDepth={maxDepth} maxTrak={maxTrak} nodeSpace={nps} selectLocation={selectLocation} />
                    )
                })}
            </div>
            {/* <div className="line-v"></div> */}
            {/* <div className="line-h"></div> */}
            <div className="map-title">
                World Map
            </div>

        </div>
    )
}

function LocationNode(props: { location: MapLocation, maxDepth: number, maxTrak: number, nodeSpace: number, selectLocation: (mloc: MapLocation) => void }) {

    function handleClick() {
        props.selectLocation(props.location);
    }

    const maxWidth = props.nodeSpace * props.maxTrak;
    const maxDepth = props.nodeSpace * props.maxDepth;

    const nodeStyle: CSSProperties = {
        left: ((props.location.trak * props.nodeSpace)) + "px",
        marginLeft: (maxWidth / 2 * -1) + "px",
        bottom: "50%",
        marginBottom: (maxDepth / 2 * -1) + (props.location.depth * (props.nodeSpace)) + "px",
        width: props.nodeSpace + "px",
        height: props.nodeSpace + "px",
    }

    const cns: string[] = ["location-node"];
    cns.push(props.location.type.toLowerCase());
    cns.push(props.location.status.toLowerCase());

    return (
        <div className={cns.join(" ")} style={nodeStyle} onClick={handleClick}>
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

            <div className="name">
                <Banner text={props.location.arena[0].name} />
            </div>

            {props.location.status === LOCATIONSTATUS.LOCKED && <div className="locked">
                <img src={iconLocked} alt="locked" />
            </div>}

            {props.location.status === LOCATIONSTATUS.ACTIVE && <div className="active-ring">
                
            </div>}
            
            {props.location.status === LOCATIONSTATUS.ACTIVE && (
                <div className="start-text">
                    <span>click to</span>
                    START
                </div>
            )}

            {props.location.status === LOCATIONSTATUS.COMPLETED && <div className="completed">
                <img src={iconCompleted} alt="completed" />
            </div>}

        </div>
    )
}

export default WorldMap;