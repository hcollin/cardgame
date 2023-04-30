import { expForNextLevel } from "../game/HeroTools";
import { HeroStats } from "../models/HeroStats";

import expIcon from "./icons/experience.png";

import "./value-container.css";

function ExperienceValueContainer(props: {hero: HeroStats}) {

    return (
        <div className="value-container level-container">
            <div className="value-icon">
                <img src={expIcon} alt="Experience" className="value-icon" />
            </div>
            
            <div className="title">Experience</div>

            <div className="value">{props.hero.experience}</div>

            <div className="base-value">{expForNextLevel(props.hero)}</div>

            
        </div>
    )
}

export default ExperienceValueContainer;