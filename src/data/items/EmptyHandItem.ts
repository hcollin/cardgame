import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const OffHandForTwoHandedItem: Item = {
	id: "off-hand-for-two-handed-item",
	name: "In use",
	groups: ["Off-Hand", "Unequippable"],
	itemSlots: [ITEMSLOT.LEFT_HAND, ITEMSLOT.RIGHT_HAND],
	description: "",
	rarity: ITEMRARITY.COMMON,
	price: 0,
	cards: [],
};
