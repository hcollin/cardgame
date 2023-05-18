import { Item, ITEMRARITY } from "../../models/Items";

export const MinorHealingPotion: Item = {
    id: "minor-healing-potion",
    name: "Minor Healing Potion",
    groups: ["Potion", "Healing", "Consumable", "grade-1"],
    rulesText: "Heal 10 damage.",
    description: "A small vial of liquid that heals wounds.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.COMMON,
    bonus: {},
    price: 15,
    onUse: (as) => {
        as.hero.healHero(10);
        return { ...as };
    }

};

export const HealingPotion: Item = {
    id: "healing-potion",
    name: "Healing Potion",
    groups: ["Potion", "Healing", "Consumable", "grade-2"],
    rulesText: "Heal 25 damage.",
    description: "A small vial of liquid that heals wounds.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.UNCOMMON,
    bonus: {},
    price: 40,
    onUse: (as) => {
        as.hero.healHero(25);
        return { ...as };
    }
}

export const GreaterHealingPotion: Item = {
    id: "greater-healing-potion",
    name: "Greater Healing Potion",
    groups: ["Potion", "Healing", "Consumable", "grade-3"],
    rulesText: "Heal 60 damage.",
    description: "A small vial of liquid that heals wounds.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.RARE,
    bonus: {},
    price: 70,
    onUse: (as) => {
        as.hero.healHero(60);
        return { ...as };
    }
};


export const MinorEnergyPotion: Item = {
    id: "minor-energy-potion",
    name: "Minor Energy Potion",
    groups: ["Potion", "Energy", "Consumable", "grade-1"],
    rulesText: "Gain 1 energy.",
    description: "A small vial of liquid that restores energy.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.COMMON,
    bonus: {},
    price: 20,
    onUse: (as) => {
        // as.hero.modifyEffectEnergy(1);
        as.hero.useEnergy(-1);
        return { ...as };
    }
};

export const EnergyPotion: Item = {
    id: "energy-potion",
    name: "Energy Potion",
    groups: ["Potion", "Energy", "Consumable", "grade-2"],
    rulesText: "Gain 2 energy.",
    description: "A small vial of liquid that restores energy.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.UNCOMMON,
    bonus: {},
    price: 50,
    onUse: (as) => {
        as.hero.useEnergy(-2);
        return { ...as };
    }
};

export const GreaterEnergyPotion: Item = {
    id: "greater-energy-potion",
    name: "Greater Energy Potion",
    groups: ["Potion", "Energy", "Consumable", "grade-3"],
    rulesText: "Gain 4 energy.",
    description: "A small vial of liquid that restores energy.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.RARE,
    bonus: {},
    price: 95,
    onUse: (as) => {
        as.hero.useEnergy(-4);
        return { ...as };
    }
};

export const MinorPotionOfInsight: Item = {
    id: "minor-potion-of-insight",
    name: "Minor Potion of Insight",
    groups: ["Potion", "Insight", "Consumable", "grade-1"],
    rulesText: "Draw 1 card to both hands.",
    description: "A small vial of liquid that grants insight.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.UNCOMMON,
    bonus: {},
    price: 20,
    onUse: (as) => {
        as.rightHand.drawCards(as, 1);
        as.leftHand.drawCards(as, 1);
        return { ...as };
    }
}

export const PotionOfInsight: Item = {
    id: "potion-of-insight",
    name: "Potion of Insight",
    groups: ["Potion", "Insight", "Consumable", "grade-2"],
    rulesText: "Draw 2 card to both hands.",
    description: "A small vial of liquid that grants insight.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.RARE,
    bonus: {},
    price: 50,
    onUse: (as) => {
        as.rightHand.drawCards(as, 2);
        as.leftHand.drawCards(as, 2);
        return { ...as };
    }
};

export const GreaterPotionOfInsight: Item = {
    id: "greater-potion-of-insight",
    name: "Greater Potion of Insight",
    groups: ["Potion", "Insight", "Consumable", "grade-3"],
    rulesText: "Draw 3 card to both hands.",
    description: "A small vial of liquid that grants insight.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.EPIC,
    bonus: {},
    price: 95,
    onUse: (as) => {
        as.rightHand.drawCards(as, 3);
        as.leftHand.drawCards(as, 3);
        return { ...as };
    }
}