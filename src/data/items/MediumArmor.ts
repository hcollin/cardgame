import { ITEMSLOT } from "../../models/HeroStats";
import { Item, ITEMRARITY } from "../../models/Items";

export const BreastPlate: Item = {
	id: "breast-plate",
	name: "Breast Plate",
	groups: ["Armor", "Medium Armor", "Plate"],
	itemSlots: [ITEMSLOT.BODY],
	rulesText: "AROMOR 6. -1 Left hand size",
	description: " A solid piece of metal armor, it covers the wearer's chest and back, offering robust defense.",
	cards: [],
	rarity: ITEMRARITY.RARE,
	bonus: {
		ARMOR: 6,
		LEFT_HAND_SIZE: -1,
	},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
};


export const ChainMail: Item = {
    id: "chain-mail",
    name: "Chain Mail",
    groups: ["Armor", "Medium Armor", "Chain"],
    itemSlots: [ITEMSLOT.BODY],
    rulesText: "ARMOR 5.",
    description: "Made from thousands of interlinked metal rings, this armor offers flexible, effective protection against cuts.",
    cards: [],
    rarity: ITEMRARITY.UNCOMMON,
    bonus: {
        ARMOR: 5,
    },
    onEquip: (hero) => {},
    onUnequip: (hero) => {},
};


export const ScaleMail: Item = {
    id: "scale-mail",
    name: "Scale Mail",
    groups: ["Armor", "Medium Armor", "Scale"],
    itemSlots: [ITEMSLOT.BODY],
    rulesText: "ARMOR 4. Damage reduction 1.",  
    description: "Consisting of small, overlapping metal plates, this armor provides comprehensive coverage and formidable defense.",
    cards: [],
    rarity: ITEMRARITY.RARE,
    bonus: {
        ARMOR: 4,
        DAMAGEREDUCTION: 1,
    },
    onEquip: (hero) => {},
    onUnequip: (hero) => {},
};
