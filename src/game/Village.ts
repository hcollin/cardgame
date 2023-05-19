import { v4 } from "uuid";
import { ITEMRARITY } from "../models/Items";
import { Item } from "../models/Items";
import { ItemOnSale } from "../models/VillageState";
import Hero from "./Hero";
import { createItemId, getRarityLevel } from "./ItemTools";
import { allItems } from "../data/items/itemLists";
import { arnd } from "rndlib";
import Observable from "../utils/observable/Observable";


export interface VillageParams {
    itemCount: number;
    potionCount: number;
    gold: number;
    maxRarity: ITEMRARITY;
}

export class Village extends Observable {

    protected itemsOnSale: ItemOnSale[] = [];


    protected gold: number = 0;

    protected options: VillageParams = {
        itemCount: 5,
        potionCount: 3,
        gold: 1000,
        maxRarity: ITEMRARITY.EPIC,
    }

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
            state: "AVAILABLE"
        });

    }

    private createItemOnSale(filterGroupKey: string, count: number) {
        const items = allItems.filter((item) => item.groups.includes(filterGroupKey));

        console.log(`Creating ${count} items with filterGroupKey: ${filterGroupKey} from ${items.length} items.`, items)
        if(items.length < count) throw new Error(`Not enough items found with filterGroupKey: ${filterGroupKey}`);
        

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
            if(looper > 100) 
                throw new Error(`Infinite loop detected in createItemOnSale() with filterGroupKey: ${filterGroupKey}`);
        }

        const itemSlots: ItemOnSale[] = it.map((item) => {
            const itemId = createItemId(item);
            return {
                id: itemId.id,
                item: itemId,
                price: itemId.price,
                state: "AVAILABLE"
            }
        });

        this.itemsOnSale = [...this.itemsOnSale, ...itemSlots];

    }

    private createPotionsOnSale() {
        const allPotions = allItems.filter((item) => item.groups.includes("Potion"));

        const potions: Item[] = [];

        while (potions.length < this.options.potionCount) {
            const pot = arnd(allPotions);
            if (!potions.includes(pot)) {
                if (getRarityLevel(pot.rarity) <= getRarityLevel(this.options.maxRarity)) {
                    potions.push(pot);
                }
            }
        }

        const potSlots: ItemOnSale[] = potions.map((pot) => {
            const potion = createItemId(pot);
            return {
                id: potion.id,
                item: potion,
                price: potion.price,
                state: "AVAILABLE"
            }
        });
        this.itemsOnSale = [...this.itemsOnSale, ...potSlots];

    }

}