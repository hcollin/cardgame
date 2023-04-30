import { ITEMSLOT } from "../../models/HeroStats";
import { Item } from "../../models/Items";

export const LeatherArmor: Item = {
    id: "leather-armor",
    name: "Leather Armor",
    itemSlots: [ITEMSLOT.BODY],
    description: "ARMOR 2. A simple leather ammor",
    cards: [],
    onEquip: (hero) => {
        hero.effectArmor += 2;
        return { ...hero };
    },
    onUnequip: (hero) => {
        hero.effectArmor -= 2;
        return { ...hero };
    }
};
