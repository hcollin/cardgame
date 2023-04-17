import { DragPreviewImage, useDrag } from "react-dnd";
import { getDamageRange } from "../game/ItemTools";
import { Card } from "../models/Card";
import { EffectIconImage } from "./EffectIcon";

import "./handCard.css";

import cardBackImage from "./pics/cardback.png";

interface HandCardProps {
	card: Card;
	onClick?: (card: Card) => void;
  onDragStart?: (card: Card) => void;
  onDragEnd?: (card: Card) => void;
	selected?: boolean;
}

export default function HandCard(props: HandCardProps) {
	const [collected, drag, dragPreview] = useDrag(
		() => ({
			type: "Card",
      item: () => {
        
        if(props.onDragStart) {
          props.onDragStart(props.card);
          return props.card;  
        }

        
      },
      end: (item, monitor) => {
        if(props.onDragEnd) {
          props.onDragEnd(props.card);
        }
      },
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[],
	);

	function handleClick() {
		if (props.onClick) {
			props.onClick(props.card);
		}
	}

	let nameSize = "large";
	if (props.card.name.length > 8) nameSize = "normal";
	if (props.card.name.length > 12) nameSize = "small";
	if (props.card.name.length > 14) nameSize = "xsmall";

	const cn = `card ${props.card.rarity.toLowerCase()} ${props.selected ? "selected" : ""} ${collected.isDragging ? "dragging" : ""}`;
	
	return (
		<div className={cn} ref={drag}>
			<header>
				<div className={`name ${nameSize}`}>{props.card.name}</div>
				<div className="aps">{props.card.apCost}</div>
			</header>

			<div className="item">{props.card.item}</div>

			<div className="effects">
				{props.card.effectsOnHit.map((effect, index) => (
					<EffectIconImage effect={effect} key={`${props.card.id}-eff-${index}`} />
				))}
			</div>

			<p>{props.card.description}</p>
			{/* <p>{props.card.id}</p> */}

			<footer>
				{props.card.damage.map((dmg, index) => {
					if (dmg.variation === 0) {
						return (
							<div className="dmg" key={`${props.card.id}-dmg-${index}`}>
								<span className="type">{dmg.type}</span>
								<span className="amount">{dmg.amount}</span>
							</div>
						);
					}

					const range = getDamageRange(dmg);
					return (
						<div className="dmg" key={`${props.card.id}-dmg-${index}`}>
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
