import { CARDRARITY, Card, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ArenaState } from "../../models/ArenaState";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const IronMace: Item = {
	id: "iron-mace",
	name: "Iron Mace",
	groups: ["Club"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "Heavy club with a metal head, designed for delivering powerful blows.",
	rarity: ITEMRARITY.COMMON,
	price: 110,
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
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				return { ...as };
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
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				return { ...as };
			},
		},
		{
			name: "Leg Sweep",
			rulesText: "DRAW 1 CARD",
			description: "This technique can potentially knock an opponent off balance or even trip them, creating an opening for a follow-up attack.",
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
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as: ArenaState, card: Card) => {

				if (card.hand === "RIGHT") {
					as.rightHand.drawCards(as, 1);
				} else {
					as.leftHand.drawCards(as, 1);

				}

				return { ...as };
			},
		},

	],
};
