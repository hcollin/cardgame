import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { Item } from "../../models/Items";

export const Shield: Item = {
	id: "shield",
	name: "Shield",
	description: "A simple shield",
	cards: [
		{
			name: "Quick Block",
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
				gs.hero.armor += 2;
				return { ...gs };
			},
		},
		{
			name: "Defend",
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
				gs.hero.armor += 5;
				return { ...gs };
			},
		},
		{
			name: "Bash",
			description: "Bash enemy with your shield",
			rarity: CARDRARITY.RARE,
			count: 1,
			damage: [{
				amount: 1,
				type: DAMAGETYPE.BLUNT,
				variation: 0,
			}],
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
