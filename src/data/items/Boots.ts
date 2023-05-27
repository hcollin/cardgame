import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const LeatherBoots: Item = {
	id: "leather-boots",
	name: "Leather Boots",
	groups: ["Boots", "Leather", "General Store"],
	itemSlots: [ITEMSLOT.FEET],
	rulesText: "DODGE +10%",
	description: "A nice pair of good quality boots makes you feel like you can dodge anything.",
	cards: [],
	price: 55,
	rarity: ITEMRARITY.COMMON,
	bonus: {
		DODGE: 10,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};

export const ElvishBoots: Item = {
	id: "elvish-boots",
	name: "Elvish Boots",
	groups: ["Boots", "Leather", "Magic Item"],
	itemSlots: [ITEMSLOT.FEET],
	rulesText: "DODGE +25%",
	description: "These boots are made of a strange material that seems to be alive. They are very light and comfortable to wear.",
	cards: [],
	price: 255,
	rarity: ITEMRARITY.RARE,
	bonus: {
		DODGE: 25,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};


export const IronGreaves: Item = {
	id: "iron-greaves",
	name: "Iron Greaves",
	groups: ["Boots", "Iron", "BlackSmiths Forge"],
	itemSlots: [ITEMSLOT.FEET],
	rulesText: "Block +2, Dodge -5%",
	description: "These greaves are made of iron and are very heavy.",
	cards: [],
	price: 95,
	rarity: ITEMRARITY.UNCOMMON,
	bonus: {
		BLOCK: 2,
		DODGE: -5
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};

export const BootsOfSwiftness: Item = {
	id: "boots-swiftness",
	name: "Boots of Swiftness",
	groups: ["Boots", "Magic Item", "Legendary"],
	itemSlots: [ITEMSLOT.FEET],
	rulesText: "Energy +1, Dodge +20%",
	description: "These boots are made of an impossibly light material that reflects light in a way that makes the wearer appear to be moving faster than they actually are.",
	cards: [],
	price: 350,
	rarity: ITEMRARITY.EPIC,
	bonus: {
		ENERGY: 1,
		DODGE: 20
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};
