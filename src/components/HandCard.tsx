import { DragPreviewImage, useDrag } from "react-dnd";
import { getDamageRange } from "../game/ItemTools";
import { Card } from "../models/Card";
import { EffectIconImage } from "./EffectIcon";

import "./handCard.css";

import cardBackImage from "./pics/cardback.png";
import { useState } from "react";
import { createPortal } from "react-dom";

interface HandCardProps {
	card: Card;
	onClick?: (card: Card) => void;
	onDragStart?: (card: Card) => void;
	onDragEnd?: (card: Card) => void;
	selected?: boolean;
	style?: React.CSSProperties;
}

export default function HandCard(props: HandCardProps) {
	const [zoom, setZoomValue] = useState<boolean>(false);

	const [collected, drag, dragPreview] = useDrag(
		() => ({
			type: "Card",
			item: () => {
				if (props.onDragStart) {
					props.onDragStart(props.card);
					return props.card;
				}
			},
			end: (item, monitor) => {
				if (props.onDragEnd) {
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

	function openZoom() {
		setZoomValue(true);
	}

	function closeZoom() {
		setZoomValue(false);
	}

	// if (zoom) return <ZoomedCard card={props.card} onClick={() => setZoom(false)} />;

	let nameSize = "large";
	if (props.card.name.length > 8) nameSize = "normal";
	if (props.card.name.length > 12) nameSize = "small";
	if (props.card.name.length > 14) nameSize = "xsmall";

	const cn = `card ${zoom ? "zoomed" : ""} ${props.card.rarity.toLowerCase()} ${props.selected ? "selected" : ""} ${collected.isDragging ? "dragging" : ""}`;
	
	return (
		<div className={cn} ref={drag} style={props.style || {}} onClick={openZoom}>
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

			{props.card.rulesText && <p className="rules">{props.card.rulesText}</p>}

			{!props.card.rulesText && <p>{props.card.description}</p>}
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

			{zoom && createPortal(<ZoomedCard card={props.card} onClick={closeZoom} />, document.getElementById("zoomedContent") as HTMLElement)}
		</div>
	);
}

function ZoomedCard(props: { card: Card; onClick: () => void }) {

	function closeZoom(e: React.MouseEvent<any, MouseEvent>) {
		e.stopPropagation();
		props.onClick();
	}

	const cn = `zoomed-card ${props.card.rarity.toLowerCase()} `;

	return (
		<div className="zoomed-card-container" onClick={closeZoom}>
			<div className={cn}>
				<header>
					<div className="name">{props.card.name}</div>
					<div className="aps">{props.card.apCost}</div>
				</header>

				<div className="item">{props.card.item}</div>

				<div className="effects">
					{props.card.effectsOnHit.map((effect, index) => (
						<>
							<EffectIconImage effect={effect} key={`${props.card.id}-eff-${index}`} />
							{effect.toLocaleUpperCase()}
						</>
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
		</div>
	);
}
