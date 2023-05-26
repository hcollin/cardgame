import { Item } from "./Items";

export type REWARDTYPE = "ITEM" | "HEAL" | "EXPERIENCE" | "GOLD" | "POTION";

export interface Reward {
	id: string;
	type: REWARDTYPE;
}

export interface ItemReward extends Reward {
	item: Item;
}

export interface HealReward extends Reward {
	heal: number;
}

export interface ExperienceReward extends Reward {
	experience: number;
}

export interface GoldReward extends Reward {
	gold: number;
}


