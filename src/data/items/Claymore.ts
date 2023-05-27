


import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const Claymore: Item = {
	id: "claymore",
	name: "Claymore",
	groups: ["Sword", "BlackSmiths Forge", "Weapon", "Two-Handed"],
	itemSlots: [ITEMSLOT.RIGHT_HAND],
    rulesText: "Two-Handed",
	description: "The Claymore is a hefty, double-edged, longsword historically used by medieval Scottish warriors.",
	rarity: ITEMRARITY.RARE,
	price: 95,
	cards: [
		{
			name: "Slash",
			description: "A wide, sweeping attack that targets the opponent's torso or neck.",
			rarity: CARDRARITY.COMMON,
			count: 4,
			damage: [
				{
					amount: 12,
					type: DAMAGETYPE.SLASH,
					variation: 0,
				},
			],
			apCost: 3,
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
			name: "Overhead Strike",
			description: "A powerful vertical attack that targets the opponent's head or shoulders.",
			rarity: CARDRARITY.EPIC,
			count: 1,
			damage: [
				{
					amount: 18,
					type: DAMAGETYPE.SLASH,
					variation: 5,
				},
			],
			apCost: 4,
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
					amount: 5,
					type: DAMAGETYPE.PIERCE,
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
			name: "Arc Strike",
			description: "A wide swing towards all enemies.",
			rarity: CARDRARITY.RARE,
			count: 1,
			damage: [
				{
					amount: 9,
					type: DAMAGETYPE.SLASH,
					variation: 2,
				},
			],
			apCost: 4,
			reach: 1,
			allowedTargets: [TARGETS.ALLENEMIES],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},
			onUse: (as) => {
				return { ...as };
			},
		},
	],
};
