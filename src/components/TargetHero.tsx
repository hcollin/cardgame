import { useDrop } from "react-dnd";
import "./target-hero.css";
import { Card, TARGETS } from "../models/Card";

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
			TARGET HERO!
		</div>
	);
}

export default TargetHero;
