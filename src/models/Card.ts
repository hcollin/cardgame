import { EFFECTS } from "./Effects";
import { GameState } from "./GameState";

export enum DAMAGETYPE {
	SLASH = "SLASH",
	PIERCE = "PIERCE",
	BLUNT = "BLUNT",
	FIRE = "FIRE",
	ICE = "ICE",
	LIGHTNING = "LIGHTNING",
	POISON = "POISON",
	HOLY = "HOLY",
}

export enum TARGETS {
	ENEMY = "ENEMY",
	ADJACENT = "ADJACENT",
	ALLENEMIES = "ALLENEMIES",
	SELF = "SELF",
	WORLD = "WORLD"
}

export interface Card extends CardData {
	id: string;
	hand: "RIGHT" | "LEFT";
}

export interface Damage {
	amount: number;
	type: DAMAGETYPE;
	variation: number;
}

export enum CARDRARITY {
	COMMON = "COMMON",
	UNCOMMON = "UNCOMMON",
	RARE = "RARE",
	EPIC = "EPIC"
}
export interface CardData {
	name: string;
	rarity: CARDRARITY;
	item?: string;
	count?: number;

	rulesText?: string;
	description: string;

	damage: Damage[];

	apCost: number;
	reach: number;

	allowedTargets: TARGETS[];

    effectsOnHit: EFFECTS[];

	onHit: (gs: GameState) => GameState;
	onUse: (gs: GameState, card: Card) => GameState;
}
