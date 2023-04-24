import { HeroStats } from "../models/HeroStats";

import { LongSword } from "../data/items/LongSword";
import { Shield } from "../data/items/Shield";
import { Mace } from "../data/items/Mace";
import { Item } from "../models/Items";

export function createHero(): HeroStats {

    let hero: HeroStats = {
        health: 50,
        maxHealth: 50,

        aps: 4,
        maxAps: 4,

        armor: 0,
        defaultArmor: 0,

        effects: new Map(),

        score: 0,

        inventory: [],
        activeItemRight: null,
        activeItemLeft: null,
    };

    hero.inventory.push(LongSword);
    hero.inventory.push(Shield);
    hero.inventory.push(Mace);

    
    hero = equipItemRight(hero, LongSword);
    hero = equipItemLeft(hero, Shield);

    return hero;
}


export function cleanUpHeroAtTheEndOfTurn(hero: HeroStats): HeroStats {

    return { ...hero };
}


export function equipItemRight(hero: HeroStats, item: Item): HeroStats {
    hero.activeItemRight = item;
    return { ...hero };
}

export function equipItemLeft(hero: HeroStats, item: Item): HeroStats {
    hero.activeItemRight = item;
    return { ...hero };
}


