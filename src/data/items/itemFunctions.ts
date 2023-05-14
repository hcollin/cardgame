import { Card } from "../../models/Card";
import { GameState } from "../../models/GameState";

export const ITEMFUNCTIONS: { [key: string]: (gs: GameState, card: Card) => GameState } = {
	drawACard: (gs: GameState, card: Card) => {
		if (card.hand === "RIGHT") {
			gs.rightHand.drawCards(gs, 1);
		} else {
			gs.leftHand.drawCards(gs, 1);
		}

		return { ...gs };
	},
};
