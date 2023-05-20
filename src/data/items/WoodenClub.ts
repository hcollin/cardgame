import { CARDRARITY, Card, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ArenaState } from "../../models/ArenaState";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const WoodenClub: Item = {
	id: "wooden-club",
	name: "Wooden Club",
	groups: ["Club", "General Store" , "Weapon"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "A simple wooden club, ready for pain.",
	rarity: ITEMRARITY.COMMON,
	price: 10,
	cards: [
		{
			name: "Swing",
			description: "This technique can cause significant damage but requires proper footwork and timing to avoid getting too close to your opponent.",
			rarity: CARDRARITY.COMMON,
			count: 3,
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
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				return { ...as };
			},
		},
		{
			name: "Clubbing time",
			rulesText: "Stun the enemy.",
			description: "Whack the enemy on the head.",
			rarity: CARDRARITY.UNCOMMON,
			count: 2,
			damage: [
				{
					amount: 2,
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
				return { ...as };
			},
		},
	],
};
