import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const LeatherBoots: Item = {
	id: "leather-boots",
	name: "Leather Boots",
	itemSlots: [ITEMSLOT.FEET],
    rulesText: "DODGE +25%",
	description: "A nice pair of good quality boots makes you feel like you can dodge anything.",
	cards: [],
	rarity: ITEMRARITY.COMMON,
	onEquip: (hero) => {
        hero.modifyDodge(25);
	},
	onUnequip: (hero) => {
		hero.modifyDodge(-25);
	},
};
