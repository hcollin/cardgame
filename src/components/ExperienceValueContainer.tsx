import Hero from "../game/Hero";
import { expForNextLevel } from "../game/HeroTools";

import expIcon from "./icons/experience.png";

import "./value-container.css";

function ExperienceValueContainer(props: {hero: Hero}) {

    return (
        <div className="value-container level-container">
            <div className="value-icon">
                <img src={expIcon} alt="Experience" className="value-icon" />
            </div>
            
            <div className="title">Experience</div>

            <div className="value">{props.hero.getExperience()}</div>

            <div className="base-value">
                <span className="subtitle">Next Level</span>
                {expForNextLevel(props.hero)
                }</div>

            
        </div>
    )
}

export default ExperienceValueContainer;