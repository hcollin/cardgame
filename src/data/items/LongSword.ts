import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const LongSword: Item = {
	id: "long-sword",
	name: "Long Sword",
	groups: ["Sword"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "A long sword",
	rarity: ITEMRARITY.UNCOMMON,
	price: 65,
	cards: [
		{
			name: "Slash",
			description: "A wide, sweeping attack that targets the opponent's torso or neck.",
			rarity: CARDRARITY.COMMON,
			count: 6,
			damage: [
				{
					amount: 8,
					type: DAMAGETYPE.SLASH,
					variation: 0,
				},
			],
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
		{
			name: "Overhead Strike",
			description: "A powerful vertical attack that targets the opponent's head or shoulders.",
			rarity: CARDRARITY.EPIC,
			count: 1,
			damage: [
				{
					amount: 10,
					type: DAMAGETYPE.SLASH,
					variation: 4,
				},
			],
			apCost: 4,
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
		{
			name: "Thrust",
			description: "A quick, direct attack that focuses on piercing the opponent's body.",
			rarity: CARDRARITY.UNCOMMON,
			count: 3,
			damage: [
				{
					amount: 3,
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
			name: "Pommel Strike",
			description: "A non-lethal attack that uses the pommel to strike the opponent.",
			rarity: CARDRARITY.RARE,
			count: 2,
			damage: [
				{
					amount: 1,
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
			onUse: (gs) => {
				return { ...gs };
			},
		},
		{
			name: "Parry",
			description: "ARMOR 4. A defensive action that can be followed with riposte.",
			rarity: CARDRARITY.RARE,
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
				gs.hero.modifyArmor(3);
				return { ...gs };
			},
		},
	],
};
