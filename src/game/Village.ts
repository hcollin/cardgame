import { v4 } from "uuid";
import { ITEMRARITY } from "../models/Items";
import { Item } from "../models/Items";
import { ItemOnSale } from "../models/VillageState";
import Hero from "./Hero";
import { createItemId, getRarityLevel } from "./ItemTools";
import { allItems } from "../data/items/itemLists";
import { arnd } from "rndlib";


export interface VillageParams {
    itemCount: number;
    potionCount: number;
    gold: number;
    maxRarity: ITEMRARITY;
}

export default class Village {

    public name: string = "";

    protected itemsOnSale: ItemOnSale[] = [];

    protected gold: number = 0;

    protected options: VillageParams = {
        itemCount: 5,
        potionCount: 3,
        gold: 1000,
        maxRarity: ITEMRARITY.EPIC,
    }

    constructor(opts: Partial<VillageParams>) {
        this.options = { ...this.options, ...opts };

        this.createItemOnSale();
        this.createPotionsOnSale();

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

    private createItemOnSale() {
        const items = allItems.filter((item) => !item.groups.includes("Potion"));


        const it: Item[] = [];

        while (it.length < this.options.itemCount) {
            const item = arnd(items);
            if (!it.includes(item)) {
                if (getRarityLevel(item.rarity) <= getRarityLevel(this.options.maxRarity)) {
                    it.push(item);
                }
            }
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