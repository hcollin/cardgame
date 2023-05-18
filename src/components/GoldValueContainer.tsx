import Hero from "../game/Hero";

import valueLogo from "./icons/gold.png";

import "./value-container.css";

function GoldValueContainer(props: {hero: Hero}) {

    return (
        <div className="value-container armor-container">
            <div className="value-icon">
                <img src={valueLogo} alt="Gold" className="value-icon" />
            </div>
            
            <div className="title">Gold</div>
            
            <div className="value">{props.hero.gold}</div>

            {/* <div className="base-value">{props.hero.getBaseArmor()}</div> */}

            
        </div>
    )
}

export default GoldValueContainer;