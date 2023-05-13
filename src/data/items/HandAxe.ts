import { CARDRARITY, Card, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { GameState } from "../../models/GameState";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const HandAxe: Item = {
	id: "hand-axe",
	name: "Hand Axe",
	groups: ["Axe"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "Small utilitarian Axe used to chopping wood and heads.",
	rarity: ITEMRARITY.COMMON,
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
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				return { ...gs };
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
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				return { ...gs };
			},
		},
		{
			name: "Spinning Slash",
			description: "ARMOR -2 A swift, circular maneuver that leverages the momentum of a full-body rotation to deliver a powerful strike.",
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
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs: GameState, card: Card) => {
				gs.hero.modifyArmor(-2, true);
				return { ...gs };
			},
		},
		
	],
};
