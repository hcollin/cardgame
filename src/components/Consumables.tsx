

import { GameState } from "../models/GameState";

import PotionIcon from "./PotionIcon";

import imgInventoryOpen from "./icons/inventoryOpen.png";
import imgInventoryClose from "./icons/inventoryClose.png";

import { useEffect, useState } from "react";
import { Item } from "../models/Items";
import useSingleAndDoubleClick, { useSingleAndDoubleClickParams } from "../utils/useSingleAndDoubleClick";
import { createPortal } from "react-dom";

import "./arena-consumables.css";
import Button from "./common/Button/Button";


export default function ArenaConsumables(props: { gs: GameState, update: (gs: GameState) => void }) {

    const [isOpen, setOpenState] = useState<boolean>(false);

    const [zoomedItem, setZoomedItem] = useState<Item | null>(null);

    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        const allConsumableItems = props.gs.hero.getInventory().filter(item => item.groups.includes("Consumable"));    
        if(index > allConsumableItems.length -3) setIndex(allConsumableItems.length -3);
    },[props.gs]);


    function consumeItem(item: Item | null) {
        if (item === null) return;
        const ngs = { ...props.gs };
        ngs.hero.consumeItem(item.id, ngs);
        setOpenState(false);
        props.update({ ...ngs });
    }

    function viewItem(item: Item | null) {
        setZoomedItem(item);
    }

    const clickHandler = useSingleAndDoubleClickParams<Item>(viewItem, consumeItem, 200);

    const consumableItemsInInventory = props.gs.hero.getInventory().filter(item => item.groups.includes("Consumable"));

    const items = isOpen ? consumableItemsInInventory.slice(index, index + 3) : [];
        
    const showDown = index > 0;
    const showUp = index + 3 < consumableItemsInInventory.length;

    const itemCount = consumableItemsInInventory.length;
    return (
        <div className={`arena-consumables ${isOpen ? "open" : "closed"}`}>


            {isOpen && <div className="scroll"><Button onClick={() => setIndex(index - 1)} disabled={!showDown}>Up</Button></div>}

            {isOpen && items.map(item => {

                return (
                    <div className="arena-consumable" key={item.id} onClick={() => clickHandler(item)}>
                        <PotionIcon item={item} size="large" />
                    </div>
                );
            })}


            
            {isOpen && <div className="scroll"><Button onClick={() => setIndex(index + 1)} disabled={!showUp}>Down</Button></div>}


            {isOpen && <button onClick={() => setOpenState(false)}><img src={imgInventoryClose} alt="Close inventory" /><span className={itemCount > 9 ? "small": ""}>{itemCount}</span></button>}
            {!isOpen && <button onClick={() => setOpenState(true)}><img src={imgInventoryOpen} alt="Open inventory" /><span className={itemCount > 9 ? "small": ""}>{itemCount }</span></button>}

            {zoomedItem && createPortal(
                <div className="arena-consumable-zoomed" onClick={() => setZoomedItem(null)}>

                    <div className="item-info">
                        <h1>{zoomedItem.name}</h1>
                        <div className="image">
                            {zoomedItem.groups.includes("Potion") && <PotionIcon item={zoomedItem} size="xx-large" />}
                        </div>

                        {zoomedItem.rulesText && <p className="rules">{zoomedItem.rulesText}</p>}
                        {zoomedItem.description && <p className="description">{zoomedItem.description}</p>}

                        <footer>
                            <button onClick={() => consumeItem(zoomedItem)}>Consume</button>
                        </footer>

                    </div>


                </div>,
                document.getElementById("zoomedContent") as HTMLElement)}
        </div>
    )
}