import Hero from "../game/Hero";
import { Item } from "./Items";


export interface ItemOnSale {
    id: string;
    item: Item;
    price: number;
    state: "SOLD" | "AVAILABLE";
}

export interface ServiceOnSale {
    id: string;
    name: string;
    price: number;    
    stock: number;
    provider: "healer"|"tavern";
    type: "heal"|"gamble"|"quest";
    options?: Partial<Record<string, number|string>>;
}


export interface VillageState {
    id: string;
    
    hero: Hero;

    itemsOnSale: ItemOnSale[];
    potionsOnSale: ItemOnSale[];

}