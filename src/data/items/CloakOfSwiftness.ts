import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const CloakOfSwiftness: Item = {
    id: "cloak-swiftness",
    name: "Cloak of Swiftness",
    groups: ["Cloak", "Magic Item"],
    itemSlots: [ITEMSLOT.CAPE],
    rulesText: "Energy +1",
    description: "This cloak is made of an impossibly light material that reflects light in a way that makes the wearer appear to be moving faster than they actually are.",
    cards: [],
    price: 350,
    rarity: ITEMRARITY.RARE,
    bonus: {
        energy: 1
    },
    
    onEquip: (hero) => {
        // hero.modifyEffectEnergy(1);

    },
    onUnequip: (hero) => {
        // hero.modifyEffectEnergy(-1);
    }
};
