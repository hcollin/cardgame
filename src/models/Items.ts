import Hero from "../game/Hero";
import { CardData } from "./Card";
import { ArenaState } from "./ArenaState";
import { ITEMSLOT } from "./HeroStats";

export enum ITEMRARITY {
	COMMON = "COMMON",
	UNCOMMON = "UNCOMMON",
	RARE = "RARE",
	EPIC = "EPIC",
}

export interface Item {
	id: string;
	name: string;
	groups: string[];
	rulesText?: string;
	description: string;
	itemSlots: ITEMSLOT[];
	cards: CardData[];
	rarity: ITEMRARITY;
	price: number;
	bonus?: { [key: string]: number };
	onEquip?: (hero: Hero) => void;
	onUnequip?: (hero: Hero) => void;
	onEndOfTurn?: (as: ArenaState) => ArenaState;
	onUse?: (as: ArenaState) => ArenaState;
	setItems?: string[];
	setBonus?: { [key: string]: number }
}
