import { HeroStats } from "../models/HeroStats";

import armorLogo from "./icons/armor.png";

import "./value-container.css";

function ArmorValueContainer(props: {hero: HeroStats}) {

    return (
        <div className="value-container armor-container">
            <div className="value-icon">
                <img src={armorLogo} alt="armor" className="value-icon" />
            </div>
            
            <div className="title">Armor</div>

            <div className="value">{props.hero.armor}</div>

            <div className="base-value">{props.hero.defaultArmor}</div>

            
        </div>
    )
}

export default ArmorValueContainer;