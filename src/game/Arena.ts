import { Enemy } from "./Enemy";


export class Arena {
    
    public name: string ="Arena";
    public enemies: Enemy[];
    public background: string;
    public bgImage: string|null = null;

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

}