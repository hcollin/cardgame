import { CARDRARITY, Card, DAMAGEFLAGS, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ArenaState } from "../../models/ArenaState";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const BronzeSpear: Item = {
    id: "bronze-spear",
    name: "Bronze Spear",
	groups: ["Spear", "BlackSmiths Forge", "Weapon"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "The bronze spear, with its gleaming, sharp point, promises both reach and deadly precision in battle.",
	rarity: ITEMRARITY.COMMON,
	price: 15,
	cards: [
		{
			name: "Quick Jab",
			description: "A lightning-fast forward thrust, the spear seeks vulnerable spots with precision.",
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
			name: "Smack!",
			description: "Using the spear's shaft, a quick strike to the head or face can be delivered with surprising force.",
			rarity: CARDRARITY.RARE,
			count: 1,
			damage: [
                {
					amount: 5,
					type: DAMAGETYPE.BLUNT,
					variation: 2,
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
            rulesText: "Armour piercing",
			description: "A powerful overhead attack that utilizes gravity to maximize force, often targeting the opponent's head or shoulders.",
			rarity: CARDRARITY.UNCOMMON,
			count: 2,
			damage: [
                {
					amount: 4,
					type: DAMAGETYPE.PIERCE,
					variation: 1,
                    flags: [DAMAGEFLAGS.ARMORPIERCING],
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
			name: "Dancing Spear",
            rulesText: "DODGE +25% until beginning of next turn.",
			description: "A series of quick thrusts and jabs, the spear is used to keep the opponent at bay while the wielder dances around them.",
			rarity: CARDRARITY.EPIC,
			count: 1,
			damage: [
				{
					amount: 5,
					type: DAMAGETYPE.PIERCE,
					variation: 2,
				},
                {
					amount: 4,
					type: DAMAGETYPE.PIERCE,
					variation: 1,
				},
                {
					amount: 3,
					type: DAMAGETYPE.PIERCE,
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

			onUse: (as: ArenaState, card: Card) => {
				as.hero.modifyTemporaryDodge(25);
				return { ...as };
			},
		},
		
	],
};
