import Hero from "../game/Hero";

import armorLogo from "./icons/armor.png";

import "./value-container.css";

function ArmorValueContainer(props: {hero: Hero}) {

    

    return (
        <div className="value-container armor-container">
            <div className="value-icon">
                <img src={armorLogo} alt="armor" className="value-icon" />
            </div>
            
            <div className="title">Armor</div>

            <div className="value">{props.hero.getArmor()}</div>

            <div className="base-value">{props.hero.getEffectedArmor()}</div>

            
        </div>
    )
}

export default ArmorValueContainer;