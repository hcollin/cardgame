import { ARENADIFFICULTY } from "../data/Difficulties";
import { defaultPotions, defaultWeapons, exoticWeapons, minorPotions } from "../data/items/itemLists";
import { rewardGenerator } from "../game/Arena";
import { AlchemistsStore, BlacksmithStore, GeneralStore } from "../game/Village";
import { dictionaryNameGenerator, getWordListFilterSplitter } from "../utils/dictionary";
import "./test-view.scss";

export default function TestView() {
	const items = [...defaultWeapons, ...defaultPotions, ...minorPotions, ...exoticWeapons];

	//[["positive", "age|mood|quality", "item|place"], ["alchemy"], ["alchemy", "glass|tools"]]
	console.log("FILTERS:", getWordListFilterSplitter(["alchemy", "glass|tool"]));

	// const names = [
	// 	generateName([{ format: "%i & %i", filters: ["alcohol"] }]),
	// 	generateName("%ip & %ip", []),
	// 	generateName("%s & %s", []),
	// 	generateName("%vc %s & %a %s", [["leisure"], ["animal", "object"], ["person", "mood", "positive"], ["family"]]),
	// 	generateName("%a %s", [["negative", "place"], ["death"]]),
	// 	generateName([
	// 		{
	// 			format: "%sg %s",
	// 			filters: [["family"], ["building", "general store"]],
	// 		},
	// 		{
	// 			format: "%sg & Sons %i %s",
	// 			filters: [["human"], ["weapon"], ["building", "general store"]],
	// 		},
	// 	])
	// ];

	// return (
	// 	<div className="test-view">
	// 		<h1>Test View</h1>

	// 		{names.map((name) => (
	// 			<div key={name}>{name}</div>
	// 		))}
	// 	</div>
	// );

	const store = new AlchemistsStore(4);

	return (
		<div className="test-view">
			<h1>{store.name}</h1>

			<div className="items">
				{store.getItemsOnSale().map((item) => (
					<div key={item.id} className="item">
						<h3>{item.item.name}</h3>
						<span>{item.item.rarity}</span>

						<div className="price">{item.price}</div>
					</div>
				))}
			</div>
		</div>
	);
}
