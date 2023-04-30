import Hero from "../game/Hero";

import energyIcon from "./icons/energy.png";

import "./value-container.css";

function EnergyValueContainer(props: {hero: Hero}) {

    return (
        <div className="value-container energy-container">
            <div className="value-icon">
                <img src={energyIcon} alt="energy" className="value-icon" />
            </div>
            
            <div className="title">Energy</div>

            <div className="value">{props.hero.getBaseEnergy()}</div>

            <div className="base-value">{props.hero.getEffectedEnergy()}</div>

            
        </div>
    )
}

export default EnergyValueContainer;