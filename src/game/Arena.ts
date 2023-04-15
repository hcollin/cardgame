import { Enemy } from "./Enemy";


export class Arena {
    
    public name: string ="Arena";
    public enemies: Enemy[];
    public background: string;

    constructor(name: string, enemies: Enemy[], background: string) {
        this.name = name;
        this.enemies = enemies;
        this.background = background;
    }


    public resetArena(): void {
        this.enemies.forEach(enemy => {
            enemy.resetEnemy();
        });
    }

}