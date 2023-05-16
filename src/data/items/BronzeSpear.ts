import { CARDRARITY, Card, DAMAGEFLAGS, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { GameState } from "../../models/GameState";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const BronzeSpear: Item = {
    id: "bronze-spear",
    name: "Bronze Spear",
	groups: ["Spear"],
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
					variation: 1,
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
			name: "Smack!",
			description: "Using the spear's shaft, a quick strike to the head or face can be delivered with surprising force.",
			rarity: CARDRARITY.RARE,
			count: 2,
			damage: [
                {
					amount: 3,
					type: DAMAGETYPE.BLUNT,
					variation: 2,
				},
			],
			apCost: 2,
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
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				return { ...gs };
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
					amount: 3,
					type: DAMAGETYPE.PIERCE,
					variation: 1,
				},
                {
					amount: 3,
					type: DAMAGETYPE.PIERCE,
					variation: 1,
				},
                {
					amount: 3,
					type: DAMAGETYPE.PIERCE,
					variation: 1,
				},
                
			],
			apCost: 3,
			reach: 1,
			allowedTargets: [TARGETS.ENEMY],
			effectsOnHit: [],
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs: GameState, card: Card) => {
				gs.hero.modifyTemporaryDodge(25);
				return { ...gs };
			},
		},
		
	],
};
