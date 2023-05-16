import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const RingOfHealing: Item = {
    id: "ring-of-healing",
    name: "Ring of Healing",
    groups: ["Ring", "Magic Item", "Healing"],
    itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
    description: "This is an ornate ring with a large gem in the center. It provides its wearer an ability to heal themselves.",
    rarity: ITEMRARITY.RARE,
    price: 150,
    cards: [
        {
            name: "Heal",
            rulesText: "Heal 5",
            description: "The healing feels like a warm hug from a loved one.",
            rarity: CARDRARITY.COMMON,
            count: 2,
            damage: [],
            apCost: 2,
            reach: 1,
            allowedTargets: [TARGETS.SELF],
            effectsOnHit: [],
            onHit: (gs) => {
                return { ...gs };
            },

            onUse: (gs) => {
                gs.hero.healHero(5);
                return { ...gs };
            },
        },

    ],
};
