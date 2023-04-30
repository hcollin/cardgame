import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const LeatherArmor: Item = {
	id: "leather-armor",
	name: "Leather Armor",
	itemSlots: [ITEMSLOT.BODY],
	description: "ARMOR 2. A simple leather ammor",
	cards: [],
	rarity: ITEMRARITY.COMMON,
	onEquip: (hero) => {
		hero.modifyEffectArmor(2);
	},
	onUnequip: (hero) => {
		hero.modifyEffectArmor(-2);
	},
};
