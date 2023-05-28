import { ArenaState } from "../../models/ArenaState";
import { ITEMRARITY, Item } from "../../models/Items";

export const FlaskOfWater: Item = {
	id: "flask-of-water",
	name: "Flask of Water",
	groups: ["Potion", "General Store", "Consumable", "Stuff", "Water"],
	itemSlots: [],
	rulesText: "Heal 1",
	description: "A flask of refreshing water.",
	cards: [],
	price: 2,
	rarity: ITEMRARITY.COMMON,
	bonus: {},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
	onUse: (as: ArenaState) => {
		as.hero.healHero(1);
		return { ...as };
	},
};

export const Torch: Item = {
    id: "torch",
    name: "Torch",
	groups: ["General Store", "Light Source", "Consumable", "Stuff"],
	itemSlots: [],
	description: "A torch that can be lit to provide light.",
	cards: [],
	price: 2,
	rarity: ITEMRARITY.COMMON,
	bonus: {},
	onEquip: (hero) => {},
	onUnequip: (hero) => {},
	onUse: (as: ArenaState) => {
		
		return { ...as };
	},
};