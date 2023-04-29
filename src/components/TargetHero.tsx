import { useDrop } from "react-dnd";
import { Card, TARGETS } from "../models/Card";

import targetHeroImg from "./icons/target-hero.png";

import "./target-hero.css";

function TargetHero(props: { onDrop?: () => void }) {
	const [{ isOver, canDrop }, drop] = useDrop({
		accept: "Card",
		drop: (item: any) => {
			if (props.onDrop) {
				props.onDrop();
			}
		},
		canDrop: (item: Card) => {
			return item.allowedTargets.includes(TARGETS.SELF);
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
		}),
	});

	const cn = `target-hero ${isOver ? (canDrop ? "isOverTrue" : "isOverFalse") : ""}`;

    if(!canDrop) return null;

	return (
		<div className={cn} ref={drop}>
			<div className="img">
				<img src={targetHeroImg} alt="target hero" />
			</div>
			<div className="text">TARGET HERO!</div>
		</div>
	);
}

export default TargetHero;
