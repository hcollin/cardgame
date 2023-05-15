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
    onUse: (gs) => {
        gs.hero.healHero(10);
        return { ...gs };
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
    onUse: (gs) => {
        gs.hero.healHero(25);
        return { ...gs };
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
    onUse: (gs) => {
        gs.hero.healHero(60);
        return { ...gs };
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
    onUse: (gs) => {
        // gs.hero.modifyEffectEnergy(1);
        gs.hero.useEnergy(-1);
        return { ...gs };
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
    onUse: (gs) => {
        gs.hero.useEnergy(-2);
        return { ...gs };
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
    onUse: (gs) => {
        gs.hero.useEnergy(-4);
        return { ...gs };
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
    onUse: (gs) => {
        gs.rightHand.drawCards(gs, 1);
        gs.leftHand.drawCards(gs, 1);
        return { ...gs };
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
    onUse: (gs) => {
        gs.rightHand.drawCards(gs, 2);
        gs.leftHand.drawCards(gs, 2);
        return { ...gs };
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
    onUse: (gs) => {
        gs.rightHand.drawCards(gs, 3);
        gs.leftHand.drawCards(gs, 3);
        return { ...gs };
    }
}