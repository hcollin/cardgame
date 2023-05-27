import { CARDFLAGS, CARDRARITY, DAMAGETYPE, TARGETS } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";
import { ITEMSLOT } from "../../models/HeroStats";
import { ITEMRARITY, Item } from "../../models/Items";

export const MinorRingOfHealing: Item = {
    id: "minor-ring-of-healing",
    name: "Minor Ring of Healing",
    groups: ["Ring", "Magic Item", "Healing", "Minor"],
    itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
    description: "This is an ornate ring with a large gem in the center. It provides its wearer an ability to heal themselves.",
    rarity: ITEMRARITY.COMMON,
    price: 150,
    cards: [
        {
            name: "Heal",
            rulesText: "Heal 2",
            description: "The healing feels like a warm hug from a loved one.",
            rarity: CARDRARITY.COMMON,
            count: 2,
            damage: [],
            apCost: 1,
            reach: 1,
            allowedTargets: [TARGETS.SELF],
            effectsOnHit: [],
            onHit: (as) => {
                return { ...as };
            },

            onUse: (as) => {
                as.hero.healHero(2);
                return { ...as };
            },
        },

    ],
};


export const RingOfHealing: Item = {
    id: "ring-of-healing",
    name: "Ring of Healing",
    groups: ["Ring", "Magic Item", "Healing"],
    itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
    description: "This is an ornate ring with a large gem in the center. It provides its wearer an ability to heal themselves.",
    rarity: ITEMRARITY.UNCOMMON,
    price: 150,
    cards: [
        {
            name: "Heal",
            rulesText: "Heal 5",
            description: "The healing feels like a warm hug from a loved one.",
            rarity: CARDRARITY.UNCOMMON,
            count: 2,
            damage: [],
            apCost: 2,
            reach: 1,
            allowedTargets: [TARGETS.SELF],
            effectsOnHit: [],
            onHit: (as) => {
                return { ...as };
            },

            onUse: (as) => {
                as.hero.healHero(5);
                return { ...as };
            },
        },

    ],
};



export const MajorRingOfHealing: Item = {
    id: "major-ring-of-healing",
    name: "Major Ring of Healing",
    groups: ["Ring", "Magic Item", "Healing", "Major"],
    itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
    description: "This is an ornate ring with a large gem in the center. It provides its wearer an ability to heal themselves.",
    rarity: ITEMRARITY.RARE,
    price: 150,
    cards: [
        {
            name: "Heal",
            rulesText: "Heal 8",
            description: "The healing feels like a warm hug from a loved one.",
            rarity: CARDRARITY.RARE,
            count: 2,
            damage: [],
            apCost: 2,
            reach: 1,
            allowedTargets: [TARGETS.SELF],
            effectsOnHit: [],
            onHit: (as) => {
                return { ...as };
            },

            onUse: (as) => {
                as.hero.healHero(8);
                return { ...as };
            },
        },

    ],
};



export const LegendaryRingOfHealing: Item = {
    id: "legendary-ring-of-healing",
    name: "Legendary Ring of Healing",
    groups: ["Ring", "Magic Item", "Healing", "Legendary"],
    itemSlots: [ITEMSLOT.LEFT_FINGER, ITEMSLOT.RIGHT_FINGER],
    description: "This is an ornate ring with a large gem in the center. It provides its wearer an ability to heal themselves.",
    rarity: ITEMRARITY.EPIC,
    price: 500,
    cards: [
        {
            name: "Aeon's Grace",
            rulesText: "FULLY HEAL YOURSELF ONCE PER BATTLE",
            description: "You feel as if you had  bathed in a timeless energy, bringing them back to peak health, leaving them invigorated and impervious to harm for a brief moment.",
            rarity: CARDRARITY.EPIC,
            count: 1,
            damage: [],
            apCost: 6,
            reach: 1,
            allowedTargets: [TARGETS.SELF],
            effectsOnHit: [],
            flags: [CARDFLAGS.SINGLEUSE],
            onHit: (as) => {
                return { ...as };
            },

            onUse: (as) => {
                as.hero.healHero(9999);
                return { ...as };
            },
        },
        {
            name: "Essense of life",
            rulesText: "Heal 25",
            description: "You sense a deep renewal within, as if life itself is rekindling in your veins.",
            rarity: CARDRARITY.RARE,
            count: 1,
            damage: [],
            apCost: 4,
            reach: 1,
            allowedTargets: [TARGETS.SELF],
            effectsOnHit: [],
            onHit: (as) => {
                return { ...as };
            },

            onUse: (as) => {
                as.hero.healHero(25);
                return { ...as };
            },
        },
        {
            name: "Light of Purity",
            rulesText: "Heal 13",
            description: "You feel a gentle glow that washes over the you, knitting together even serious injuries.",
            rarity: CARDRARITY.UNCOMMON,
            count: 2,
            damage: [],
            apCost: 2,
            reach: 1,
            allowedTargets: [TARGETS.SELF],
            effectsOnHit: [],
            onHit: (as) => {
                return { ...as };
            },

            onUse: (as) => {
                as.hero.healHero(13);
                return { ...as };
            },
        },
        {
            name: "Rejunating touch",
            rulesText: "Heal 5",
            description: "The healing feels like a a soothing glow washing over, easing pain and removing discomfort.",
            rarity: CARDRARITY.UNCOMMON,
            count: 3,
            damage: [],
            apCost: 1,
            reach: 1,
            allowedTargets: [TARGETS.SELF],
            effectsOnHit: [],
            onHit: (as) => {
                return { ...as };
            },

            onUse: (as) => {
                as.hero.healHero(5);
                return { ...as };
            },
        },

    ],
};