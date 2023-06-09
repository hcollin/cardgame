import { roll } from "rndlib/dist/dice";
import { ClassWarrior, LEVELEXPERIENCEREQUIREMENTS } from "../data/Classes";
import { RaceHuman } from "../data/Races";
import { DAMAGETYPE, Damage } from "../models/Card";
import { CharacterClass, CharacterRace, ITEMSLOT, LevelMods } from "../models/HeroStats";
import { Item } from "../models/Items";
import { nameGenerator } from "./HeroTools";
import { chance } from "rndlib";
import { CampaignOptions } from "../models/Campaign";
import { effStore } from "../utils/usePlayerEffect";
import { ArenaState } from "../models/ArenaState";
import Observable from "../utils/observable/Observable";
import { EFFECTS } from "../models/Effects";
import { EnemyAction } from "./Enemy";
import { OffHandForTwoHandedItem } from "../data/items/EmptyHandItem";
import { BONUS } from "../models/Bonuses";

interface HeroEffect {
	effect: EFFECTS;
	duration: number;
	value: number;
}

export default class Hero extends Observable {
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

	// Effects
	protected effects: Map<EFFECTS, HeroEffect> = new Map<EFFECTS, HeroEffect>();

	public gold: number = 0;

	constructor(chrRace: CharacterRace, chrClass: CharacterClass, options?: CampaignOptions, name?: string) {
		super();
		this.name = name || nameGenerator();

		this.heroClass = chrClass;
		this.heroRace = chrRace;

		this.fullReset(
			options || {
				healAfterArena: 0,
				fullHealOnLevelUp: false,
				endlessLoop: false,
				mapDepth: 15,
				mapWidth: 7,
				worldThemes: ["FOREST", "MOUNTAIN"],
			},
		);
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
	public takeDamage(dmg: number, action?: EnemyAction) {
		if (this.dodgeRoll()) {
			effStore.addEffect("info", `Dodged ${dmg} damage!`);
			return;
		}

		let damage = dmg;
		if (damage < 0) damage = 0;

		if (action && action.damageType === DAMAGETYPE.POISON) {
			effStore.addEffect("dmg", `You are poisoned!`);
			this.sufferEffect(EFFECTS.POISON, dmg, 3);
		}

		if (action && action.effect && action.effect !== EFFECTS.POISON && action.effect !== EFFECTS.BURN) {
			effStore.addEffect("dmg", `You are ${action.effect}!`);
			this.sufferEffect(action.effect, 1, 1);
		}

		const isMagic = action && action.damageType === DAMAGETYPE.MAGIC;

		if (damage <= this.block && !isMagic) {
			this.block -= damage;
			effStore.addEffect("dmg", `Blocked ${damage} damage!`);
			return;
		}

		if (action && action.damageType === DAMAGETYPE.FIRE) {
			effStore.addEffect("dmg", `You are burning!`);
			this.sufferEffect(EFFECTS.BURN, dmg, dmg);
		}

		// Damage Reduction does not effect block
		damage = damage - this.getDamageReduction() - this.temporaryDamageReduction;
		if (damage < 0) damage = 0;

		effStore.addEffect("dmg", `Took ${damage - this.block}  damage!`);
		this.health -= damage - this.block;
		this.block = 0;
	}

	/**
	 *
	 */
	public sufferEffect(effect: EFFECTS, value?: number, duration?: number) {
		const eff = this.effects.get(effect);

		if (eff) {
			eff.duration += duration || 1;
		} else {
			this.effects.set(effect, {
				effect,
				duration: duration || 1,
				value: value || 1,
			});
		}
	}

	public removeEffect(effect: EFFECTS) {
		this.effects.delete(effect);
	}

	public clearEffects() {
		this.effects.clear();
	}

	public adjustEffect(effect: EFFECTS, value: number, duration?: number) {
		const eff = this.effects.get(effect);
		if (eff) {
			eff.value += value;
			eff.duration += duration || 0;
		}
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

	public consumeItem(itemId: string, as: ArenaState) {
		const item = this.inventory.find((i) => i.id === itemId);
		if (item) {
			if (item.onUse) {
				item.onUse(as);
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
		if (this.itemIsEquipped(item)) {
			return;
		}

		this.itemSlots.set(slot, item);

		if (item.groups.includes("Two-Handed")) {
			const offHandItem = { ...OffHandForTwoHandedItem };
			offHandItem.name = item.name;
			if (slot === ITEMSLOT.RIGHT_HAND) {
				this.equipItem(offHandItem, ITEMSLOT.LEFT_HAND);
			}

			if (slot === ITEMSLOT.LEFT_HAND) {
				this.equipItem(offHandItem, ITEMSLOT.RIGHT_HAND);
			}
		}

		if (item.onEquip) {
			// TODO: Fix this
			item.onEquip(this);
		}
	}

	public unequipItem(slot: ITEMSLOT, force?: boolean) {
		const item = this.itemSlots.get(slot);
		if (item) {
			if (item.groups.includes("Unequippable") && !force) {
				return;
			}
			if (item.groups.includes("Two-Handed")) {
				if (slot === ITEMSLOT.RIGHT_HAND) this.unequipItem(ITEMSLOT.LEFT_HAND, true);
				if (slot === ITEMSLOT.LEFT_HAND) this.unequipItem(ITEMSLOT.RIGHT_HAND, true);
			}
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
		this.effects.clear();

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
		this.effects.clear();

		this.turnReset();
	}

	/**
	 * Reset heros data at the beginning of the player turn
	 */
	public turnReset() {
		this.block = this.getEffectedBlock();
		this.energy = this.getEffectedEnergy();
		this.temporaryDodge = 0; // Reset temporary dodge

		if (this.effects.has(EFFECTS.SLOW)) {
			this.energy = Math.round(this.energy / 2);
		}

		if (this.effects.has(EFFECTS.STUN)) {
			this.energy = 1;
		}

		if (this.effects.has(EFFECTS.FROZEN)) {
			this.energy = 0;
		}

		const burning = this.effects.get(EFFECTS.BURN);
		if (burning) {
			this.takeDamage(burning.value);
		}
	}

	/**
	 * Solve some actions at the end of the player turn
	 */
	public endOfTurnReset(as: ArenaState) {
		const poison = this.effects.get(EFFECTS.POISON);
		if (poison) {
			effStore.addEffect("dmg", `${poison.value} poison damage`);
			// this.takeDamage(poison.value);
			this.health -= poison.value;
		}

		this.effects.forEach((eff) => {
			eff.duration--;
			if (eff.duration <= 0) {
				this.effects.delete(eff.effect);
			}
		});

		this.energy = 0;
	}

	// Status

	public isDead(): boolean {
		return this.health <= 0;
	}

	// LEVELING UP

	// Calculated Getters

	public getBaseBlock(): number {
		return this.heroRace.baseArmor + this.getLevelStat("BLOCK") + (this.heroClass.bonus.BLOCK || 0);
	}

	public getEffectedBlock(): number {
		return this.effectBlock + this.getBaseBlock() + this.getEquippedItemBonus("BLOCK");
	}

	public getBaseHealth(): number {
		return this.heroRace.baseHealth + this.getLevelStat("HEALTH") + (this.heroClass.bonus.HEALTH || 0);
	}

	public getMaxHealth(): number {
		return this.effectHealth + this.getBaseHealth();
	}

	public getBaseEnergy(): number {
		return this.heroRace.baseEnergy + this.getLevelStat("ENERGY") + (this.heroClass.bonus.ENERGY || 0);
	}

	public getEffectedEnergy(): number {
		return this.effectEnergy + this.getBaseEnergy();
	}

	public getHandSize(hand: "RIGHT" | "LEFT"): number {
		// console.log("Hand:", this.heroClass.levelStats[this.level]);
		if (hand === "RIGHT") {
			// console.log("Right hand size:", this.heroRace.baseHandSize + this.heroClass.levelStats[this.level].rHandSize);
			return this.heroRace.baseHandSize + this.getLevelStat("RIGHT_HAND_SIZE") + this.getEquippedItemBonus("RIGHT_HAND_SIZE");
		} else {
			return this.heroRace.baseHandSize + this.getLevelStat("LEFT_HAND_SIZE") + this.getEquippedItemBonus("LEFT_HAND_SIZE");
		}
	}

	// Default Getters
	public getName(): string {
		return this.name;
	}

	public getRaceName(): string {
		return this.heroRace.name;
	}

	public getClassName(): string {
		return this.heroClass.name;
	}

	public getHealth(): number {
		return this.health;
	}

	public getEffects(): HeroEffect[] {
		return Array.from(this.effects.values());
	}

	/**
	 *
	 * @returns
	 */
	public getBlock(): number {
		if (this.effects.has(EFFECTS.FROZEN)) return 0;
		return this.block;
	}

	/**
	 * Return the current energy of the hero
	 *
	 * @returns
	 */
	public getEnergy(): number {
		if (this.effects.has(EFFECTS.STUN)) return Math.min(this.energy, 1);
		if (this.effects.has(EFFECTS.FROZEN)) return 0;

		return this.energy;
	}

	/**
	 * Get the current dodge value of the hero
	 *
	 * If the hero is stunned or frozen, dodge is 0 (cannot dodge)
	 * If the hero is slowed, dodge is halved
	 *
	 * @returns number
	 */
	public getDodge(): number {
		const dval = this.dodge + this.temporaryDodge + this.getEquippedItemBonus("DODGE") + (this.heroClass.bonus.DODGE || 0);
		if (this.effects.has(EFFECTS.STUN) || this.effects.has(EFFECTS.FROZEN)) {
			return 0;
		}
		if (this.effects.has(EFFECTS.SLOW)) return dval / 2;
		return dval;
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

	public itemIsEquipped(item: Item | string): boolean {
		if (typeof item === "string") {
			return Array.from(this.itemSlots.values()).find((i) => i.id === item || i.name === item) !== undefined;
		}
		return Array.from(this.itemSlots.values()).includes(item);
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
			ITEMSLOT.CAPE,
		];
		// if (this.heroClass.levelStats[this.level].cape) {
		// 	slots.push(ITEMSLOT.CAPE);
		// }
		return slots;
	}

	public getEquippedItemBonus(key: string): number {
		return Array.from(this.itemSlots.values()).reduce((acc, item) => {
			
			let bonus = 0;

			if(this.isItemSetFullyEquipped(item)) {
				if(item.setBonus?.[key]) {
					bonus += item.setBonus[key];
				}
			}

			if (item.bonus?.[key]) {
				bonus += item.bonus[key];
				// return acc + item.bonus[key];
			}
			return acc + bonus;
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
		if (this.temporaryDodge + amount < 0) {
			this.temporaryDodge = 0;
			return;
		}
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
	 *
	 * @returns
	 */
	private dodgeRoll(): boolean {
		const dodge = this.getDodge();
		const dodgeChance = dodge >= 100 ? 99 : dodge <= 0 ? 0 : dodge;

		return chance(dodgeChance);
	}

	private equippingTwoHandedWeapon(): boolean {
		const rItem = this.itemSlots.get(ITEMSLOT.RIGHT_HAND);
		if (rItem && rItem.groups.includes("Two-Handed")) {
			return true;
		}

		const lItem = this.itemSlots.get(ITEMSLOT.LEFT_HAND);
		if (lItem && lItem.groups.includes("Two-Handed")) {
			return true;
		}
		return false;
	}

	private isItemSetFullyEquipped(item: Item): boolean {
		if (!item.setItems) return false;
		const equippedSetItems = Array.from(this.itemSlots.values()).filter((i) => item.setItems?.includes(i.name));
		return equippedSetItems.length === item.setItems.length;
	}

	

	private getLevelStat(str: BONUS): number {
		let value = 0;
		for (let i = 0; i <= this.level; i++) {
			const bonuses = this.heroClass.levelStats[i];
			value += bonuses[str] || 0;
		}
		return value;
	}
}
