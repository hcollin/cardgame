import { expForNextLevel } from "../../game/HeroTools";
import { Campaign } from "../../models/Campaign";
import Icon from "../Icon";
import useHero from "../useHero";
import ValueCircle from "../common/valueCircle/ValueCircle";

import "./chr-sheet.scss";
import { HeroItems } from "../../views/HeroView";
import HeroItemSlot from "./HeroItemSlot";
import { ITEMSLOT } from "../../models/HeroStats";
import HeroInventory from "./HeroInventory";
import { Item } from "../../models/Items";
import { useEffect, useState } from "react";
import Button from "../common/Button/Button";

export default function CharacterSheet(props: { campaign: Campaign; full?: boolean }) {
	const [hero, setHero] = useHero(props.campaign.hero);

	const [selectedItem, setSelectedItem] = useState<Item | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<ITEMSLOT | null>(null);

	useEffect(() => {

		if (selectedItem !== null && selectedSlot !== null) {
			// Equip item
			if (hero) {
				hero.equipItem(selectedItem, selectedSlot);
				setSelectedSlot(null);
				setSelectedItem(null);
			}

		}



	}, [selectedItem, selectedSlot])

	function selectItem(item: Item) {
		setSelectedItem((prev: Item | null) => {
			if (prev === item) return null;
			return item;
		});
	}

	function selectSlot(slot: ITEMSLOT) {
		setSelectedSlot((prev: ITEMSLOT | null) => {
			if (prev === slot) return null;
			return slot;
		});
	}

	function unequipItem() {
		if (hero && selectedSlot) {
			hero.unequipItem(selectedSlot);
			setSelectedItem(null);
			setSelectedSlot(null);
		}
	}

	if (!hero) return null;

	const slotItem = selectedSlot ? hero.getEquippedItem(selectedSlot) : null;

	return (
		<div className={`character-sheet ${props.full ? "full" : ""}`}>
			<h1>{hero.getName()}</h1>
			<h2>
				Level {hero.getLevel()} {hero.getRaceName()} {hero.getClassName()}
			</h2>

			<div className="content">

				<div className="attributes">

					<h3>Health & Armor</h3>

					<div className="health">
						<div className="info">
							<Icon type="health" /> Health
						</div>
						<div className="value">
							{hero.getHealth()}

							<div className="maxValue">/ {hero.getMaxHealth()}</div>
						</div>
					</div>
					<div className="block">
						<div className="info">
							<Icon type="block" /> Block
						</div>
						<div className="value">
							{hero.getEffectedBlock()}

							<div className="maxValue">/ {hero.getBaseBlock()}</div>
						</div>
					</div>
					<div className="armor">
						<div className="info">
							<Icon type="damagereduction" /> Armor
						</div>
						<div className="value">
							{hero.getDamageReduction()}
						</div>
					</div>
					<div className="dodge">
						<div className="info">
							<Icon type="dodge" /> Dodge
						</div>
						<div className="value">
							{hero.getDodge()}
						</div>
					</div>


					<h3>Actions</h3>

					<div className="energy">
						<div className="info">
							<Icon type="energy" /> Energy
						</div>
						<div className="value">
							{hero.getEnergy()}
						</div>
					</div>

					<div className="right-hand">
						<div className="info">
							<Icon type="cards" /> Right Hand
						</div>
						<div className="value">
							{hero.getHandSize("RIGHT")}
						</div>
					</div>

					<div className="left-hand">
						<div className="info">
							<Icon type="cards" /> Left Hand
						</div>
						<div className="value">
							{hero.getHandSize("LEFT")}
						</div>
					</div>


					<h3>Rewards</h3>

					<div className="exp">
						<div className="info">
							<Icon type="experience" /> Experience
						</div>
						<div className="value">
							{hero.getExperience()}

							<div className="maxValue">/ {expForNextLevel(hero)}</div>
						</div>
					</div>

					<div className="gold">
						<div className="info">
							<Icon type="gold" /> Gold
						</div>
						<div className="value">
							{hero.gold}

						</div>
					</div>
				</div>

				<div className="equipped-container">
					<h3>Equipment</h3>

					<div className="content">
						<table>
							<tbody>
								<tr>
									<td></td>
									<td><HeroItemSlot slot={ITEMSLOT.HEAD} hero={hero} selected={selectedSlot === ITEMSLOT.HEAD} onSlotClick={selectSlot} /></td>
									<td></td>
								</tr>
								<tr>
									<td><HeroItemSlot slot={ITEMSLOT.LEFT_HAND} hero={hero} selected={selectedSlot === ITEMSLOT.LEFT_HAND} onSlotClick={selectSlot} /></td>
									<td><HeroItemSlot slot={ITEMSLOT.BODY} hero={hero} selected={selectedSlot === ITEMSLOT.BODY} onSlotClick={selectSlot} /></td>
									<td><HeroItemSlot slot={ITEMSLOT.RIGHT_HAND} hero={hero} selected={selectedSlot === ITEMSLOT.RIGHT_HAND} onSlotClick={selectSlot} /></td>
								</tr>
								<tr>
									<td><HeroItemSlot slot={ITEMSLOT.LEFT_FINGER} hero={hero} selected={selectedSlot === ITEMSLOT.LEFT_FINGER} onSlotClick={selectSlot} /></td>
									<td><HeroItemSlot slot={ITEMSLOT.CAPE} hero={hero} selected={selectedSlot === ITEMSLOT.CAPE} onSlotClick={selectSlot} /></td>
									<td><HeroItemSlot slot={ITEMSLOT.RIGHT_FINGER} hero={hero} selected={selectedSlot === ITEMSLOT.RIGHT_FINGER} onSlotClick={selectSlot} /></td>
								</tr>
								<tr>
									<td></td>
									<td><HeroItemSlot slot={ITEMSLOT.FEET} hero={hero} selected={selectedSlot === ITEMSLOT.FEET} onSlotClick={selectSlot} /></td>
									<td></td>
								</tr>
							</tbody>

						</table>



						{slotItem && <Button onClick={unequipItem} className="negative">Unequip {slotItem.name}</Button>}
					</div>
				</div>

				<div className="inventory-container">
					<h3>Inventory</h3>
					<HeroInventory hero={hero} selectedItem={selectedItem} onItemSelect={selectItem} slotFilter={selectedSlot} />
				</div>

			</div>
		</div>
	);
}