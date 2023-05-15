import { Item } from "../models/Items";

import imgHealingPotion from "./icons/potionHealing.png";
import imgEnergyPotion from "./icons/potionEnergy.png";
import imgInsightPotion from "./icons/potionInsight.png";

import imgGradeStar from "./icons/gradestar.png";

import "./potion-icon.css";

export default function PotionIcon(props: { item: Item, size?: "mini"|"small"|"medium"|"large"|"x-large"|"xx-large"|"fill" }) {

    const groups = props.item.groups;

    if(!groups.includes("Potion")) return null;

    const isHealing = groups.includes("Healing");
    const isEnergy = groups.includes("Energy");
    const isInsight = groups.includes("Insight");

    const grade = groups.find(g => g.startsWith("grade"));
    
    const gradeNumber = grade ? parseInt(grade.replace("grade-", "")) : 0;

    return (
        <div className={`potion-icon ${props.size} ${grade}`}>
            {isHealing && <img src={imgHealingPotion} alt="Healing Potion" />}
            {isEnergy && <img src={imgEnergyPotion} alt="Energy Potion" />}
            {isInsight && <img src={imgInsightPotion} alt="Insight Potion" />}

            <div className="grades">
                <img src={imgGradeStar} alt="Grade" />
                {gradeNumber === 3 && <img src={imgGradeStar} alt="Grade" className="lift"/>}
                {gradeNumber > 1 && <img src={imgGradeStar} alt="Grade" />}
            </div>
        </div>
    )

}