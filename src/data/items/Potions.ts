import { chance, rnd } from "rndlib";
import { EFFECTS } from "../../models/Effects";
import { Item, ITEMRARITY } from "../../models/Items";
import { effStore } from "../../utils/usePlayerEffect";

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


export const MinorPotionOfAntiVenom: Item = {
    id: "minor-potion-of-antivenom",
    name: "Minor Potion of Anti-Venom",
    groups: ["Potion", "Anti-Venom", "Consumable", "grade-1"],
    rulesText: "Remove 3 poison",
    description: "A small vial of suspicious green liquid.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.COMMON,
    bonus: {},
    price: 10,
    onUse: (as) => {
        as.hero.adjustEffect(EFFECTS.POISON, 3);
        return { ...as };
    }
};

export const PotionOfAntiVenom: Item = {
    id: "potion-of-antivenom",
    name: "Potion of Anti-Venom",
    groups: ["Potion", "Anti-Venom", "Consumable", "grade-1"],
    rulesText: "Remove all poison",
    description: "A large vial of very suspicious green liquid.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.UNCOMMON,
    bonus: {},
    price: 30,
    onUse: (as) => {
        as.hero.removeEffect(EFFECTS.POISON);
        return { ...as };
    }
};

export const PotionOfNeutralize: Item = {
    id: "potion-of-neutralize",
    name: "Potion of Neutralize",
    groups: ["Potion", "Consumable", "grade-3", "Neutralize"],
    rulesText: "Remove all effects",
    description: "A clear, sparkling elixir held in a simple glass vial, its fluid seems to shimmer with an ethereal, balanced energy.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.RARE,
    bonus: {},
    price: 50,
    onUse: (as) => {
        as.hero.clearEffects();
        return { ...as };
    }
};

export const VerySpecialPotion: Item = {
    id: "very-special-potion",
    name: "Very Special Potion",
    groups: ["Potion", "Consumable", "grade-2", "Very Special"],
    rulesText: "Drink and see what happens.",
    description: "A small vial of a mysterious liquid. It seems to be glowing and... laughing?.",
    itemSlots: [],
    cards: [],
    rarity: ITEMRARITY.UNCOMMON,
    bonus: {},
    price: 20,
    onUse: (as) => {
        let results: string[] = [];
        
        // Heal or damage
        if(chance(75))  {   
            const val = rnd(1,50);
            as.hero.healHero(val);
            results.push(`heal ${val} health`);
        } else {
            if(chance(20)) {
                const val = rnd(1,10);
                as.hero.takeDamage(val);
                results.push( `take ${val} damage`);
            }
        }

        // Gain or lose energy
        if(chance(25)) {
            const val = rnd(1,3);
            as.hero.useEnergy(val * -1);
            results.push(` gain ${val} energy `);
        } else {
            if(chance(10)) {
                const val = rnd(1,2);
                as.hero.useEnergy(val);
                results.push(`lose ${val} energy`);
            }
        }

        // Gain or lose block
        if(chance(50)) {
            const val = rnd(1,10);
            as.hero.modifyArmor(val);
            results.push(` gain ${val} block `);
        } else {
            if(chance(20)) {
                const val = rnd(1,4);
                as.hero.modifyArmor(val * -1);
                results.push(`lose ${val} block`);
            }
        }

        // Gain gold
        if(chance(25)) {
            const val = rnd(1,50);
            as.hero.gold += val;
            results.push(`find ${val} gold`);
        }

        // Gain or lose dodge
        if(chance(50)) {
            const val = rnd(1,80);
            as.hero.modifyTemporaryDodge(val);
            results.push(`gain ${val} dodge`);
        } else {
            if(chance(20)) {
                const val = rnd(1,25);
                as.hero.modifyTemporaryDodge(val * -1);
                results.push(`lose ${val} dodge`);
            }
        }

        if(chance(50)) {
            const val = rnd(1,5);
            as.hero.sufferEffect(EFFECTS.POISON, val);
            results.push(`suffer poison ${val}`);
        }

        if(chance(25)) {
            as.hero.sufferEffect(EFFECTS.STUN, 1);
            results.push(`stunned for a turn`);
        }

        if(chance(10)) {
            as.hero.sufferEffect(EFFECTS.FROZEN, 1);
            results.push(`frozen for a turn`);
        }

        effStore.addEffect("potion", `You drink the potion and ${results.join(" and ")}. Enjoy!`);

        return { ...as };
    }
};