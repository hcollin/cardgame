import Hero from "../game/Hero";
import { Item } from "./Items";


export interface ItemOnSale {
    id: string;
    item: Item;
    price: number;
    state: "SOLD" | "AVAILABLE";
}


export interface VillageState {
    id: string;
    
    hero: Hero;

    itemsOnSale: ItemOnSale[];
    potionsOnSale: ItemOnSale[];

}