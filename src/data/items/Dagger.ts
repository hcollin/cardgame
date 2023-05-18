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
	price: 30,
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
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				return { ...as };
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
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				return { ...as };
			},
		},
		
		{
			name: "Parry",
			rulesText: "BLOCK 2",
			description: "Using the guard to catch enemy attacks.",
			rarity: CARDRARITY.COMMON,
			count: 2,
			damage: [
				
			],
			apCost: 1,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},
			onUse: (as) => {
				as.hero.modifyArmor(2);
				return { ...as };
			},
		},
	],
};
