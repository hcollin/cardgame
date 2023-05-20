

import iconGold from "./icons/gold.png";
import iconHealth from "./icons/health.png";
import iconEnergy from "./icons/energy.png";
import iconBlock from "./icons/armor.png";
import iconGamble from "./icons/gambling.png";
import iconQuest from "./icons/quest.png";

import iconTypeSword from "./icons/iconTypeSword.png"
import iconTypePotion from "./icons/iconTypePotion.png";
import iconTypeArmor from "./icons/iconTypeArmor.png";
import iconTypeMace from "./icons/iconTypeMace.png";
import iconTypeAxe from "./icons/iconTypeAxe.png";
import iconTypeShield from "./icons/iconTypeShield.png";
// import iconTypeStaff from "./icons/iconTypeStaff.png";
// import iconTypeWand from "./icons/iconTypeWand.png";


const icon2Image: {[key: string]: string} = {
    "gold": iconGold,
    "health": iconHealth,
    "energy": iconEnergy,
    "block": iconBlock,
    "gambling": iconGamble,
    "´quest": iconQuest,
    

    "sword": iconTypeSword,
    "mace": iconTypeMace,
    "axe": iconTypeAxe,
    
    "potion": iconTypePotion,
    
    "armor": iconTypeArmor,
    "shield": iconTypeShield,
    
    
}


export default function Icon(props: {type: string, size?: string, className?: string}) {

    const height = props.size || "2rem";

    return <img src={icon2Image[props.type]} alt={props.type} height={height} className={`icon ${props.className || ""}`}/>;


}