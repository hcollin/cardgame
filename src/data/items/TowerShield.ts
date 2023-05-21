import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";
import { ITEMFUNCTIONS } from "./itemFunctions";

export const TowerShield: Item = {
	id: "tower-shield",
	name: "Tower Shield",
	groups: ["Shield", "BlackSmiths Forge"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "A large and heavy iron shield",
	rarity: ITEMRARITY.COMMON,
	price: 40,
	cards: [
		{
			name: "Defend",
			rulesText: "BLOCK 5",
			description: "Against the oncoming blow, the tower shield, held firm, absorbs the impact, leaving the defender unscathed.",
			rarity: CARDRARITY.COMMON,
			count: 4,
			damage: [],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				as.hero.modifyArmor(5);
				return { ...as };
			},
		},
        {
			name: "Bulky",
			rulesText: "Draw a card",
			description: "The tower shield is a large and heavy shield, and as such, it is difficult to maneuver.",
			rarity: CARDRARITY.UNCOMMON,
			count: 2,
			damage: [],
			apCost: 1,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as, card) => {
				return ITEMFUNCTIONS.drawACard(as, card);
			},
		},
		{
			name: "Cover!",
			rulesText: "BLOCK 25",
			description: "Nestled securely behind the towering shield, the defender becomes an unseen silhouette amidst the violent conflict.",
			rarity: CARDRARITY.RARE,
			count: 2,
			damage: [],
			apCost: 4,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
                as.hero.modifyArmor(25);
				return { ...as };
			},
		},
	],
};
