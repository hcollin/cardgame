import { CARDRARITY, TARGETS } from "../../models/Card";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";
import { ITEMFUNCTIONS } from "./itemFunctions";

export const BronzeBuckler: Item = {
	id: "bronze-buckler",
	name: "Bronze Buckler",
	groups: ["Shield"],
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
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs, card) => {
				gs.hero.modifyArmor(1);
				return ITEMFUNCTIONS.drawACard(gs, card);
			},
		},
		{
			name: "Defend",
			description: "Increase your Armor by 3 until end of next enemy turn",
			rarity: CARDRARITY.COMMON,
			count: 2,
			damage: [],
			apCost: 2,
			reach: 1,
			allowedTargets: [TARGETS.SELF],
			effectsOnHit: [],
			onHit: (gs) => {
				return { ...gs };
			},

			onUse: (gs) => {
				gs.hero.modifyArmor(3);
				return { ...gs };
			},
		},
	],
};
