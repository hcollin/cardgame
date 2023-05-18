import Hero from "../game/Hero";

import valueLogo from "./icons/dodge.png";

import "./value-container.css";

function DodgeValueContainer(props: {hero: Hero}) {

    return (
        <div className="value-container armor-container">
            <div className="value-icon">
                <img src={valueLogo} alt="Dodge" className="value-icon" />
            </div>
            
            <div className="title">Dodge</div>
            
            <div className="value">{props.hero.getDodge()}</div>

            {/* <div className="base-value">{props.hero.getBaseArmor()}</div> */}

            
        </div>
    )
}

export default DodgeValueContainer;