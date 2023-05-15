import { roll } from "rndlib/dist/dice";
import { ClassWarrior } from "../data/Classes";
import { RaceHuman } from "../data/Races";
import { Damage } from "../models/Card";
import { CharacterClass, CharacterRace, ITEMSLOT, LevelMods } from "../models/HeroStats";
import { Item } from "../models/Items";
import { nameGenerator } from "./HeroTools";
import { chance } from "rndlib";
import { CampaignOptions } from "../models/Campaign";
import { effStore } from "../utils/usePlayerEffect";
import { GameState } from "../models/GameState";

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

	// Block
	protected block: number = 0;
	protected effectBlock: number = 0;

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
		if (this.dodgeRoll()) {
			effStore.addEffect("info", `Dodged ${dmg} damage!`);
			return;
		}

		let damage = dmg;
		if (damage < 0) damage = 0;

		if (damage <= this.block) {
			this.block -= damage;
			effStore.addEffect("dmg", `Blocked ${damage} damage!`);
			return;
		}

		// Damage Reduction does not effect block
		damage = damage - this.getDamageReduction() - this.temporaryDamageReduction;
		if (damage < 0) damage = 0;

		effStore.addEffect("dmg", `Took ${damage - this.block}  damage!`);
		this.health -= damage - this.block;
		this.block = 0;
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

	public consumeItem(itemId: string, gs: GameState) {
		const item = this.inventory.find((i) => i.id === itemId);
		if (item) {
			
			if(item.onUse) {
				item.onUse(gs);
			}

			this.removeItem(item);
		}

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

		this.effectBlock = 0;
		this.effectEnergy = 0;
		this.effectHealth = 0;

		this.inventory = [];
		this.heroClass.startingItems.forEach((item) => {
			this.inventory.push(item[0]);
			if (item[1]) {
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
			if (options.fullHealOnLevelUp) {
				this.health = this.getMaxHealth();
			}
		}

		this.turnReset();
	}

	/**
	 * Reset heros data at the beginning of the player turn
	 */
	public turnReset() {
		this.block = this.getEffectedArmor();
		this.energy = this.getEffectedEnergy();
		this.temporaryDodge = 0; // Reset temporary dodge
	}

	// Status

	public isDead(): boolean {
		return this.health <= 0;
	}

	// LEVELING UP

	// Calculated Getters

	public getBaseArmor(): number {
		return this.heroRace.baseArmor + this.heroClass.levelStats[this.level].block + (this.heroClass.bonus.BLOCK || 0);
	}

	public getEffectedArmor(): number {
	
		return this.effectBlock + this.getBaseArmor() + this.getEquippedItemBonus("BLOCK");
	}

	public getBaseHealth(): number {
		return this.heroRace.baseHealth + this.heroClass.levelStats[this.level].health + (this.heroClass.bonus.HEALTH || 0);
	}

	public getMaxHealth(): number {
		return this.effectHealth + this.getBaseHealth();
	}

	public getBaseEnergy(): number {
		return this.heroRace.baseEnergy + this.heroClass.levelStats[this.level].energy + (this.heroClass.bonus.ENERGY || 0);
	}

	public getEffectedEnergy(): number {
		return this.effectEnergy + this.getBaseEnergy();
	}

	public getHandSize(hand: "RIGHT" | "LEFT"): number {
		// console.log("Hand:", this.heroClass.levelStats[this.level]);
		if (hand === "RIGHT") {
			// console.log("Right hand size:", this.heroRace.baseHandSize + this.heroClass.levelStats[this.level].rHandSize);
			return this.heroRace.baseHandSize + this.heroClass.levelStats[this.level].rHandSize + this.getEquippedItemBonus("RIGHT_HAND_SIZE");
		} else {
			return this.heroRace.baseHandSize + this.heroClass.levelStats[this.level].lHandSize + this.getEquippedItemBonus("LEFT_HAND_SIZE");
		}
	}

	// Default Getters
	public getName(): string {
		return this.name;
	}

	public getClassName(): string {
		return this.heroClass.name;
	}

	public getHealth(): number {
		return this.health;
	}

	public getArmor(): number {
		return this.block;
	}

	public getEnergy(): number {
		return this.energy;
	}

	public getDodge(): number {
		return this.dodge + this.temporaryDodge + this.getEquippedItemBonus("DODGE") + (this.heroClass.bonus.DODGE || 0);
	}

	public getDamageReduction(): number {
		return this.damageReduction + this.getEquippedItemBonus("DAMAGEREDUCTION") + (this.heroClass.bonus.DAMAGEREDUCTION || 0);
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

	public getEquippedItemBonus(key: string): number {
		return Array.from(this.itemSlots.values()).reduce((acc, item) => {
			if (item.bonus?.[key]) {
				return acc + item.bonus[key];
			}
			return acc;
		}, 0);
	}

	// Setters

	public modifyArmor(amount: number, floorToZero?: boolean) {
		this.block += amount;
		if (floorToZero) {
			this.block = Math.max(0, this.block);
		}
	}

	public setEffectArmor(amount: number) {
		this.effectBlock = amount;
	}

	public modifyEffectArmor(amount: number) {
		this.effectBlock += amount;
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
		const dodge = this.getDodge();
		const dodgeChance = dodge >= 100 ? 99 : dodge <= 0 ? 0 : dodge;
		return chance(dodgeChance);
	}
}
