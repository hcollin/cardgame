import { Item, ITEMRARITY } from "../../models/Items";

export const MinorHealingPotion: Item = {
    id: "minor-healing-potion",
    name: "Minor Healing Potion",
    groups: ["Potion", "Healing", "Consumable"],
    rulesText: "Heal 10 damage.",
    description: "A small vial of liquid that heals wounds.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.COMMON,
    bonus: {},
    onUse: (gs) => {
        gs.hero.healHero(10);
        return {...gs};
    }
 
};

export const HealingPotion: Item = {
    id: "healing-potion",
    name: "Healing Potion",
    groups: ["Potion", "Healing", "Consumable"],
    rulesText: "Heal 25 damage.",
    description: "A small vial of liquid that heals wounds.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.UNCOMMON,
    bonus: {},
    onUse: (gs) => {
        gs.hero.healHero(25);
        return {...gs};
    }
} 

export const GreaterHealingPotion: Item = {
    id: "greater-healing-potion",
    name: "Greater Healing Potion",
    groups: ["Potion", "Healing", "Consumable"],
    rulesText: "Heal 60 damage.",
    description: "A small vial of liquid that heals wounds.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.RARE,
    bonus: {},
    onUse: (gs) => {
        gs.hero.healHero(60);
        return {...gs};
    }   
};


export const MinorEnergyPotion: Item = {
    id: "minor-energy-potion",
    name: "Minor Energy Potion",
    groups: ["Potion", "Energy", "Consumable"],
    rulesText: "Gain 1 energy.",
    description: "A small vial of liquid that restores energy.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.COMMON,
    bonus: {},
    onUse: (gs) => {
        gs.hero.modifyEffectEnergy(1);
        return {...gs};
    }   
};

export const EnergyPotion: Item = {
    id: "energy-potion",
    name: "Energy Potion",
    groups: ["Potion", "Energy", "Consumable"],
    rulesText: "Gain 2 energy.",
    description: "A small vial of liquid that restores energy.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.UNCOMMON,
    bonus: {},
    onUse: (gs) => {
        gs.hero.modifyEffectEnergy(2);
        return {...gs};
    }   
};

export const GreaterEnergyPotion: Item = {
    id: "greater-energy-potion",
    name: "Greater Energy Potion",
    groups: ["Potion", "Energy", "Consumable"],
    rulesText: "Gain 4 energy.",
    description: "A small vial of liquid that restores energy.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.RARE,
    bonus: {},
    onUse: (gs) => {
        gs.hero.modifyEffectEnergy(4);
        return {...gs};
    }   
};