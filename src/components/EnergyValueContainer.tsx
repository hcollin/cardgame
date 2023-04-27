import { HeroStats } from "../models/HeroStats";

import energyIcon from "./icons/energy.png";

import "./value-container.css";

function EnergyValueContainer(props: {hero: HeroStats}) {

    return (
        <div className="value-container energy-container">
            <div className="value-icon">
                <img src={energyIcon} alt="energy" className="value-icon" />
            </div>
            
            <div className="title">Energy</div>

            <div className="value">{props.hero.aps}</div>

            <div className="base-value">{props.hero.maxAps}</div>

            
        </div>
    )
}

export default EnergyValueContainer;