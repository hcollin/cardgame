import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const Cervelliere: Item = {
	id: "cervelliere",
	name: "Cervelliere",
	groups: ["Helmet", "Iron"],
	itemSlots: [ITEMSLOT.HEAD],
	rulesText: "BLOCK 1",
	description: "The Cervelliere, a rounded steel cap, offers unassuming but crucial protection, cradling the warrior's skull securely.",
	cards: [],
	price: 40,
	rarity: ITEMRARITY.COMMON,
	bonus: {
		BLOCK: 1,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};

export const Barbute: Item = {
	id: "barbute",
	name: "Barbute",
	groups: ["Helmet", "Iron"],
	itemSlots: [ITEMSLOT.HEAD],
	rulesText: "BLOCK 2",
	description: "The Barbute is a simple, open-faced helmet, offering good protection while allowing the wearer to see and hear clearly.",
	cards: [],
	price: 85,
	rarity: ITEMRARITY.UNCOMMON,
	bonus: {
		BLOCK: 2,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};

export const GreatHelm: Item = {
	id: "great-helm",
	name: "Great Helm",
	groups: ["Helmet", "Iron"],
	itemSlots: [ITEMSLOT.HEAD],
	rulesText: "BLOCK 4, ENERGY -1",
	description: "A large, heavy helmet, the Great Helm offers excellent protection, but limits vision and hearing.",
	cards: [],
	price: 140,
	rarity: ITEMRARITY.EPIC,
	bonus: {
		BLOCK: 4,
		ENERGY: -1,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};
