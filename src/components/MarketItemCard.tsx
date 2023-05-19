import { ItemOnSale } from "../models/VillageState";

import "./market-item-card.css";

import iconGold from "./icons/gold.png";
import ItemCard from "./ItemCard";
import Button from "./common/Button/Button";
import { Item } from "../models/Items";
import Hero from "../game/Hero";

export default function MarketItemCard(props: {item: ItemOnSale, hero: Hero, onBuy?: (item: ItemOnSale) => void}) {

    function buyItem() {
        if(props.onBuy) {
            if(props.item.state === "SOLD") return;
            if(props.hero.gold < props.item.price) return;

            props.onBuy(props.item);
        }
    }

    const isDisabled = props.hero.gold < props.item.price || props.item.state === "SOLD";


    const cns: string[] = ["market-item-card"];
    if(props.item.state === "SOLD") cns.push("sold");

    return <div className={cns.join(" ")}>

        <ItemCard item={props.item.item} />

        <Button onClick={buyItem} disabled={isDisabled}>Buy for <span>{props.item.price}</span> <img src={iconGold} alt="Gold" /></Button>

{/* 
        <header>
            <h3>{props.item.item.name}</h3>

            <div className="price">
                <img src={iconGold} alt="Gold icon" />
                <span>{props.item.price}</span>
            </div>
        </header>

        <div className="image">

        </div>

        <div className="rules">
            <p>{props.item.item.rulesText}</p>
        </div>

        <div className="description">
        <p>{props.item.item.description}</p>
        </div>

        <footer>

        </footer>
         */}

    </div>;
}