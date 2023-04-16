import { getDamageRange } from "../game/ItemTools";
import { Card } from "../models/Card";
import { EffectIcon, EffectIconImage } from "./EffectIcon";

import "./handCard.css";

interface HandCardProps {
	card: Card;
	onClick?: (card: Card) => void;
	selected?: boolean;
}

export default function HandCard(props: HandCardProps) {
	function handleClick() {
		if (props.onClick) {
			props.onClick(props.card);
		}
	}

  let nameSize = "large";
  if(props.card.name.length > 8) nameSize = "normal";
  if(props.card.name.length > 12) nameSize = "small";
  if(props.card.name.length > 14) nameSize = "xsmall";
  

  const cn = `card ${props.card.rarity.toLowerCase()} ${props.selected ? "selected" : ""} `;

	return (
		<div onClick={handleClick} className={cn}>
			<header>
				<div className={`name ${nameSize}`}>{props.card.name}</div>
				<div className="aps">{props.card.apCost}</div>
			</header>

			<div className="item">{props.card.item}</div>

      <div className="effects">
        {props.card.effectsOnHit.map((effect) => (
          <EffectIconImage effect={effect} />
        ))}
      </div>


			<p>{props.card.description}</p>


			<footer>
				{props.card.damage.map((dmg, index) => {
					if (dmg.variation === 0) {
						return (
							<div className="dmg">
								<span className="type">{dmg.type}</span>
								<span className="amount">{dmg.amount}</span>
							</div>
						);
					}

					const range = getDamageRange(dmg);
					return (
						<div className="dmg">
							<span className="type">{dmg.type}</span>
							<span className="amount">
								{range[0]} - {range[1]}
							</span>
						</div>
					);
				})}
			</footer>
		</div>
	);
}
