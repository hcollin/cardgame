

import iconGold from "./icons/gold.png";
import iconHealth from "./icons/health.png";
import iconEnergy from "./icons/energy.png";
import iconBlock from "./icons/armor.png";
import iconGamble from "./icons/gambling.png";
import iconQuest from "./icons/quest.png";

import iconTypeSword from "./icons/iconTypeSword.png"

const icon2Image: {[key: string]: string} = {
    "gold": iconGold,
    "health": iconHealth,
    "energy": iconEnergy,
    "block": iconBlock,
    "gambling": iconGamble,
    "´quest": iconQuest,
    

    "sword": iconTypeSword,
    
}

export default function Icon(props: {type: string, size?: string}) {

    const height = props.size || "2rem";

    return <img src={icon2Image[props.type]} alt={props.type} height={height} />;


}