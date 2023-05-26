import Hero from "../../game/Hero";
import { ITEMSLOT } from "../../models/HeroStats";

import "./hero-item-slot.scss";


export default function HeroItemSlot(props: {hero: Hero, slot: ITEMSLOT, selected: boolean; onSlotClick: (slot: ITEMSLOT) => void; disabled?: boolean }) {

    const item = props.hero.getEquippedItem(props.slot);

    function handleClick() {
		if (props.disabled === true) return;
		props.onSlotClick(props.slot);
	}

	const cns: string[] = ["hero-item-slot", props.slot.toLowerCase()];

	if (item) {
		cns.push("equipped");
	}
	if (props.selected) {
		cns.push("selected");
	}
	if (props.disabled === true) {
		cns.push("disabled");
	}

	if (!item)
		return (
			<div className={cns.join(" ")} onClick={handleClick}>
				&nbsp;
			</div>
		);

	return (
		<div className={cns.join(" ")} onClick={handleClick}>
			{/* <div className="slot">{props.slot}</div> */}
			<div className="name">{item.name}</div>
		</div>
	);
}