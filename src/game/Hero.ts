import { ClassWarrior } from "../data/Classes";
import { RaceHuman } from "../data/Races";
import { LeatherArmor } from "../data/items/LeatherArmor";
import { LongSword } from "../data/items/LongSword";
import { Shield } from "../data/items/Shield";
import { Damage } from "../models/Card";
import { CharacterClass, CharacterRace, ITEMSLOT, LevelMods } from "../models/HeroStats";
import { Item } from "../models/Items";
import { nameGenerator } from "./HeroTools";

const LEVELEXPERIENCEREQUIREMENTS: number[] = [0, 0, 40, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

export default class Hero {
	// Basic information
	protected name: string = "";
	protected heroClass: CharacterClass = ClassWarrior;
	protected heroRace: CharacterRace = RaceHuman;

	// Experience and leveling
	protected experience: number = 0;
	protected level: number = 1;

	// Health
	protected health: number = 40;
    protected effectHealth: number = 0;

	// Armor
	protected armor: number = 0;
	protected effectArmor: number = 0;

	// Energy
	protected energy: number = 0;
	protected effectEnergy: number = 0;

	// Inventory and item slots
	protected inventory: Item[] = [];
	protected itemSlots: Map<ITEMSLOT, Item> = new Map<ITEMSLOT, Item>();

	constructor(chrRace: CharacterRace, chrClass: CharacterClass, name?: string) {
		this.name = name || nameGenerator();

		this.heroClass = chrClass;
		this.heroRace = chrRace;

        this.fullReset();
	}

    // EVENTS TO HERO

    public healHero(amount: number) {
        this.health += amount;
        if(this.health > this.getEffectHealth()) {
            this.health = this.getEffectHealth();
        }   
    }

    public takeDamage(dmg: Damage) {

    }


	// INVENTORY MANAGEMENT

	public addItem(item: Item) {
		if (this.inventory.find((i) => i.id === item.id) === undefined) {
			this.inventory.push(item);
		}
	}

	public removeItem(item: Item) {
		this.inventory = this.inventory.filter((i) => i.id !== item.id);
	}

	public equipItem(item: Item, slot: ITEMSLOT) {
		if (this.inventory.find((i) => i.name === item.name) === undefined) {
			throw new Error("Hero does not have this item in inventory");
		}
		this.itemSlots.set(slot, item);

		if (item.onEquip) {
			// TODO: Fix this
			// item.onEquip(this) ;
		}
	}

	// RESETS

	/**
	 * Reset heros data at the beginning of the game
	 */
	public fullReset() {
		this.level = 1;
		this.experience = 0;

		this.effectArmor = 0;
        this.effectEnergy = 0;
        this.effectHealth = 0;

        this.inventory = [];
        this.heroClass.startingItems.forEach((item) => {
            this.inventory.push(item);
        });

		this.arenaReset();
	}

	/**
	 * Reset heros data af the arena is completed
	 */
	public arenaReset(heal?: boolean) {
		// Check for level up
		if (this.experience >= LEVELEXPERIENCEREQUIREMENTS[this.level + 1]) {
			this.level++;
		}

        if(heal) {
            this.health = this.getEffectHealth();
        }

		this.turnReset();
	}

	/**
	 * Reset heros data at the beginning of the player turn
	 */
	public turnReset() {
		this.armor = this.getEffectArmor();
		this.energy = this.getEffectEnergy();
	}

	// LEVELING UP

	// Calculated Getters

	public getBaseArmor(): number {
		return this.heroRace.baseArmor + this.heroClass.levelStats[this.level].armor;
	}

    public getEffectArmor(): number {
        return this.effectArmor + this.getBaseArmor();
    }

	public getBaseHealth(): number {
		return this.heroRace.baseHealth + this.heroClass.levelStats[this.level].health;
	}

    public getEffectHealth(): number {
        return this.effectHealth + this.getBaseHealth();
    }

    public getBaseEnergy(): number {
        return this.heroRace.baseEnergy + this.heroClass.levelStats[this.level].energy;
    }

    public getEffectEnergy(): number {
        return this.effectEnergy + this.getBaseEnergy();
    }


	// Default Getters
	public getName(): string {
		return this.name;
	}

	public getHealth(): number {
		return this.health;
	}

	public getArmor(): number {
		return this.armor;
	}

	public getExperience(): number {
		return this.experience;
	}

	public getLevel(): number {
		return this.level;
	}

	public getInventory(): Item[] {
		return this.inventory;
	}

	public getItemSlots(): Map<ITEMSLOT, Item> {
		return this.itemSlots;
	}
}
