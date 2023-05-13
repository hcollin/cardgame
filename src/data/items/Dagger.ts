import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const Dagger: Item = {
	id: "crude-dagger",
	name: "Crude Dagger",
	groups: ["Dagger"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "A short blade with guard",
	rarity: ITEMRARITY.COMMON,
	cards: [
		{
			name: "Quick Slash",
			description: "A quick, sweeping attack.",
			rarity: CARDRARITY.COMMON,
			count: 2,
			damage: [
				{
					amount: 2,
					type: DAMAGETYPE.SLASH,
					variation: 0,
				},
			],
			apCost: 1,
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
			name: "Quick Stab",
			description: "A quick stab to opponent's body.",
			rarity: CARDRARITY.COMMON,
			count: 2,
			damage: [
				{
					amount: 2,
					type: DAMAGETYPE.PIERCE,
					variation: 0,
				},
			],
			apCost: 1,
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
			name: "Parry",
			description: "ARMOR 2. Using the guard to block.",
			rarity: CARDRARITY.COMMON,
			count: 2,
			damage: [
				
			],
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
	],
};
