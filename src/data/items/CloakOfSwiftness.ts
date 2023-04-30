import { ITEMSLOT } from "../../models/HeroStats";
import { Item } from "../../models/Items";

export const CloakOfSwiftness: Item = {
    id: "cloak-swiftness",
    name: "Cloak of Swiftness",
    itemSlots: [ITEMSLOT.CAPE],
    description: "+1 Energy per turn",
    cards: [],
    onEquip: (hero) => {
        hero.modifyEffectEnergy(1);

    },
    onUnequip: (hero) => {
        hero.modifyEffectEnergy(-1);
    }
};
