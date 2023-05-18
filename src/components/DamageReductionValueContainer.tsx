import Hero from "../game/Hero";

import valueLogo from "./icons/damagereduction.png";

import "./value-container.css";

function DamageReductionValueContainer(props: {hero: Hero}) {

    return (
        <div className="value-container armor-container">
            <div className="value-icon">
                <img src={valueLogo} alt="Damage Reduction" className="value-icon" />
            </div>
            
            <div className="title">Armor</div>
            
            <div className="value">{props.hero.getDamageReduction()}</div>

            {/* <div className="base-value">{props.hero.getBaseArmor()}</div> */}

            
        </div>
    )
}

export default DamageReductionValueContainer;