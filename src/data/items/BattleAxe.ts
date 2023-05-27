import { CARDRARITY, Card, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ArenaState } from "../../models/ArenaState";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const BattleAxe: Item = {
	id: "battle-axe",
    name: "Battle Axe",
	groups: ["Axe", "BlackSmiths Forge", "Weapon", "Two-Handed"],
	itemSlots: [ITEMSLOT.RIGHT_HAND],
	description: "A formidable two-handed weapon with a large, double-edged blade, designed for delivering devastating blows in combat.",
	rarity: ITEMRARITY.UNCOMMON,
	price: 85,
	cards: [
		{
			name: "Heavy Swing",
			description: "A side-to-side slashing motion aimed at an adversary's torso or limbs, useful for maintaining distance and controlling the battle's pace.",
			rarity: CARDRARITY.COMMON,
			count: 3,
			damage: [
				{
					amount: 12,
					type: DAMAGETYPE.SLASH,
					variation: 3,
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
			name: "Quick Chop",
			description: "A swift, pinpoint strike with the battle axe, delivering a rapid and precise blow to a single enemy.",
			rarity: CARDRARITY.UNCOMMON,
			count: 2,
			damage: [
				{
					amount: 8,
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
				return { ...as };
			},
		},
        {
			name: "Handle Parry",
            rulesText: "BLOCK 4",
			description: "Parry incoming blow on the reinforced handle of the axe",
			rarity: CARDRARITY.UNCOMMON,
			count: 1,
			damage: [],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
                as.hero.modifyArmor(4);
				return { ...as };
			},
		},
		{
			name: "Berserkers Fury",
			rulesText: "TARGET ALL ENEMIES",
			description: "A ferocious, wide-sweeping attack with the battle axe, unleashing a hailstorm of strikes against all foes in range.",
			rarity: CARDRARITY.EPIC,
			count: 1,
			damage: [
				{
					amount: 20,
					type: DAMAGETYPE.SLASH,
					variation: 5,
				},
                
			],
			apCost: 4,
			reach: 1,
			allowedTargets: [TARGETS.ALLENEMIES],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as: ArenaState, card: Card) => {
				return { ...as };
			},
		},
		
	],
};
