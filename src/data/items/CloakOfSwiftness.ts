import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const CloakOfSwiftness: Item = {
    id: "cloak-swiftness",
    name: "Cloak of Swiftness",
    itemSlots: [ITEMSLOT.CAPE],
    description: "+1 Energy per turn",
    cards: [],
    rarity: ITEMRARITY.RARE,
    onEquip: (hero) => {
        hero.modifyEffectEnergy(1);

    },
    onUnequip: (hero) => {
        hero.modifyEffectEnergy(-1);
    }
};
