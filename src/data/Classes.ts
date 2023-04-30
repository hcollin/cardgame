import { CharacterClass } from "../models/HeroStats";
import { Shield } from "./items/Shield";
import { ShortSword } from "./items/ShortSword";



export const ClassWarrior: CharacterClass = {
    name: "Warrior",
    startingItems: [ShortSword, Shield],
    levelStats: [
        { health: 0, armor: 0, energy: 0, rHandSize: 0, lHandSize: 0, cape: false },
        { health: 5, armor: 0, energy: 0, rHandSize: 0, lHandSize: 0, cape: false }, // 1
        { health: 5, armor: 1, energy: 0, rHandSize: 0, lHandSize: 0, cape: false }, // 2
        { health: 5, armor: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: false }, // 3
        { health: 15, armor: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: false }, // 4
        { health: 30, armor: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: true }, // 5
        { health: 30, armor: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: true }, // 6
        { health: 30, armor: 3, energy: 1, rHandSize: 0, lHandSize: 0, cape: true }, // 7
        { health: 30, armor: 3, energy: 2, rHandSize: 0, lHandSize: 0, cape: true }, // 8
        { health: 50, armor: 3, energy: 2, rHandSize: 1, lHandSize: 1, cape: true },  // 9
        { health: 50, armor: 3, energy: 3, rHandSize: 1, lHandSize: 1, cape: true }  // 10
    ]
}