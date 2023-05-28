import { Item } from "../models/Items";

import imgHealingPotion from "./icons/potionHealing.png";
import imgEnergyPotion from "./icons/potionEnergy.png";
import imgInsightPotion from "./icons/potionInsight.png";
import imgAntiVenomPotion from "./icons/potionAntiVenom.png";
import imgNeutralityPotion from "./icons/potionNeutrality.png"
import imgSpecialPotion from "./icons/potionSpecial.png";
import imgWaterPotion from "./icons/potionWater.png";

import imgGradeStar from "./icons/gradestar.png";

import "./potion-icon.css";

export default function PotionIcon(props: { item: Item, size?: "mini"|"small"|"medium"|"large"|"x-large"|"xx-large"|"fill" }) {

    const groups = props.item.groups;

    if(!groups.includes("Potion")) return null;

    const isHealing = groups.includes("Healing");
    const isEnergy = groups.includes("Energy");
    const isInsight = groups.includes("Insight");
    const isAntiVenom = groups.includes("Anti-Venom");
    const isNeutralize = groups.includes("Neutralize");
    const isSpecial = groups.includes("Very Special");
    const isWater = groups.includes("Water");

    const grade = groups.find(g => g.startsWith("grade"));
    
    const gradeNumber = grade ? parseInt(grade.replace("grade-", "")) : 0;

    return (
        <div className={`potion-icon ${props.size} ${grade}`}>
            {isHealing && <img src={imgHealingPotion} alt="Healing Potion" />}
            {isEnergy && <img src={imgEnergyPotion} alt="Energy Potion" />}
            {isInsight && <img src={imgInsightPotion} alt="Insight Potion" />}
            {isAntiVenom && <img src={imgAntiVenomPotion} alt="Anti-Venom Potion" />}
            {isNeutralize && <img src={imgNeutralityPotion} alt="Neutralize Potion" />}
            {isSpecial && <img src={imgSpecialPotion} alt="Very Special Potion" />}
            {isWater && <img src={imgWaterPotion} alt="Water Flask" />}

            <div className="grades">
                <img src={imgGradeStar} alt="Grade" />
                {gradeNumber === 3 && <img src={imgGradeStar} alt="Grade" className="lift"/>}
                {gradeNumber > 1 && <img src={imgGradeStar} alt="Grade" />}
            </div>
        </div>
    )

}