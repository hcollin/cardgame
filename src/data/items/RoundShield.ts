import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const RoundShield: Item = {
	id: "round-shield",
	name: "Round Shield",
	groups: ["Shield"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "A simple shield",
	rarity: ITEMRARITY.COMMON,
	price: 30,
	cards: [
		{
			name: "Quick Block",
			rulesText: "BLOCK 2",
			description: "Increase your Armor by 2 until end of next enemy turn",
			rarity: CARDRARITY.COMMON,
			count: 4,
			damage: [],
			apCost: 1,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				gs.hero.modifyArmor(2);
				return { ...gs };
			},
		},
		{
			name: "Defend",
			rulesText: "BLOCK 5",
			description: "Increase your Armor by 5 until end of next enemy turn",
			rarity: CARDRARITY.COMMON,
			count: 2,
			damage: [],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				gs.hero.modifyArmor(5);
				return { ...gs };
			},
		},
		{
			name: "Bash",
			rulesText: "STUN Enemy",
			description: "Bash enemy with your shield",
			rarity: CARDRARITY.RARE,
			count: 1,
			damage: [
				{
					amount: 1,
					type: DAMAGETYPE.BLUNT,
					variation: 0,
				},
			],
			apCost: 3,
			reach: 1,
			allowedTargets: [TARGETS.ENEMY],
			effectsOnHit: [EFFECTS.STUNNED],
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				return { ...gs };
			},
		},
	],
};
