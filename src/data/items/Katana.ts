import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const Katana: Item = {
	id: "katana",
	name: "Katana",
	groups: ["Sword", "BlackSmiths Forge"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "The katana features a gently curved, slender blade with a razor-sharp single edge, a circular or squared tsuba adorned with intricate designs.",
	rarity: ITEMRARITY.EPIC,
	price: 295,
	cards: [
		{
			name: "Rising Dragon",
			description: "An upward diagonal slash that starts from a low stance, aiming to cut through an opponent's defenses.",
			rarity: CARDRARITY.UNCOMMON,
			count: 2,
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
			name: "Whirlwind Slash",
			rulesText: "HITS ALLA ENEMIES",
			description: "A spinning horizontal slash that utilizes the full reach and speed of the katana to strike multiple opponents in a wide arc, maintaining momentum for continuous strikes.",
			rarity: CARDRARITY.EPIC,
			count: 1,
			damage: [
				{
					amount: 6,
					type: DAMAGETYPE.SLASH,
					variation: 4,
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
		{
			name: "Leaping Crane",
			description: "A jumping attack that combines the force of the leap with a downward slash, delivering a powerful overhead strike aimed at breaking through an opponent's guard.",
			rarity: CARDRARITY.RARE,
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
			name: "Serpent's Fang",
			description: "A rapid series of quick, targeted thrusts aimed at an opponent's vital points, exploiting openings in their armor.",
			rarity: CARDRARITY.UNCOMMON,
			count: 2,
			damage: [
				{
					amount: 2,
					type: DAMAGETYPE.PIERCE,
					variation: 0,
				},
                {
					amount: 2,
					type: DAMAGETYPE.PIERCE,
					variation: 0,
				},
                {
					amount: 2,
					type: DAMAGETYPE.SLASH,
					variation: 0,
				},
                {
					amount: 2,
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
			name: "Moonlit Reflections",
            rulesText: "BLOCK 2",
			description: "A defensive counter-attack that uses the katana to parry an incoming strike,",
			rarity: CARDRARITY.RARE,
			count: 2,
			damage: [
				{
					amount: 5,
					type: DAMAGETYPE.SLASH,
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
				as.hero.modifyArmor(2);
				return { ...as };
			},
		},
	],
};
