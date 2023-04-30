import { useState } from "react";
import { ITEMSLOT } from "../models/HeroStats";
import { Item } from "../models/Items";

import "./hero-view.css";
import { equipItem, getLevelMods, unequipItem } from "../game/HeroTools";
import HealthValueContainer from "../components/HealthValueContainer";
import ArmorValueContainer from "../components/ArmorValueContainer";
import EnergyValueContainer from "../components/EnergyValueContainer";
import ExperienceValueContainer from "../components/ExperienceValueContainer";
import Hero from "../game/Hero";

/**
 * Functional React Component called HeroView that takes HeroStats as a prop and renders the hero's stats
 */
function HeroView(props: { hero: Hero; updateHero: (hero: Hero) => void }) {
	return (
		<div className="hero-view">
			<h1>
				{props.hero.getName()}{" "}
				<small>
					level <span>{props.hero.getLevel()}</span>
				</small>
			</h1>

			<div className="container">
				<HealthValueContainer hero={props.hero} />

				<ArmorValueContainer hero={props.hero} />

				<EnergyValueContainer hero={props.hero} />

				<ExperienceValueContainer hero={props.hero} />
			</div>

			<div className="container">
				<HeroItems hero={props.hero} updateHero={props.updateHero} />
			</div>

		</div>
	);
}

export default HeroView;

function HeroItems(props: { hero: Hero; updateHero: (hero: Hero) => void }) {
	const [targetSlot, setTargetSlot] = useState<ITEMSLOT | null>(null);

	function handleSlotClick(slot: ITEMSLOT) {
		setTargetSlot((prev) => {
			if (prev === slot) return null;
			return slot;
		});
	}

	function itemClick(item: Item) {
		if (targetSlot !== null && item.itemSlots.includes(targetSlot)) {
			props.hero.equipItem(item, targetSlot);
			props.updateHero(props.hero);
			// hero.activeItems.set(targetSlot, item);
			// props.updateHero(hero);
			setTargetSlot(null);
		}
	}

	function removeItemFromSlot() {
		if (targetSlot !== null) {
			props.hero.unequipItem(targetSlot);
			props.updateHero(props.hero);
			// const hero = { ...props.hero };
			// hero.activeItems.delete(targetSlot);
			// props.updateHero(hero);
		}
	}
	
	const equippableSlots = props.hero.getEquippableSlots();
	return (
		<div className="equipped-items">
			<div className="slots">
				<table>
					<tbody>
						<tr>
							<td></td>
							<td>
								<HeroItemSlot hero={props.hero} slot={ITEMSLOT.HEAD} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.HEAD} />
							</td>
							<td></td>
						</tr>
						<tr>
							<td>
								<HeroItemSlot
									hero={props.hero}
									slot={ITEMSLOT.RIGHT_HAND}
									onSlotClick={handleSlotClick}
									selected={targetSlot === ITEMSLOT.RIGHT_HAND}
								/>
							</td>
							<td>
								<HeroItemSlot hero={props.hero} slot={ITEMSLOT.BODY} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.BODY} />
							</td>
							<td>
								<HeroItemSlot
									hero={props.hero}
									slot={ITEMSLOT.LEFT_HAND}
									onSlotClick={handleSlotClick}
									selected={targetSlot === ITEMSLOT.LEFT_HAND}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<HeroItemSlot
									hero={props.hero}
									slot={ITEMSLOT.RIGHT_FINGER}
									onSlotClick={handleSlotClick}
									selected={targetSlot === ITEMSLOT.RIGHT_FINGER}
								/>
							</td>
							<td>
								<HeroItemSlot
									hero={props.hero}
									slot={ITEMSLOT.CAPE}
									onSlotClick={handleSlotClick}
									selected={targetSlot === ITEMSLOT.CAPE}
									disabled={!equippableSlots.includes(ITEMSLOT.CAPE)}
								/>
							</td>
							<td>
								<HeroItemSlot
									hero={props.hero}
									slot={ITEMSLOT.LEFT_FINGER}
									onSlotClick={handleSlotClick}
									selected={targetSlot === ITEMSLOT.LEFT_FINGER}
								/>
							</td>
						</tr>
						<tr>
							<td></td>
							<td>
								<HeroItemSlot hero={props.hero} slot={ITEMSLOT.FEET} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.FEET} />
							</td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="inventory">
				{props.hero.getInventory().map((item, index) => {
					const cns: string[] = ["inventory-item"];
					if (targetSlot !== null) {
						if (item.itemSlots.includes(targetSlot)) {
							cns.push("valid");
						} else {
							cns.push("invalid");
						}
					}
					return (
						<div className={cns.join(" ")} key={`inventory-${item.id}`} onClick={() => itemClick(item)}>
							{item.name}
						</div>
					);
				})}
				{targetSlot !== null && props.hero.getEquippedItem(targetSlot) && (
					<div className="inventory-item remove" onClick={removeItemFromSlot}>
						Remove
					</div>
				)}
			</div>
		</div>
	);
}

function HeroItemSlot(props: { hero: Hero; slot: ITEMSLOT; selected: boolean; onSlotClick: (slot: ITEMSLOT) => void; disabled?: boolean }) {
	const item = props.hero.getEquippedItem(props.slot);

	function handleClick() {
		if (props.disabled === true) return;
		props.onSlotClick(props.slot);
	}

	const cns: string[] = ["item-slot", props.slot.toLowerCase()];

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
