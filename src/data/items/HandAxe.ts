import { CARDRARITY, Card, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ArenaState } from "../../models/ArenaState";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const HandAxe: Item = {
	id: "hand-axe",
	name: "Hand Axe",
	groups: ["Axe", "BlackSmiths Forge", "Weapon"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "Small utilitarian Axe used to chopping wood and heads.",
	rarity: ITEMRARITY.COMMON,
	price: 35,
	cards: [
		{
			name: "Swing",
			description: "A side-to-side slashing motion aimed at an adversary's torso or limbs, useful for maintaining distance and controlling the battle's pace.",
			rarity: CARDRARITY.COMMON,
			count: 3,
			damage: [
				{
					amount: 5,
					type: DAMAGETYPE.SLASH,
					variation: 1,
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
			name: "Chop",
			description: "A powerful overhead attack that utilizes gravity to maximize force, often targeting the opponent's head or shoulders.",
			rarity: CARDRARITY.UNCOMMON,
			count: 2,
			damage: [
				{
					amount: 4,
					type: DAMAGETYPE.SLASH,
					variation: 2,
				},
                {
					amount: 3,
					type: DAMAGETYPE.BLUNT,
					variation: 1,
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
			name: "Spinning Slash",
			rulesText: "BLOCK -2",
			description: "A swift, circular maneuver that leverages the momentum of a full-body rotation to deliver a powerful strike.",
			rarity: CARDRARITY.EPIC,
			count: 1,
			damage: [
				{
					amount: 9,
					type: DAMAGETYPE.SLASH,
					variation: 2,
				},
                {
					amount: 5,
					type: DAMAGETYPE.BLUNT,
					variation: 2,
				},
			],
			apCost: 4,
			reach: 1,
			allowedTargets: [TARGETS.ENEMY],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as: ArenaState, card: Card) => {
				as.hero.modifyArmor(-2, true);
				return { ...as };
			},
		},
		
	],
};
