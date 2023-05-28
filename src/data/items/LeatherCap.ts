import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const LeatherCap: Item = {
	id: "leather-cap",
	name: "Leather Cap",
	groups: ["Helmet", "Leather", "General Store"],
	itemSlots: [ITEMSLOT.HEAD],
    rulesText: "DODGE +5%",
	description: "A comfortable padded leather cap for those less worried about style.",
	cards: [],
	price: 15,
	rarity: ITEMRARITY.COMMON,
	bonus: {
		DODGE: 5,
	},
	onEquip: (hero) => {
        // hero.modifyDodge(25);
	},
	onUnequip: (hero) => {
		// hero.modifyDodge(-25);
	},
	setItems: ["Leather Cap", "Leather Armor", "Leather Boots"],
};
