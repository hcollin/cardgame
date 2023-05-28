import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const Gambeson: Item = {
	id: "gambeson",
	name: "Gambeson",
	groups: ["Armor", "Light Armor", "Fabric", "General Store"],
	itemSlots: [ITEMSLOT.BODY],
	rulesText: "BLOCK 1.",
	description: "A thick, padded fabric armor providing both protection and flexibility, often used beneath other armors.",
	cards: [],
	price: 25,
	rarity: ITEMRARITY.RARE,
	bonus: {
		BLOCK: 1,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};

export const LeatherArmor: Item = {
	id: "leather-armor",
	name: "Leather Armor",
	groups: ["Armor", "Light Armor", "Leather", "General Store"],
	itemSlots: [ITEMSLOT.BODY],
	rulesText: "BLOCK 2. DODGE +10%",
	description: "A simple leather ammor",
	cards: [],
	price: 60,
	rarity: ITEMRARITY.COMMON,
	bonus: {
		BLOCK: 2,
		DODGE: 10,
	},
	onEquip: (hero) => {
		// hero.modifyEffectArmor(2);
	},
	onUnequip: (hero) => {
		// hero.modifyEffectArmor(-2);
	},
	setItems: ["Leather Cap", "Leather Armor", "Leather Boots"],
	setBonus: {
		DODGE: 15
	}
};



export const StuddedLeatherArmor: Item = {
	id: "studded-leather-armor",
	name: "Studded Leather",
	groups: ["Armor", "Light Armor", "Leather" , "Studded", "General Store"],
	itemSlots: [ITEMSLOT.BODY],
	rulesText: "BLOCK 3",
	description: "An upgrade to leather armor, metal studs are added for additional strength and puncture resistance.",
	cards: [],
	price: 90,
	rarity: ITEMRARITY.UNCOMMON,
	bonus: {
		BLOCK: 3,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};
