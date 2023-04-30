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
import { ShortSword } from "../data/items/ShortSword";
import { Dagger } from "../data/items/Dagger";
import { LeatherBoots } from "../data/items/LeatherBoots";
import { CloakOfSwiftness } from "../data/items/CloakOfSwiftness";
import { MinorWandOfFire } from "../data/items/MinorWandOfFire";
import { Katana } from "../data/items/Katana";


export class Arena {
    
    public name: string ="Arena";
    public enemies: Enemy[];
    public background: string;
    public bgImage: string|null = null;

    protected rewardItems: Item[] = [
        Dagger,
        ShortSword,
        LongSword,
        Katana,

        Mace,

        HandAxe,

        Buckler,
        Shield,
        
        LeatherArmor,
        
        LeatherBoots,

        RingOfHealing,
        RingOfRegeneration,

        CloakOfSwiftness,

        MinorWandOfFire,
        
    ];

    protected rewardCount: number = 3;

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
    public getRewardOptions(): Item[] {
        if(this.rewardItems.length <= this.rewardCount) return this.rewardItems;
        return arnds(this.rewardItems, this.rewardCount, true);
    }

}