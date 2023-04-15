import { CardData } from "./Card";




export interface Item {
    id: string;
    name: string;
    description: string;
    cards: CardData[];
}


