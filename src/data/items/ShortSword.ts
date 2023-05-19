import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const ShortSword: Item = {
	id: "crude-short-sword",
	name: "Crude Short Sword",
	groups: ["Sword", "BlackSmiths Forge"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "Despite its rudimentary craftsmanship, it offers close-quarter menace with its sharp, compact blade.",
	rarity: ITEMRARITY.COMMON,
	price: 25,
	cards: [
		{
			name: "Slash",
			description: "A wide, sweeping attack that targets the opponent's torso or neck.",
			rarity: CARDRARITY.COMMON,
			count: 4,
			damage: [
				{
					amount: 4,
					type: DAMAGETYPE.SLASH,
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
			name: "Thrust",
			description: "A quick, direct attack that focuses on piercing the opponent's body.",
			rarity: CARDRARITY.UNCOMMON,
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
			description: "ARMOR 2. Using the blade to block.",
			rarity: CARDRARITY.RARE,
			count: 1,
			damage: [],
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
