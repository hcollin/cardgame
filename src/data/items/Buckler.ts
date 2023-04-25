import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { Item } from "../../models/Items";

export const Buckler: Item = {
	id: "buckler",
	name: "Buckler",
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "A simple Buckler",
	cards: [
		{
			name: "Quick Block",
			description: "Increase your Armor by 1 until end of next enemy turn",
			rarity: CARDRARITY.COMMON,
			count: 3,
			damage: [],
			apCost: 1,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				gs.hero.armor += 1;
				return { ...gs };
			},
		},
		{
			name: "Defend",
			description: "Increase your Armor by 3 until end of next enemy turn",
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
				gs.hero.armor += 3;
				return { ...gs };
			},
		},
		{
			name: "Edge hit",
			description: "Bash enemy with your bucklers sharpened edge",
			rarity: CARDRARITY.RARE,
			count: 1,
			damage: [{
				amount: 3,
				type: DAMAGETYPE.SLASH,
				variation: 0,
			}],
			apCost: 3,
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
	],
};
