import { Item } from "../../models/Items";

import { IronMace } from "./IronMace";
import { Dagger } from "./Dagger";
import { LongSword } from "./LongSword";
import { ShortSword } from "./ShortSword";
import { WoodenClub } from "./WoodenClub";
import { HandAxe } from "./HandAxe";
import { Katana } from "./Katana";
import { Gambeson, LeatherArmor, StuddedLeatherArmor } from "./LightArmor";
import { BootsOfSwiftness, ElvishBoots, IronGreaves, LeatherBoots, Sandals } from "./Boots";
import { LeatherCap } from "./LeatherCap";
import { BronzeBuckler } from "./BronzeBuckler";
import { BreastPlate, ChainMail, ScaleMail } from "./MediumArmor";
import { RoundShield } from "./RoundShield";
import { TowerShield } from "./TowerShield";
import { Barbute, Cervelliere, GreatHelm } from "./Helmets";
import {
	EnergyPotion,
	GreaterEnergyPotion,
	GreaterHealingPotion,
	GreaterPotionOfInsight,
	HealingPotion,
	MinorEnergyPotion,
	MinorHealingPotion,
	MinorPotionOfAntiVenom,
	MinorPotionOfInsight,
	PotionOfAntiVenom,
	PotionOfInsight,
	PotionOfNeutralize,
	VerySpecialPotion,
} from "./Potions";
import { BronzeSpear } from "./BronzeSpear";
import { LegendaryRingOfHealing, MajorRingOfHealing, MinorRingOfHealing, RingOfHealing } from "./RingOfHealing";
import { MinorWandOfFire } from "./MinorWandOfFire";
import { RingOfRegeneration } from "./RingOfRegeneration";
import { CapeOfWisdom, CloakOfDisplacement, CloakOfProtection, CloakOfSwiftness, MerlinsCape } from "./Cloaks";
import { MinorRingOfPower } from "./RingOfPower";
import { Claymore } from "./Claymore";
import { BattleAxe } from "./BattleAxe";
import { FlaskOfWater } from "./GeneralStuff";


export const generalItems: Item[] = [Sandals, FlaskOfWater];

export const basicWeapons: Item[] = [Dagger, ShortSword, WoodenClub, BronzeSpear, HandAxe];

export const defaultWeapons: Item[] = [LongSword, IronMace, Claymore, BattleAxe];

export const advancedWeapons: Item[] = [];

export const exoticWeapons: Item[] = [Katana];

export const basicArmors: Item[] = [Gambeson, LeatherArmor, LeatherBoots, LeatherCap, BronzeBuckler];

export const standardArmors: Item[] = [StuddedLeatherArmor, BreastPlate, RoundShield, Cervelliere, IronGreaves];

export const heavyArmors: Item[] = [ChainMail, ScaleMail, TowerShield, Barbute, GreatHelm];

export const minorPotions: Item[] = [MinorHealingPotion, MinorEnergyPotion, MinorPotionOfInsight, MinorPotionOfAntiVenom, VerySpecialPotion];

export const defaultPotions: Item[] = [HealingPotion, EnergyPotion, PotionOfInsight, PotionOfAntiVenom, PotionOfNeutralize];

export const greaterPotions: Item[] = [GreaterEnergyPotion, GreaterHealingPotion, GreaterPotionOfInsight];

export const minorMagicItems: Item[] = [MinorRingOfHealing, MinorWandOfFire, CloakOfProtection];

export const MediumMagicItems: Item[] = [RingOfRegeneration, CloakOfSwiftness, MinorRingOfPower, RingOfHealing, CloakOfDisplacement];

export const MajorMagicItems: Item[] = [MajorRingOfHealing, CapeOfWisdom, ElvishBoots];

export const LegendaryMagicItems: Item[] = [LegendaryRingOfHealing, MerlinsCape, BootsOfSwiftness];

export const allItems: Item[] = [
	...generalItems,
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
	...MajorMagicItems,
	...LegendaryMagicItems,
].reduce((items, item) => {
	if (items.find((i) => i.id === item.id) === undefined) {
		items.push(item);
	}
	return items;
}, [] as Item[]);
