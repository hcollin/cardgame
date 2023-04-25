import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { Item } from "../../models/Items";
import { GameState } from "../../models/GameState";

export const RingOfRegeneration: Item = {
    id: "ring-of-regeneration",
    name: "Ring of Regeneration",
    itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
    description: "This is simple silver ring with engraved runes. It heals it's wearer everyturn.",
    cards: [],
    onEndOfTurn: (gs: GameState) => {
        if(gs.hero.health < gs.hero.maxHealth) {
            gs.hero.health += 1;
        }
        return { ...gs };
    }


};
