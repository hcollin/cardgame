import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const MinorWandOfFire: Item = {
	id: "minor-wand-of-fire",
	name: "Minor Wand of Fire",
	groups: ["Wand", "Magic Item", "Fire"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "This wand is a slender, reddish-brown wooden wand, adorned with delicate carvings of dancing flames and inlaid with small, fiery gemstones.",
	rarity: ITEMRARITY.RARE,
	price: 175,
	cards: [
		{
			name: "Ember touch",
			description: "Jab the wand at the target, causing a small burst of flame to erupt from the tip.",
			rarity: CARDRARITY.COMMON,
			count: 2,
			damage: [
				{
					amount: 4,
					type: DAMAGETYPE.FIRE,
					variation: 1,
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
			name: "Firebolt",
			description: "A quick, focused burst of flame that can be used to deal minor fire damage.",
			rarity: CARDRARITY.COMMON,
			count: 2,
			damage: [
				{
					amount: 7,
					type: DAMAGETYPE.FIRE,
					variation: 2,
				},
			],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.ENEMY],
			effectsOnHit: [EFFECTS.BURN],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				return { ...as };
			},
		},
        {
			name: "Flame Wave",
			description: " A short-range wave of fire that emanates from the wand, scorching nearby enemies.",
			rarity: CARDRARITY.COMMON,
			count: 1,
			damage: [
				{
					amount: 5,
					type: DAMAGETYPE.FIRE,
					variation: 1,
				},
			],
			apCost: 3,
			reach: 1,
			allowedTargets: [TARGETS.ENEMY, TARGETS.ADJACENT],
			effectsOnHit: [EFFECTS.BURN],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				return { ...as };
			},
		},
        {
			name: "Smoke Screen",
            rulesText: "DODGE +50%",
			description: "A spell that creates a thick cloud of smoke, obscuring vision.",
			rarity: CARDRARITY.COMMON,
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
				as.hero.modifyTemporaryDodge(50);
				return { ...as };
			},
		},				
	],
};
