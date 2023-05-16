import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const LeatherCap: Item = {
	id: "leather-cap",
	name: "Leather Cap",
	groups: ["Helmet", "Leather"],
	itemSlots: [ITEMSLOT.HEAD],
    rulesText: "Immunity to Stun",
	description: "A comfortable padded leather cap for those less worreid about style.",
	cards: [],
	price: 15,
	rarity: ITEMRARITY.COMMON,
	onEquip: (hero) => {
        // hero.modifyDodge(25);
	},
	onUnequip: (hero) => {
		// hero.modifyDodge(-25);
	},
};
