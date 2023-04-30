import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";
import { GameState } from "../../models/GameState";

export const RingOfRegeneration: Item = {
    id: "ring-of-regeneration",
    name: "Ring of Regeneration",
    itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
    rulesText: "HEAL 1 at the end of your turn",
    description: "This is simple silver ring with engraved runes.",
    cards: [],
    rarity: ITEMRARITY.EPIC,
    onEndOfTurn: (gs: GameState) => {
        gs.hero.healHero(1);
        return { ...gs };
    }


};
