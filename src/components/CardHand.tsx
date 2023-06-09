import { useState } from "react";
import { Card } from "../models/Card";
import { ArenaState } from "../models/ArenaState";
import HandCard from "./HandCard";

import "./card-hand.css";

function CardHand(props: { as: ArenaState; side: "LEFT" | "RIGHT"; onDrag: (on: boolean) => void; onSelect: (card: Card) => void; onPlay: (c: Card) => void }) {
	const hand = props.side === "LEFT" ? props.as.leftHand : props.as.rightHand;

	const cardCount = hand.getHandSize();

	const deck = props.side === "LEFT" ? props.as.leftHandDeck : props.as.rightHandDeck;

	const cns: string[] = ["card-hand", props.side.toLowerCase()];
	
	return (
		<div className={cns.join(" ")}>
			<div className="discard">{deck.discardSize()}</div>
			<div className="deck">{deck.deckSize()}</div>

			{hand.getCards().map((card, index) => {
				const angle = (cardCount - 1) * -5 + index * 10;
				const offset = 20 - Math.abs(angle);

				const st: React.CSSProperties = {
					transformOrigin: "bottom center",
					transform: `rotate(${angle}deg)`,
					bottom: `${offset}px`,
				};

				return (
					<HandCard
						style={st}
						key={card.id}
						card={card}
						onDragStart={(c: Card) => {
							props.onDrag(true);
						}}
						onDragEnd={(c: Card) => {
							props.onSelect(c);
							props.onDrag(false);
						}}
						onPlay={props.onPlay}
						// onClick={onHandCardClick}

						// selected={selectedCard && selectedCard.id === card.id ? true : false}
					/>
				);
			})}
		</div>
	);
}

export default CardHand;
