import { v4 } from "uuid";
import { Card, Damage } from "../models/Card";

import { Item } from "../models/Items";



export function createCardsFromItem(item: Item, hand: "RIGHT"|"LEFT"): Card[] {
    const cards: Card[] = [];

    item.cards.forEach((cardData) => {
        const ccount = cardData.count || 1;
        for(let i = 0; i < ccount; i++) {
            const c = { ...cardData, id: v4(), item: item.name, hand: hand };
            cards.push(c);
        }
    });

    return cards;
    
}

export function getDamageRange(d: Damage): [number, number] {
    const min = d.amount - d.variation;
    const max = d.amount + d.variation;
    return [min, max];
}
