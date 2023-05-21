import "./value-circle.scss";

interface ValueCircleProps {
	value: number;
	maxValue: number;

	size: number;
	sizeY?: number;
	thickness?: number;
	flip?: boolean;

	gaugeColor?: string;
	gaugeBgColor?: string;

	showNeedle?: boolean;
	needleColor?: string;

	showRangeLines?: boolean;

	startPoint?: number;
	endPoint?: number;

	className?: string;

	helpCircle?: boolean;
}

export default function ValueCircle(props: ValueCircleProps) {
	const healthPercentage = props.value / props.maxValue;

	// Options
	const sizeX = props.size || 400;
	const sizeY = props.sizeY || sizeX;
	const thickess = props.thickness || sizeX / 10;
	const showNeedle = props.showNeedle || false;
	const showRangeLines = props.showRangeLines || false;

	const needleColor = props.needleColor || "#FFF";
	const gaugeColor = props.gaugeColor || "#FFF";
	const gaugeBgColor = props.gaugeBgColor || "#0008";

	const startPercent = props.startPoint || 0.4;
	const endPercent = props.endPoint || 1.1;

	// Value in percentage
	const perc = Math.min(1, props.value / props.maxValue);

	// Calculations base on options
	const cx = sizeX / 2,
		cy = sizeY / 2,
		radiusX = sizeX / 2 - thickess,
		radiusY = sizeY / 2 - thickess;

	const gaugePoint =
		sizeY !== sizeX
			? getPointOnGaugeEllipse(cx, cy, radiusX, radiusY, perc, startPercent, endPercent)
			: getPointOnGauge(cx, cy, radiusX, perc, startPercent, endPercent);
	const gaugeBgPoint =
		sizeY !== sizeX
			? getPointOnGaugeEllipse(cx, cy, radiusX, radiusY, 1, startPercent, endPercent)
			: getPointOnGauge(cx, cy, radiusX, 1, startPercent, endPercent);

	// console.log(getPointOnArc(cx, cy, radius, perc));
	const sPoint = sizeY !== sizeX ? getPointOnEllipse(cx, cy, radiusX, radiusY, startPercent) : getPointOnArc(cx, cy, radiusX, startPercent);
	const ePoint = sizeY !== sizeX ? getPointOnEllipse(cx, cy, radiusX, radiusY, endPercent) :getPointOnArc(cx, cy, radiusX, endPercent);

	const flipBg = 0; //endPercent - startPercent > 0.5;

	// const transform = `translate(${cx * -1}, 0) scale(0.5, 1) translate(${cx}, 0)`;
	const transform = props.flip ? `translate(${cx * 2}, 0) scale(-1, 1)` : "";
	
	// console.log(gaugePoint);
	props.helpCircle && console.log(cx, cy, sizeX, sizeY);
	return (
		<div className={`value-circle ${props.className || ""}`}>
			<svg width={sizeX} height={sizeY}>
				<path
					d={`M${sPoint[0]} ${sPoint[1]} A ${radiusX} ${radiusY} 0 ${gaugeBgPoint[2]} 1 ${gaugeBgPoint[0]} ${gaugeBgPoint[1]}`}
					transform={transform}
					fill="transparent"
					stroke={gaugeBgColor}
					strokeWidth={thickess}
					strokeLinecap="round"
				/>

				{showRangeLines && <path d={`M${cx} ${cy} L ${sPoint[0]} ${sPoint[1]}`} fill="transparent" stroke="red" strokeWidth={thickess / 4} transform={transform}/>}

				{showRangeLines && <path d={`M${cx} ${cy} L ${ePoint[0]} ${ePoint[1]}`} fill="transparent" stroke="green" strokeWidth={thickess / 4} transform={transform}/>}

				<path
					d={`M${sPoint[0]} ${sPoint[1]} A ${radiusX} ${radiusY} 0 ${gaugePoint[2]} 1 ${gaugePoint[0]} ${gaugePoint[1]}`}
					transform={transform}
					fill="transparent"
					stroke={gaugeColor}
					strokeWidth={thickess * 0.75}
					strokeLinecap="round"
				/>

				{props.helpCircle && <ellipse cx={cx} cy={cy} rx={radiusX} ry={radiusY} fill="#FFF2" stroke="green" strokeWidth={10} />}

				{showNeedle && (
					<path
						d={`M${cx} ${cy} L ${gaugePoint[0]} ${gaugePoint[1]}`}
						transform={transform}
						fill="transparent"
						stroke={needleColor}
						strokeWidth={thickess / 2}
						strokeLinecap="round"
					/>
				)}
			</svg>
		</div>
	);
}

function getPointOnGauge(cx: number, cy: number, radius: number, percentage: number, startP: number, endP: number) {
	const realP = (endP - startP) * percentage + startP;
	var angleInRadians = (360 * realP * Math.PI) / 180;

	var x = cx + radius * Math.cos(angleInRadians);
	var y = cy + radius * Math.sin(angleInRadians);

	if (endP - startP <= 0.5) {
		return [x, y, 0];
	}

	let flipArc = startP + percentage - endP > 0 ? 1 : 0;

	return [x, y, flipArc];
}

function getPointOnArc(cx: number, cy: number, radius: number, percentage: number) {
	// var angleInDegrees = 360 * percentage;

	var angleInRadians = (360 * percentage * Math.PI) / 180;

	var x = cx + radius * Math.cos(angleInRadians);
	var y = cy + radius * Math.sin(angleInRadians);

	return [x, y];
}

function getPointOnGaugeEllipse(cx: number, cy: number, rx: number, ry: number, percentage: number, startP: number, endP: number) {
	const realP = (endP - startP) * percentage + startP;
	var angleInRadians = (360 * realP * Math.PI) / 180;

	var x = cx + rx * Math.cos(angleInRadians);
	var y = cy + ry * Math.sin(angleInRadians);

	if (endP - startP <= 0.5) {
		return [x, y, 0];
	}

	let flipArc = startP + percentage - endP > 0 ? 1 : 0;

	return [x, y, flipArc];
}

function getPointOnEllipse(cx: number, cy: number, rx: number, ry: number, percentage: number) {
	// var angleInDegrees = 360 * percentage;

	var angleInRadians = (360 * percentage * Math.PI) / 180;

	var x = cx + rx * Math.cos(angleInRadians);
	var y = cy + ry * Math.sin(angleInRadians);

	return [x, y];
}
