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

export function getItemIcon(item: Item): string {
	
	if(item.groups.includes("Weapon")) {
		
		if(item.groups.includes("Axe")) {
			if(item.groups.includes("Two-Handed")) { 
				return "bigaxe";
			}
			return "axe"
		}
		if(item.groups.includes("Sword")) {
			if(item.groups.includes("Two-Handed")) { 
				return "bigsword";
			}
			return "sword"
		}
		if(item.groups.includes("Club") || item.groups.includes("Mace")) {
			return "mace"
		}
		if(item.groups.includes("Spear")) {
			return "spear"
		}
		if(item.groups.includes("Dagger")) {
			return "dagger"
		}
		return "weapon";
	}

	if(item.groups.includes("Armor")) {
		return "armor";
	}

	if(item.groups.includes("Shield")) {
		return "shield";
	}	

	if(item.groups.includes("Helmet")) {
		return "helmet";
	}	

	if(item.groups.includes("Boots")) {
		return "boots";
	}

	if(item.groups.includes("Potion")) {
		return "potion";
	}

	if(item.groups.includes("Ring")) {
		return "ring";
	}

	if(item.groups.includes("Cape") || item.groups.includes("Cloak")) {
		return "cape";
	}

	if(item.groups.includes("Wand")) {
		return "wand";
	}

	return "";
}