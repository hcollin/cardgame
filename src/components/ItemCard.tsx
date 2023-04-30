import { getTotalCardCount } from "../game/ItemTools";
import { ITEMSLOT } from "../models/HeroStats";
import { Item } from "../models/Items";

import cardsIcon from "./icons/cards.png";

import "./item-card.css";

function ItemCard(props: { item: Item, onClick?: (item: Item) => void }) {
	const cns: string[] = ["item-card", props.item.rarity.toLowerCase()];
    if (props.onClick) {
        cns.push("clickable");
    }

    function click() {
        if (props.onClick) {
            props.onClick(props.item);
        }
    }

    return (
		<div className={cns.join(" ")} onClick={click}>
			<div className="item-name">{props.item.name}</div>

            {props.item.rulesText &&  <div className="item-rules">{props.item.rulesText}</div>}
			<div className="item-description">{props.item.description}</div>

            <div className="slots">
                <div className={`slot head ${props.item.itemSlots.includes(ITEMSLOT.HEAD) ? "valid" : ""}`}></div>
                <div className={`slot lhand ${props.item.itemSlots.includes(ITEMSLOT.LEFT_HAND) ? "valid" : ""}`}></div>
                <div className={`slot body ${props.item.itemSlots.includes(ITEMSLOT.BODY) ? "valid" : ""}`}></div>
                <div className={`slot rhand ${props.item.itemSlots.includes(ITEMSLOT.RIGHT_HAND) ? "valid" : ""}`}></div>
                <div className={`slot lfinger ${props.item.itemSlots.includes(ITEMSLOT.LEFT_FINGER) ? "valid" : ""}`}></div>
                <div className={`slot cape ${props.item.itemSlots.includes(ITEMSLOT.CAPE) ? "valid" : ""}`}></div>
                <div className={`slot rfinger ${props.item.itemSlots.includes(ITEMSLOT.RIGHT_FINGER) ? "valid" : ""}`}></div>
                <div className={`slot feet ${props.item.itemSlots.includes(ITEMSLOT.FEET) ? "valid" : ""}`}></div>
            </div>

			<footer>
				<div className="cards">
                    <img src={cardsIcon} alt="Cards" /> {getTotalCardCount(props.item)}
                </div>
			</footer>
		</div>
	);
}

export default ItemCard;
