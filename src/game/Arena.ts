import { arnds } from "rndlib";
import { Buckler } from "../data/items/Buckler";
import { HandAxe } from "../data/items/HandAxe";
import { LeatherArmor } from "../data/items/LeatherArmor";
import { LongSword } from "../data/items/LongSword";
import { Mace } from "../data/items/Mace";
import { RingOfHealing } from "../data/items/RingOfHealing";
import { RingOfRegeneration } from "../data/items/RingOfRegeneration";
import { Shield } from "../data/items/Shield";
import { Item } from "../models/Items";
import { Enemy } from "./Enemy";


export class Arena {
    
    public name: string ="Arena";
    public enemies: Enemy[];
    public background: string;
    public bgImage: string|null = null;

    protected rewardItems: Item[] = [
        LongSword,
        Mace,
        HandAxe,
        Shield,
        LeatherArmor,
        RingOfHealing,
        RingOfRegeneration,
        Buckler
    ];

    constructor(name: string, enemies: Enemy[], background: string, bgImage?: string) {
        this.name = name;
        this.enemies = enemies;
        this.background = background;
        this.bgImage = bgImage || null;
    }


    public resetArena(): void {
        this.enemies.forEach(enemy => {
            enemy.resetEnemy();
        });
    }
    public getRewardOptions(count=3): Item[] {
        if(this.rewardItems.length <= count) return this.rewardItems;
        return arnds(this.rewardItems, count, true);
    }

}