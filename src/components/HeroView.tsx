import { HeroStats } from "../models/HeroStats";

import "./hero-view.css";

/**
 * Functional React Component called HeroView that takes HeroStats as a prop and renders the hero's stats
 */
function HeroView(props: { hero: HeroStats }) {
	return (
		<div className="hero-view">
			<h1>{props.hero.name}</h1>

            <h4>Health</h4>
            <div className="life">
                
                {props.hero.health} / {props.hero.maxHealth}
            </div>

            <h4>Equipped</h4>
            <div className="items">
                
                <div className="left">
                    {props.hero.activeItemLeft?.name}
                </div>
                <div className="right">
                    {props.hero.activeItemRight?.name}
                </div>
            </div>

            <h4>Inventory</h4>
            <div className="inventory">
                
                {props.hero.inventory.map((item, index) => (
                    <div className="item" key={`inventory-${index}`}>{item.name}</div>
                ))}
            </div>
            
		</div>
	);
}

export default HeroView;
