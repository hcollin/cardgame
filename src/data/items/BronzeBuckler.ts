import { CARDRARITY, TARGETS } from "../../models/Card";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";
import { ITEMFUNCTIONS } from "./itemFunctions";

export const BronzeBuckler: Item = {
	id: "bronze-buckler",
	name: "Bronze Buckler",
	groups: ["Shield", "BlackSmiths Forge"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "A simple bronze Buckler",
	rarity: ITEMRARITY.COMMON,
	price: 20,
	cards: [
		{
			name: "Quick Block",
			rulesText: "BLOCK 1, Draw a card",
			description: "With a swift rotation of wrist, the incoming strike is deflected by the buckler shield, ensuring a balanced stance remains.",
			rarity: CARDRARITY.COMMON,
			count: 3,
			damage: [],
			apCost: 1,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as, card) => {
				as.hero.modifyArmor(1);
				return ITEMFUNCTIONS.drawACard(as, card);
			},
		},
		{
			name: "Defend",
			rulesText: "BLOCK 3",
			description: "The buckler is held in front of the hero, ready to block any incoming attacks.",
			rarity: CARDRARITY.COMMON,
			count: 2,
			damage: [],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (as) => {
				return { ...as };
			},

			onUse: (as) => {
				as.hero.modifyArmor(3);
				return { ...as };
			},
		},
	],
};
