import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const MinorRingOfPower: Item = {
	id: "minor-ring-of-power",
	name: "Minor Ring of Power",
	groups: ["Ring", "Magic Item", "Damage"],
	itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
	description: "This is an ornate ring with a large gem in the center. It provides its wearer an ability to heal themselves.",
	rarity: ITEMRARITY.RARE,
	price: 225,
	cards: [
		{
			name: "Wondering Mind",
			description: "Stun Enenmy",
			rarity: CARDRARITY.COMMON,
			count: 1,
			damage: [],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [EFFECTS.STUN],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				as.hero.healHero(5);
				return { ...as };
			},
		},
		{
			name: "Word of Pain",
			description: "Some words can cause your ears to bleed. Literally.",
			rarity: CARDRARITY.COMMON,
			count: 1,
			damage: [
				{
					amount: 4,
					type: DAMAGETYPE.MAGIC,
					variation: 1,
				},
			],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [EFFECTS.STUN],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				return { ...as };
			},
		},
		{
			name: "Barrier",
            rulesText: "BLOCK 3",
			description: "Creates a shining barrier around you, protecting you from harm.",
			rarity: CARDRARITY.COMMON,
			count: 1,
			damage: [],
			apCost: 2,
			reach: 1,
            
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [EFFECTS.STUN],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
                as.hero.modifyEffectArmor(3);
				return { ...as };
			},
		},
	],
};
