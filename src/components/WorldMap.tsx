import { CSSProperties, useEffect, useState } from "react";
import { Campaign } from "../models/Campaign";
import { Location, MapLocation } from "../models/World";


import "./world-map.css";
import { buildMapLocations } from "../game/WorldTools";


import iconCamp from "./icons/camp.png";
import iconDungeon from "./icons/dungeon.png";
import iconForest from "./icons/forest.png";
import iconMountain from "./icons/mountain.png";
import iconCastle from "./icons/castle.png";
import iconHut from "./icons/hut.png";
import iconTent from "./icons/tent.png";
import iconGraveyard from "./icons/graveyard.png";
import Banner from "./Banner";

function WorldMap(props: { campaign: Campaign }) {

    const locations = props.campaign.world;

    const [mapLocs, setMapLocs] = useState<MapLocation[]>(buildMapLocations(props.campaign));


    useEffect(() => {
        setMapLocs(buildMapLocations(props.campaign));
    }, [props.campaign])


    const maxDepth = Math.max(...mapLocs.map((l) => l.depth)) +1;
    const maxTrak = Math.max(...mapLocs.map((l) => l.trak)) +1;

    return (
        <div className="world-map">
            
            <div className="nodes">
                {mapLocs.map((ml, i) => {

                    return (
                        <LocationNode key={ml.id} location={ml} maxDepth={maxDepth} maxTrak={maxTrak}/>
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

function LocationNode(props: { location: MapLocation, maxDepth: number, maxTrak: number }) {

    

    const nodeSpace = 200;

    const maxWidth = nodeSpace * props.maxTrak;
    const maxDepth = nodeSpace * props.maxDepth;

    // const startFrom = nodeSpace * (props.maxTrak / 2) * -1;
    // const myPosLeft = startFrom + (nodeSpace * props.location.trak);
    
    
    const nodeStyle: CSSProperties = {
        left: ((props.location.trak * nodeSpace)) + "px",
        marginLeft: (maxWidth / 2 * -1) + "px",
        bottom: "50%",
        marginBottom: (maxDepth/2 * -1) + (props.location.depth * (nodeSpace)) + "px",
        width: nodeSpace + "px",
        height: nodeSpace + "px",
    }

    return (
        <div className="location-node" style={nodeStyle}>
            <div className="icon">
                {props.location.icon === "dungeon" && <img src={iconDungeon} alt="dungeon" />}
                {props.location.icon === "forest" && <img src={iconForest} alt="forest" />}
                {props.location.icon === "mountain" && <img src={iconMountain} alt="mountain" />}
                {props.location.icon === "camp" && <img src={iconCamp} alt="camp" />}
            </div>
            
            <div className="name">
                <Banner text={props.location.arena[0].name} />
                
            </div>

        </div>
    )
}

export default WorldMap;