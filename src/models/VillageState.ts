import Hero from "../game/Hero";
import Village from "../game/Village";
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

    village: Village;
}