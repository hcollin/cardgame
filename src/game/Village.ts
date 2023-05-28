import { v4 } from "uuid";
import { ITEMRARITY } from "../models/Items";
import { Item } from "../models/Items";
import { ItemOnSale, ServiceOnSale } from "../models/VillageState";
import Hero from "./Hero";
import { createItemId, getRarityLevel } from "./ItemTools";
import { allItems, minorMagicItems, minorPotions } from "../data/items/itemLists";
import { arnd, chance, rnd } from "rndlib";
import Observable from "../utils/observable/Observable";
import { Word, WordForm, dictionaryNameGenerator, getStringList, getStringListCombined, getWordList } from "../utils/dictionary";

export interface VillageParams {
	itemCount: number;
	potionCount: number;
	gold: number;
	maxRarity: ITEMRARITY;
	level: VILLAGELEVEL;
}

export enum VILLAGELEVEL {
	SMALL = 1,
	MEDIUM = 2,
	LARGE = 3,
	CITY = 4,
}

export enum SHOPTYPE {
	BLACKSMITH = "BlackSmiths Forge",
	GENERALSTORE = "General Store",
	MAGICITEM = "Magic Item",
	ALCHEMIST = "Alchemists",
	TAVERN = "Tavern",
	HEALER = "Healer",
}

/**
 * Village is a place where player can buy items and services and find quests.
 *
 * The likelihood that village has a certain service is based on the village level
 *  - General Store, 80% likelihood
 */
export class Village extends Observable {
	protected itemsOnSale: ItemOnSale[] = [];
	protected servicesOnSale: ServiceOnSale[] = [];

	protected gold: number = 0;

	protected options: VillageParams = {
		itemCount: 5,
		potionCount: 3,
		gold: 1000,
		maxRarity: ITEMRARITY.EPIC,
		level: VILLAGELEVEL.SMALL,
	};

	constructor(opts: Partial<VillageParams>) {
		super();
		this.options = { ...this.options, ...opts };

		// console.log(allItems.map((item) => [item.name, item.groups.join(", ")]));
		this.createItemOnSale("BlackSmiths Forge", 3);
		this.createItemOnSale("General Store", 3);
		this.createItemOnSale("Magic Item", 2);
		this.createItemOnSale("Potion", this.options.potionCount);
		// this.createPotionsOnSale();
	}

	public getItemSlots(groupFilter?: string): ItemOnSale[] {
		return this.itemsOnSale.filter((itemSlot) => {
			if (groupFilter) {
				const item = itemSlot.item;
				return item.groups.includes(groupFilter);
			}
			return true;
		});
	}

	public buyItem(itemSlotId: string, hero: Hero) {
		const itemSlot = this.itemsOnSale.find((itemSlot) => itemSlot.id === itemSlotId);

		if (!itemSlot) return;
		if (itemSlot.price > hero.gold) return;

		hero.gold -= itemSlot.price;
		itemSlot.state = "SOLD";

		hero.addItem(createItemId(itemSlot.item));
	}

	public sellItem(itemId: string, hero: Hero) {
		const item: Item | undefined = hero.getInventory().find((item) => item.id === itemId);

		if (!item) return;

		hero.gold += Math.round(item.price * 0.25);

		this.itemsOnSale.push({
			id: v4(),
			item: { ...item },
			price: Math.round(item.price * 0.9),
			state: "AVAILABLE",
		});
	}

	private createItemOnSale(filterGroupKey: string, count: number) {
		const items = allItems.filter((item) => item.groups.includes(filterGroupKey));

		// console.log(`Creating ${count} items with filterGroupKey: ${filterGroupKey} from ${items.length} items.`, items);
		if (items.length < count) throw new Error(`Not enough items found with filterGroupKey: ${filterGroupKey}`);

		const it: Item[] = [];

		let looper = 0;

		while (it.length < count) {
			const item = arnd(items);
			if (!it.includes(item)) {
				if (getRarityLevel(item.rarity) <= getRarityLevel(this.options.maxRarity)) {
					it.push(item);
				}
			}
			looper++;
			if (looper > 100) throw new Error(`Infinite loop detected in createItemOnSale() with filterGroupKey: ${filterGroupKey}`);
		}

		const itemSlots: ItemOnSale[] = it.map((item) => {
			const itemId = createItemId(item);
			return {
				id: itemId.id,
				item: itemId,
				price: itemId.price,
				state: "AVAILABLE",
			};
		});

		this.itemsOnSale = [...this.itemsOnSale, ...itemSlots];
	}

	private createGeneralStore() {}

	private getRandomItem(items: Item[], filters: { rarity?: ITEMRARITY; group?: string }): Item {
		const validItems = items.filter((item) => {
			if (filters.rarity && item.rarity !== filters.rarity) return false;
			if (filters.group && !item.groups.includes(filters.group)) return false;
			return true;
		});

		return arnd(validItems);
	}

	private createServicesOnSale(provider: "healer" | "tavern", count: number) {
		const services: ServiceOnSale[] = [];

		function randomHealingService(): ServiceOnSale {
			const amount = rnd(1, 10) * 5;

			const priceVariation = 1 - (rnd(1, 10) - 5) / 10;

			const serv: ServiceOnSale = {
				id: v4(),
				name: "Heal",
				price: amount * priceVariation,
				stock: 1,
				provider: "healer",
				type: "heal",
				options: {
					heal: amount,
				},
			};

			return serv;
		}

		function randomGamblingService(): ServiceOnSale {
			const bet = rnd(1, 100);

			const chance = rnd(4, 14) * 5;
			const payback = 1 + rnd(1, 30) / 10;

			const serv: ServiceOnSale = {
				id: v4(),
				name: "Gambling",
				price: bet,
				stock: 1,
				provider: "tavern",
				type: "gamble",
				options: {
					payback: payback,
					chance: chance,
				},
			};

			return serv;
		}

		while (services.length < count) {
			if (provider === "healer") {
				services.push(randomHealingService());
			}
			if (provider === "tavern") {
				services.push(randomGamblingService());
			}
		}

		this.servicesOnSale = [...this.servicesOnSale, ...services];
	}
}

class VillageHouse {
	protected level: number = 1;
	protected type: SHOPTYPE = SHOPTYPE.GENERALSTORE;

	public name: string = "Shop";

	constructor() {}

	protected randomName(rules: { format: string; filters: string[][] }[]) {
		return dictionaryNameGenerator(rules);
	}
}

class Shop extends VillageHouse {
	protected itemsOnSale: ItemOnSale[] = [];

	constructor(level: number) {
		super();
		this.level = level;
	}

	public getItemsOnSale() {
		return this.itemsOnSale;
	}

	protected createItemsForSale(filter: string[], additionalItems: Item[], levelAdjustment?: number) {
		const validItems = allItems.filter((item) => {
			return filter.some((filter) => item.groups.includes(filter));
		});

		const items: Item[] = [];
		const itemCount = rnd(Math.max(2, this.level), this.level + this.level);
		// console.log("ITEM COUNT:", itemCount, this.level, validItems.length);
		let looper = 0;
		let additionalCount = 0;
		while (items.length < itemCount) {
			const useAdditional = additionalItems.length > 2 && chance(25) && additionalCount < 2;
			const item = useAdditional ? arnd(additionalItems) : arnd(validItems);
			looper++;

			if (looper > 100) throw new Error("Infinite loop detected in createItemsForSale()");

			if (!item) {
				throw new Error("No item found");
			}

			if (items.includes(item)) {
				continue;
			}

			const rarityLevel = getRarityLevel(item.rarity);
			let maxRarity = Math.max(2, this.level) + (levelAdjustment || 0);

			if (rarityLevel > maxRarity) continue;

			if (useAdditional) additionalCount++;

			items.push(item);
		}

		this.itemsOnSale = items.map((item) => {
			const itemId = createItemId(item);
			return {
				id: v4(),
				item: itemId,
				price: itemId.price,
				state: "AVAILABLE",
			};
		});

		// console.log("ITEMS:", items);
	}
}

export class GeneralStore extends Shop {
	constructor(level: number) {
		super(level);
		this.type = SHOPTYPE.GENERALSTORE;
		this.name = this.randomName([
			{
				format: "%sg %s",
				filters: [["person", "human", "first name"], ["general store"]],
			},
			{
				format: "%i & %i",
				filters: [["tool"], ["adventure"]],
			},
			{
				format: "%s %sg %a %s",
				filters: [["fantasy", "first name"], ["surname", "fantasy"], ["place", "positive"], ["general store"]],
			},
		]);

		const filters = ["General Store"];
		let additionalItems: Item[] = [];
		if (this.level === 3) {
			additionalItems = [...minorPotions];
		}
		if (this.level === 4) {
			additionalItems = [...minorPotions, ...minorMagicItems];
		}

		this.createItemsForSale(filters, additionalItems);
	}
}

export class BlacksmithStore extends Shop {
	constructor(level: number) {
		super(level);
		this.type = SHOPTYPE.BLACKSMITH;

		const betterShop = chance(25);
		const forgeNames = ["Forge", "Armory", "Foundry", "Workshop", "Metalworks"]
		const nameRules = betterShop ? [
			
			{
				format: "%sg %a %c",
				filters: [["surname"], ["epic"], forgeNames],
			}
		] : [
			{
				format: "%a %i %c",
				filters: [["place", "age|size", "positive"], ["weapon|armor"], forgeNames],
			},
			{
				format: "%a %i %c",
				filters: [["item", "quality", "positive"], ["tool|armor"], forgeNames],
			},
			{
				format: "%i & %i %c",
				filters: [["weapon|armor"], ["armor|tool"], forgeNames],
			},
		];

		this.name = this.randomName(nameRules);

		const filters = ["BlackSmiths Forge"];
		let additionalItems: Item[] = [];

		this.createItemsForSale(filters, additionalItems, betterShop ? 1 : 0);
	}
}

export class AlchemistsStore extends Shop {

	constructor(level: number) {
		super(level);
		this.type = SHOPTYPE.ALCHEMIST;

		this.name = this.randomName([
			{
				format: "%sg %a %ip",
				filters: [["surname", "fantasy"], ["epic"], ["alchemy", "product"]],
			},
			{
				format: "%a %ip & %ip",
				filters: [["positive", "age|mood|quality", "item|place"], ["alchemy"], ["alchemy", "glass|tool"]],
			},

		]);


		const filters = ["Potion"];
		let additionalItems: Item[] = [];

		this.createItemsForSale(filters, additionalItems);
	}
}
