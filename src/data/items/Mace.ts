import { CARDRARITY, Card, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { GameState } from "../../models/GameState";
import { Item } from "../../models/Items";

export const Mace: Item = {
	id: "mace",
	name: "Mace",
	description: "Heavy club with a metal head, designed for delivering powerful blows.",
	cards: [
		{
			name: "Swing",
			description: "This technique can cause significant damage but requires proper footwork and timing to avoid getting too close to your opponent.",
			rarity: CARDRARITY.COMMON,
			count: 4,
			damage: [
				{
					amount: 5,
					type: DAMAGETYPE.BLUNT,
					variation: 0,
				},
			],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.ENEMY],
			effectsOnHit: [],
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				return { ...gs };
			},
		},
		{
			name: "Headburster",
			description: "Swing the mace downward with both hands, using your upper body strength and momentum to strike your opponent's head, shoulders, or upper torso.",
			rarity: CARDRARITY.EPIC,
			count: 1,
			damage: [
				{
					amount: 14,
					type: DAMAGETYPE.BLUNT,
					variation: 4,
				},
			],
			apCost: 4,
			reach: 1,
			allowedTargets: [TARGETS.ENEMY],
			effectsOnHit: [EFFECTS.STUNNED, EFFECTS.STUNNED],
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				return { ...gs };
			},
		},
		{
			name: "Leg Sweep",
			description: "DRAW 1 CARD. This technique can potentially knock an opponent off balance or even trip them, creating an opening for a follow-up attack.",
			rarity: CARDRARITY.UNCOMMON,
			count: 2,
			damage: [
				{
					amount: 3,
					type: DAMAGETYPE.BLUNT,
					variation: 0,
				},
			],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.ENEMY],
			effectsOnHit: [EFFECTS.STUNNED],
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs: GameState, card: Card) => {
                
                if(card.hand === "RIGHT") {
                    const c = gs.rightHandDeck.drawCard();
                    if(c) {
                        gs.rightHand.push(c);
                    }
                } else {
                    const c = gs.leftHandDeck.drawCard();
                    if(c) {
                        gs.leftHand.push(c);
                    }
                }

				return { ...gs };
			},
		},
		
	],
};
