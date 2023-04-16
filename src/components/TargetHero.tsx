import { useDrop } from "react-dnd";
import "./target-hero.css";

function TargetHero(props: {onDrop?: () => void}) {
	const [{ isOver, canDrop }, drop] = useDrop({
		accept: "Card",
		drop: (item: any) => {
            if(props.onDrop) {
                props.onDrop();
            }
        },
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
		}),
	});


    const cn = `target-hero ${isOver ? "isOverTrue" : ""}`;

	return (
		<div className={cn} ref={drop}>
			TARGET ME!
		</div>
	);
}

export default TargetHero;
