import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const CloakOfSwiftness: Item = {
	id: "cloak-swiftness",
	name: "Cloak of Swiftness",
	groups: ["Cloak", "Magic Item"],
	itemSlots: [ITEMSLOT.CAPE],
	rulesText: "Energy +1",
	description:
		"This cloak is made of an impossibly light material that reflects light in a way that makes the wearer appear to be moving faster than they actually are.",
	cards: [],
	price: 350,
	rarity: ITEMRARITY.RARE,
	bonus: {
		energy: 1,
	},

	onEquip: (hero) => {
		// hero.modifyEffectEnergy(1);
	},
	onUnequip: (hero) => {
		// hero.modifyEffectEnergy(-1);
	},
};

export const CloakOfProtection: Item = {
    id: "cloak-protection",
    name: "Cloak of Protection",
    groups: ["Cloak", "Magic Item"],
    itemSlots: [ITEMSLOT.CAPE],
    rulesText: "Block +2",
    description: "A cloak that protects the wearer from harm.",
    cards: [],
    price: 150,
    rarity: ITEMRARITY.RARE,
    bonus: {
        block: 2,
    },
    onEquip: (hero) => {},
    onUnequip: (hero) => {},
};

export const CapeOfWisdom: Item = {
    id: "cape-wisdom",
    name: "Cape of Wisdom",
    groups: ["Cloak", "Magic Item", "Major"],
    itemSlots: [ITEMSLOT.CAPE],
    rulesText: "Hand Size +1 for both hands",
    description: "A cape that makes the wearer feel smarter.",
    cards: [],
    price: 450,
    rarity: ITEMRARITY.RARE,
    bonus: {
        RIGHT_HAND_SIZE: 1,
        LEFT_HAND_SIZE: 1,
    },
    onEquip: (hero) => {},
    onUnequip: (hero) => {},
};

export const CloakOfDisplacement: Item = {
	id: "cloak-displacement",
	name: "Cloak of Displacement",
	groups: ["Cloak", "Magic Item", "Major"],
	itemSlots: [ITEMSLOT.CAPE],
	rulesText: "Dodge +25%",
	description: "A mystical garment that distorts wearer's location, enhancing evasiveness against incoming attacks.",
	cards: [],
	price: 250,
	rarity: ITEMRARITY.RARE,
	bonus: {
		dodge: 25,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};

export const MerlinsCape: Item = {
	id: "merlins-cape",
	name: "Merlins Cape",
	groups: ["Cloak", "Magic Item", "Legendary"],
	itemSlots: [ITEMSLOT.CAPE],
	rulesText: "Energy +2, Block +2, Both Hands +2 to size",
	description: "An enchanted mantle radiating ancient wisdom, bestowing heightened magic potency and unrivaled prophetic insight to its wearer.",
	cards: [],
	price: 1000,
	rarity: ITEMRARITY.EPIC,
	bonus: {
		energy: 2,
        block: 3,
        RIGHT_HAND_SIZE: 2,
        LEFT_HAND_SIZE: 2,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};
