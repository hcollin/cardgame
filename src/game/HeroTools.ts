import { HeroStats, ITEMSLOT } from "../models/HeroStats";

import { LongSword } from "../data/items/LongSword";
import { Shield } from "../data/items/Shield";
import { Mace } from "../data/items/Mace";
import { Item } from "../models/Items";
import { arnd } from "rndlib";
import { ShortSword } from "../data/items/ShortSword";
import { HandAxe } from "../data/items/HandAxe";
import { Buckler } from "../data/items/Buckler";
import { Dagger } from "../data/items/Dagger";
import { LeatherArmor } from "../data/items/LeatherArmor";
import { GameState } from "../models/GameState";
import { RingOfHealing } from "../data/items/RingOfHealing";
import { RingOfRegeneration } from "../data/items/RingOfRegeneration";
import { CloakOfSwiftness } from "../data/items/CloakOfSwiftness";

export function createHero(): HeroStats {
	let hero: HeroStats = {
		name: nameGenerator(),
		health: 50,
		maxHealth: 50,

		aps: 4,
		maxAps: 4,

		armor: 0,
		defaultArmor: 0,

		effects: new Map(),

		score: 0,

		inventory: [],

		activeItems: new Map<ITEMSLOT, Item>(),
		// activeItemRight: null,
		// activeItemLeft: null,
	};

	hero.inventory.push(LongSword);
	hero.inventory.push(ShortSword);
	hero.inventory.push(HandAxe);
	hero.inventory.push(Mace);

	hero.inventory.push(Shield);
	hero.inventory.push(Buckler);
	hero.inventory.push(Dagger);

	hero.inventory.push(LeatherArmor);

	hero.inventory.push(RingOfHealing);
	hero.inventory.push(RingOfRegeneration);

	hero.inventory.push(CloakOfSwiftness);

	hero = equipItemRight(hero, LongSword);
	hero = equipItemLeft(hero, Shield);

	hero = equipItem(hero, LeatherArmor, ITEMSLOT.BODY);
	hero = equipItem(hero, RingOfHealing, ITEMSLOT.LEFT_FINGER);
	hero = equipItem(hero, RingOfRegeneration, ITEMSLOT.RIGHT_FINGER);
	hero = equipItem(hero, CloakOfSwiftness, ITEMSLOT.CAPE);

	return hero;
}

export function resetHero(hero: HeroStats, heal = true): HeroStats {
	hero.health = heal ? hero.maxHealth : hero.health;
	hero.armor = hero.defaultArmor;
	hero.effects.clear();
	hero.aps = hero.maxAps;
	return { ...hero };
}

export function cleanUpHeroAtTheEndOfTurn(hero: HeroStats): HeroStats {
	return { ...hero };
}

export function equipItemRight(hero: HeroStats, item: Item): HeroStats {
	// hero.activeItemRight = item;
	equipItem(hero, item, ITEMSLOT.RIGHT_HAND);
	return { ...hero };
}

export function equipItemLeft(hero: HeroStats, item: Item): HeroStats {
	// hero.activeItemLeft = item;
	equipItem(hero, item, ITEMSLOT.LEFT_HAND);
	return { ...hero };
}

export function equipItem(hero: HeroStats, item: Item, slot: ITEMSLOT): HeroStats {
	if (hero.inventory.find(i => i.name === item.name) === undefined) {
		throw new Error("Hero does not have this item in inventory");
	}
	hero.activeItems.set(slot, item);

	if(item.onEquip) {
		return {...item.onEquip(hero)};
	}
	return { ...hero };
}

export function unequipItem(hero: HeroStats, slot: ITEMSLOT): HeroStats {
	const item = hero.activeItems.get(slot);
	if (!item) return hero;

	hero.activeItems.delete(slot);

	if(item.onUnequip) {
		return {...item.onUnequip(hero)};
	}
	return { ...hero };
}


function nameGenerator(): string {
	const firstNames: string[] = [
		"Gorath",
		"Lirien",
		"Thorn",
		"Raziel",
		"Sarathiel",
		"Zarek",
		"Kael",
		"Xandria",
		"Drakon",
		"Tyrion",
		"Elandriel",
		"Auron",
		"Aeloria",
		"Kethryes",
		"Galadriel",
		"Zephyr",
		"Varian",
		"Leif",
		"Niamh",
		"Cassius",
	];

	const lastNames: string[] = [
		"Ironfist",
		"Shadowblade",
		"Grimheart",
		"Stormcaller",
		"Bloodmoon",
		"Blacksteel",
		"Fireborn",
		"Swiftblade",
		"Frosthammer",
		"Stormbringer",
		"Silvermist",
		"Darkblade",
		"Sunfire",
		"Shadowstalker",
		"Moonblade",
		"Thunderstrike",
		"Bloodfury",
		"Ironbark",
		"Stormchaser",
		"Nightshade",
	];

	return `${arnd(firstNames)} ${arnd(lastNames)}`;
}
