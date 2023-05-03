import { roll } from "rndlib/dist/dice";
import { ClassWarrior } from "../data/Classes";
import { RaceHuman } from "../data/Races";
import { Damage } from "../models/Card";
import { CharacterClass, CharacterRace, ITEMSLOT, LevelMods } from "../models/HeroStats";
import { Item } from "../models/Items";
import { nameGenerator } from "./HeroTools";
import { chance } from "rndlib";
import { CampaignOptions } from "../models/Campaign";

const LEVELEXPERIENCEREQUIREMENTS: number[] = [0, 0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

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

	// Dodge
	protected dodge: number = 0;
	protected temporaryDodge: number = 0;

	// Damage Reduction
	protected damageReduction: number = 0;
	protected temporaryDamageReduction: number = 0;

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

		this.fullReset({
			healAfterArena: 0,
			fullHealOnLevelUp: false,
			endlessLoop: false,
			mapDepth: 15,
			mapWidth: 7,
		});
	}

	// EVENTS TO HERO

	/**
	 * Heal hero for the given amount. Cannot exeed maximum health
	 * @param amount
	 */
	public healHero(amount: number) {
		this.health += amount;
		if (this.health > this.getMaxHealth()) {
			this.health = this.getMaxHealth();
		}
	}

	/**
	 * Take damage from source
	 *
	 * @param dmg
	 */
	public takeDamage(dmg: number) {
		if(this.dodgeRoll()) return;

		let damage = dmg - this.damageReduction - this.temporaryDamageReduction;
		if (damage < 0) damage = 0;

        if(damage <= this.armor) {
            this.armor -= damage;
            return;
        }

        this.health -= damage - this.armor;
        this.armor = 0;
    }

	/**
	 * Hero gains experience. Level up happes only after arena is completed
	 * @param amount
	 */
	public gainExperience(amount: number) {
		this.experience += amount;
	}

	/**
	 * Spend some energy. Returns true if hero had enough energy to spend
	 *
	 * @param amount
	 * @returns
	 */
	public useEnergy(amount: number): boolean {
		if (this.energy < amount) return false;
		this.energy -= amount;
		return true;
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
			item.onEquip(this);
		}
	}

	public unequipItem(slot: ITEMSLOT) {
		const item = this.itemSlots.get(slot);
		if (item) {
			if (item.onUnequip) {
				item.onUnequip(this);
			}
			this.itemSlots.delete(slot);
		}
	}

	// RESETS

	/**
	 * Reset heros data at the beginning of the game
	 */
	public fullReset(options: CampaignOptions) {
		this.level = 1;
		this.experience = 0;

		this.effectArmor = 0;
		this.effectEnergy = 0;
		this.effectHealth = 0;

		this.inventory = [];
		this.heroClass.startingItems.forEach((item) => {
			this.inventory.push(item[0]);
			if(item[1]) {
				this.equipItem(item[0], item[1]);
			}
		});

		this.health = this.getMaxHealth();

		this.arenaReset(options);
	}

	/**
	 * Reset heros data af the arena is completed
	 */
	public arenaReset(options: CampaignOptions) {
		// Check for level up
		if (this.experience >= LEVELEXPERIENCEREQUIREMENTS[this.level + 1]) {
			this.level++;
			if(options.fullHealOnLevelUp) {
				this.health = this.getMaxHealth();
			}
		}

		
		this.turnReset();
	}

	/**
	 * Reset heros data at the beginning of the player turn
	 */
	public turnReset() {
		this.armor = this.getEffectedArmor();
		this.energy = this.getEffectedEnergy();
		this.temporaryDodge = 0;	// Reset temporary dodge
		
	}

	// Status

	public isDead(): boolean {
		return this.health <= 0;
	}

	

	// LEVELING UP

	// Calculated Getters

	public getBaseArmor(): number {
		return this.heroRace.baseArmor + this.heroClass.levelStats[this.level].armor;
	}

	public getEffectedArmor(): number {
		return this.effectArmor + this.getBaseArmor();
	}

	public getBaseHealth(): number {
		return this.heroRace.baseHealth + this.heroClass.levelStats[this.level].health;
	}

	public getMaxHealth(): number {
		return this.effectHealth + this.getBaseHealth();
	}

	public getBaseEnergy(): number {
		return this.heroRace.baseEnergy + this.heroClass.levelStats[this.level].energy;
	}

	public getEffectedEnergy(): number {
		return this.effectEnergy + this.getBaseEnergy();
	}

	public getHandSize(hand: "RIGHT" | "LEFT"): number {
		if (hand === "RIGHT") {
			return this.heroRace.baseHandSize + this.heroClass.levelStats[this.level].rHandSize;
		} else {
			return this.heroRace.baseHandSize + this.heroClass.levelStats[this.level].lHandSize;
		}
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

	public getEnergy(): number {
		return this.energy;
	}

	public getDodge(): number {
		return this.dodge + this.temporaryDodge;
	}

	public getDamageReduction(): number {
		return this.damageReduction;
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

	public getEquippedItem(slot: ITEMSLOT): Item | undefined {
		return this.itemSlots.get(slot);
	}

	public getEquippableSlots(): ITEMSLOT[] {
		const slots: ITEMSLOT[] = [
			ITEMSLOT.BODY,
			ITEMSLOT.HEAD,
			ITEMSLOT.LEGS,
			ITEMSLOT.FEET,
			ITEMSLOT.LEFT_HAND,
			ITEMSLOT.LEFT_FINGER,
			ITEMSLOT.RIGHT_HAND,
			ITEMSLOT.RIGHT_FINGER,
		];
		if (this.heroClass.levelStats[this.level].cape) {
			slots.push(ITEMSLOT.CAPE);
		}
		return slots;
	}

	// Setters

    public modifyArmor(amount: number, floorToZero?: boolean) {
        this.armor += amount;
        if(floorToZero) {
            this.armor = Math.max(0, this.armor);
        }
    }    

	public setEffectArmor(amount: number) {
		this.effectArmor = amount;
	}

	public modifyEffectArmor(amount: number) {
		this.effectArmor += amount;
	}

	public setEffectHealth(amount: number) {
		this.effectHealth = amount;
	}

	public modifyEffectHealth(amount: number) {
		this.effectHealth += amount;
	}

	public setEffectEnergy(amount: number) {
		this.effectEnergy = amount;
	}

	public modifyEffectEnergy(amount: number) {
		this.effectEnergy += amount;
	}

	public modifyDodge(amount: number) {
		this.dodge += amount;
	}

	public modifyTemporaryDodge(amount: number) {
		this.temporaryDodge += amount;
	}

	public modifyTemporaryDamageReduction(amount: number) {
		this.temporaryDamageReduction += amount;
	}	

	public modifyDamageReduction(amount: number) {
		this.damageReduction += amount;
	}	



	/**
	 * Roll to see if the hero succeeds in dodging
	 * 
	 * @returns 
	 */
	private dodgeRoll(): boolean {
		const dodgeChance = this.dodge + this.temporaryDodge >= 100 ? 99 : this.dodge + this.temporaryDodge <= 0 ? 0 : this.dodge + this.temporaryDodge;
		return chance(dodgeChance);

	}
}
