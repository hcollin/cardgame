import { CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { Item } from "../../models/Items";

export const RingOfHealing: Item = {
    id: "ring-of-healing",
    name: "Ring of Healing",
    itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
    description: "This is an ornate ring with a large gem in the center. It provides its wearer an ability to heal themselves.",
    cards: [
        {
            name: "Heal",
            description: "HEAL 5",
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
                gs.hero.health += 5;
                if (gs.hero.health > gs.hero.maxHealth) {
                    gs.hero.health = gs.hero.maxHealth;
                }
                return { ...gs };
            },
        },

    ],
};