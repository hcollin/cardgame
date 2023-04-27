import { HeroStats } from "../models/HeroStats";

import healthLogo from "./icons/health.png";

import "./value-container.css";

function HealthValueContainer(props: {hero: HeroStats}) {

    return (
        <div className="value-container health-container">
            <div className="value-icon">
                <img src={healthLogo} alt="health" className="value-icon" />
            </div>
            
            <div className="title">Health</div>

            <div className="value">{props.hero.health}</div>

            <div className="base-value">{props.hero.maxHealth}</div>

            
        </div>
    )
}

export default HealthValueContainer;