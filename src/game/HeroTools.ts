import { HeroStats } from "../models/HeroStats";



export function createHero(): HeroStats {
    return {
        health: 50,
        maxHealth: 50,

        aps: 4,
        maxAps: 4,

        armor: 0,
        defaultArmor: 0,

        effects: new Map(),

        score: 0,
    };
}


export function cleanUpHeroAtTheEndOfTurn(hero: HeroStats): HeroStats {

    return { ...hero };
}