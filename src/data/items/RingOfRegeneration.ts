import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";
import { ArenaState } from "../../models/ArenaState";

export const RingOfRegeneration: Item = {
    id: "ring-of-regeneration",
    name: "Ring of Regeneration",
    groups: ["Ring", "Magic Item", "Healing"],
    itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
    rulesText: "HEAL 1 at the end of your turn",
    description: "This is simple silver ring with engraved runes.",
    price: 250,
    cards: [],
    rarity: ITEMRARITY.EPIC,
    onEndOfTurn: (as: ArenaState) => {
        as.hero.healHero(1);
        return { ...as };
    }


};
