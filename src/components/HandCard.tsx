import { getDamageRange } from "../game/ItemTools";
import { Card } from "../models/Card";


interface HandCardProps {
    card: Card;
    onClick?: (card: Card) => void;
    selected?: boolean;
}


export default function HandCard(props: HandCardProps) {

  function handleClick() {
    if(props.onClick) {
      props.onClick(props.card)
    }
  }
  return (
    <div onClick={handleClick} className={props.selected ? "card selected": "card"} >
      <h1>{props.card.name}</h1>
      <h2>{props.card.item} / {props.card.apCost} aps</h2>
      <p>{props.card.description}</p>
      <div className="dmg">{
        props.card.damage.map((dmg, index) => {
          const range = getDamageRange(dmg);
          return <div>{dmg.type} {range[0]} - {range[1]}</div>
        })
      }</div>
    </div>
  );
}