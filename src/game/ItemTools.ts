import { v4 } from "uuid";
import { Card, Damage } from "../models/Card";

import { ITEMRARITY, Item } from "../models/Items";

export function createCardsFromItem(item: Item, hand: "RIGHT" | "LEFT"): Card[] {
	const cards: Card[] = [];

	item.cards.forEach((cardData) => {
		const ccount = cardData.count || 1;
		for (let i = 0; i < ccount; i++) {
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

export function getTotalCardCount(item: Item): number {
	return item.cards.reduce((acc, card) => {
		return acc + (card.count || 1);
	}, 0);
}

export function createItemId(item: Item): Item {
	return {...item, id: v4()};
}

export function getRarityLevel(r: ITEMRARITY): number {
	switch(r) {
		case ITEMRARITY.COMMON:
			return 1;
		case ITEMRARITY.UNCOMMON:
			return 2;
		case ITEMRARITY.RARE:
			return 3;
		case ITEMRARITY.EPIC:
			return 4;
	}
	return -1;
}