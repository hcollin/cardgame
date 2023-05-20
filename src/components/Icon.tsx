

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
import iconTypeBoots from "./icons/iconTypeBoots.png";
import iconTypeHelmet from "./icons/iconTypeHelmet.png";
import iconTypeRing from "./icons/iconTypeRing.png";
import iconTypeCape from "./icons/iconTypeCape.png";

import iconTypeDagger from "./icons/iconTypeDagger.png";
import iconTypeSpear from "./icons/iconTypeSpear.png";

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
    "dagger": iconTypeDagger,
    "spear": iconTypeSpear,
    
    "potion": iconTypePotion,
    "ring": iconTypeRing,
    
    "armor": iconTypeArmor,
    "shield": iconTypeShield,
    "boots": iconTypeBoots,
    "helmet": iconTypeHelmet,
    "cape": iconTypeCape,
    
    
    
}


export default function Icon(props: {type: string, size?: string, className?: string}) {

    const height = props.size || "2rem";

    if(!icon2Image[props.type]) {
        console.warn(`Icon ${props.type} not found`);
    }

    return <img src={icon2Image[props.type]} alt={props.type} height={height} className={`icon ${props.className || ""}`}/>;


}