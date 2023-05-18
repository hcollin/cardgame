import { Card } from "../../models/Card";
import { ArenaState } from "../../models/ArenaState";

export const ITEMFUNCTIONS: { [key: string]: (as: ArenaState, card: Card) => ArenaState } = {
	drawACard: (as: ArenaState, card: Card) => {
		if (card.hand === "RIGHT") {
			as.rightHand.drawCards(as, 1);
		} else {
			as.leftHand.drawCards(as, 1);
		}

		return { ...as };
	},
};
