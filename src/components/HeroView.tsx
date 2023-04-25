import { useState } from "react";
import { HeroStats, ITEMSLOT } from "../models/HeroStats";
import { Item } from "../models/Items";

import "./hero-view.css";
import { equipItem, unequipItem } from "../game/HeroTools";

/**
 * Functional React Component called HeroView that takes HeroStats as a prop and renders the hero's stats
 */
function HeroView(props: { hero: HeroStats, updateHero: (hero: HeroStats) => void }) {
    return (
        <div className="hero-view">
            <h1>{props.hero.name}</h1>

            <h4>Health</h4>
            <div className="life">

                {props.hero.health} / {props.hero.maxHealth}
            </div>

            <h4>Armor</h4>
            <div className="armor">
                {props.hero.defaultArmor}
            </div>

            <h4>Equipped</h4>
            <HeroItems hero={props.hero} updateHero={props.updateHero} />


            {/* <h4>Inventory</h4>
            <div className="inventory">

                {props.hero.inventory.map((item, index) => (
                    <div className="item" key={`inventory-${index}`}>{item.name}</div>
                ))}
            </div> */}

        </div>
    );
}

export default HeroView;


function HeroItems(props: { hero: HeroStats, updateHero: (hero: HeroStats) => void }) {

    const [targetSlot, setTargetSlot] = useState<ITEMSLOT | null>(null);

    function handleSlotClick(slot: ITEMSLOT) {
        setTargetSlot((prev) => {
            if (prev === slot) return null;
            return slot;
        });
    }

    function itemClick(item: Item) {
        if (targetSlot !== null && item.itemSlots.includes(targetSlot)) {
            props.updateHero(equipItem({...props.hero}, item, targetSlot));
            // hero.activeItems.set(targetSlot, item);
            // props.updateHero(hero);
            setTargetSlot(null);
        }
    }

    function removeItemFromSlot() {


        if (targetSlot !== null) {
            props.updateHero(unequipItem({...props.hero}, targetSlot));
            // const hero = { ...props.hero };
            // hero.activeItems.delete(targetSlot);
            // props.updateHero(hero);
        }


    }

    return (
        <div className="equipped-items">
            <div className="slots">
                <table>
                    <tbody>
                        <tr>
                            <td></td>
                            <td><HeroItemSlot hero={props.hero} slot={ITEMSLOT.HEAD} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.HEAD} /></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><HeroItemSlot hero={props.hero} slot={ITEMSLOT.RIGHT_HAND} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.RIGHT_HAND} /></td>
                            <td><HeroItemSlot hero={props.hero} slot={ITEMSLOT.BODY} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.BODY} /></td>
                            <td><HeroItemSlot hero={props.hero} slot={ITEMSLOT.LEFT_HAND} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.LEFT_HAND} /></td>
                        </tr>
                        <tr>
                            <td><HeroItemSlot hero={props.hero} slot={ITEMSLOT.RIGHT_FINGER} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.RIGHT_FINGER} /></td>
                            <td><HeroItemSlot hero={props.hero} slot={ITEMSLOT.CAPE} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.CAPE} /></td>
                            <td><HeroItemSlot hero={props.hero} slot={ITEMSLOT.LEFT_FINGER} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.LEFT_FINGER} /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><HeroItemSlot hero={props.hero} slot={ITEMSLOT.FEET} onSlotClick={handleSlotClick} selected={targetSlot === ITEMSLOT.FEET} /></td>
                            <td></td>
                        </tr>

                    </tbody>

                </table>
            </div>
            <div className="inventory">
                {props.hero.inventory.map((item, index) => {
                    const cns: string[] = ["inventory-item"];
                    if (targetSlot !== null) {
                        if (item.itemSlots.includes(targetSlot)) {
                            cns.push("valid");
                        } else {
                            cns.push("invalid");
                        }
                    }
                    return (
                        <div className={cns.join(" ")} key={`inventory-${item.id}`} onClick={() => itemClick(item)}>{item.name}</div>
                    );
                })}
                {targetSlot !== null && props.hero.activeItems.has(targetSlot) && <div className="inventory-item remove" onClick={removeItemFromSlot}>Remove</div>}
            </div>
        </div>
    )
}


function HeroItemSlot(props: { hero: HeroStats, slot: ITEMSLOT, selected: boolean, onSlotClick: (slot: ITEMSLOT) => void }) {
    const item = props.hero.activeItems.get(props.slot);

    function handleClick() {
        props.onSlotClick(props.slot);
    }

    const cns: string[] = ["item-slot", props.slot.toLowerCase()];



    if (item) { cns.push("equipped") };
    if (props.selected) { cns.push("selected") };

    if (!item) return (<div className={cns.join(" ")} onClick={handleClick}>
        &nbsp;
    </div>);

    return (
        <div className={cns.join(" ")} onClick={handleClick}>
            {/* <div className="slot">{props.slot}</div> */}
            <div className="name">{item.name}</div>

        </div>
    )
}
