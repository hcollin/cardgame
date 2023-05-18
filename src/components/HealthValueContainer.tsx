import Hero from "../game/Hero";

import healthLogo from "./icons/health.png";

import "./value-container.css";

function HealthValueContainer(props: {hero: Hero}) {

    return (
        <div className="value-container health-container">
            <div className="value-icon">
                <img src={healthLogo} alt="health" className="value-icon" />
            </div>
            
            <div className="title">Health</div>

            <div className="value">{props.hero.getHealth()}</div>

            <div className="base-value">
             <span className="subtitle">Max</span>
                {props.hero.getMaxHealth()}
                </div>

            
        </div>
    )
}

export default HealthValueContainer;