import { Item } from "../../models/Items";

import { IronMace } from "./IronMace";
import { Dagger } from "./Dagger";
import { LongSword } from "./LongSword";
import { ShortSword } from "./ShortSword";
import { WoodenClub } from "./WoodenClub";
import { HandAxe } from "./HandAxe";
import { Katana } from "./Katana";
import { Gambeson, LeatherArmor, StuddedLeatherArmor } from "./LightArmor";
import { LeatherBoots } from "./LeatherBoots";
import { LeatherCap } from "./LeatherCap";
import { BronzeBuckler } from "./BronzeBuckler";
import { BreastPlate, ChainMail, ScaleMail } from "./MediumArmor";
import { RoundShield } from "./RoundShield";
import { TowerShield } from "./TowerShield";
import { Barbute, Cervelliere, GreatHelm } from "./Helmets";
import { EnergyPotion, GreaterEnergyPotion, GreaterHealingPotion, GreaterPotionOfInsight, HealingPotion, MinorEnergyPotion, MinorHealingPotion, MinorPotionOfInsight, PotionOfInsight } from "./Potions";
import { BronzeSpear } from "./BronzeSpear";
import { RingOfHealing } from "./RingOfHealing";
import { MinorWandOfFire } from "./MinorWandOfFire";
import { RingOfRegeneration } from "./RingOfRegeneration";
import { CloakOfSwiftness } from "./CloakOfSwiftness";
import { MinorRingOfPower } from "./RingOfPower";




export const basicWeapons: Item[] = [
    Dagger,
    ShortSword,
    WoodenClub,
    BronzeSpear,
];


export const defaultWeapons: Item[] = [
    LongSword,
    IronMace,
    HandAxe,
];

export const advancedWeapons: Item[] = [

];

export const exoticWeapons: Item[] = [
    Katana,
];


export const basicArmors: Item[] = [
    Gambeson,
    LeatherArmor,
    LeatherBoots,
    LeatherCap,
    BronzeBuckler,
];

export const standardArmors: Item[] = [
    StuddedLeatherArmor,
    BreastPlate,
    RoundShield,
    Cervelliere,
];

export const heavyArmors: Item[] = [
    ChainMail,
    ScaleMail,
    TowerShield,
    Barbute,
    GreatHelm,
];

export const minorPotions: Item[] = [
    MinorHealingPotion,
    MinorEnergyPotion,
    MinorPotionOfInsight
];

export const defaultPotions: Item[] = [
    HealingPotion,
    EnergyPotion,
    PotionOfInsight
];

export const greaterPotions: Item[] = [
    GreaterEnergyPotion,
    GreaterHealingPotion,
    GreaterPotionOfInsight
];


export const minorMagicItems: Item[] = [
    RingOfHealing,
    MinorWandOfFire,
];

export const MediumMagicItems: Item[] = [
    RingOfRegeneration,
    CloakOfSwiftness,
    MinorRingOfPower,

];

export const allItems: Item[] = [
    ...basicWeapons,
    ...defaultWeapons,
    ...advancedWeapons,
    ...exoticWeapons,
    ...basicArmors,
    ...standardArmors,
    ...heavyArmors,
    ...minorPotions,
    ...defaultPotions,
    ...greaterPotions,
    ...minorMagicItems,
    ...MediumMagicItems,
].reduce((items, item) => {
    if (items.find(i => i.id === item.id) === undefined) {
        items.push(item);
    }
    return items;
}, [] as Item[]);