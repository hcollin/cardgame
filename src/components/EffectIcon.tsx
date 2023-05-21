import { EFFECTS } from "../models/Effects";

import imgStunned from "./icons/stunned.png";
import imgPoison from "./icons/poison.png";
import imgFrozen from "./icons/frozen.png";

import "./effectIcon.css";
import { rnd } from "rndlib";

export const EffectIcon = (props: { effect: EFFECTS; amount: number }) => {
	let img = null;

	switch (props.effect) {
		case EFFECTS.STUN:
			img = imgStunned;
			break;
		case EFFECTS.POISON:
			img = imgPoison;
			break;
		case EFFECTS.FROZEN:
			img = imgFrozen;
			break;
	}

	if (img == null) return null;

    const cn = `effect-icon ${props.effect}`.toLowerCase();
	return (
		<div className={cn}>
			<img src={img} alt={props.effect} />
            <span>{props.amount}</span>
		</div>
	);
};

export const EffectIconImage = (props: { effect: EFFECTS }) => {
	let img = null;

	switch (props.effect) {
		case EFFECTS.STUN:
			img = imgStunned;
			break;
		case EFFECTS.POISON:
			img = imgPoison;
			break;
		case EFFECTS.FROZEN:
			img = imgFrozen;
			break;
	}

	if (img == null) return null;

    return <img src={img} alt={props.effect} />

}

export const EffectRow = (props: { effects: Map<EFFECTS, number> }) => {
	const effects = Array.from(props.effects.entries());

    if(effects.length === 0) return null;

	return (
		<div className="effect-row">
			{effects.map((effect: [EFFECTS, number], index) => {
				const eff: EFFECTS = effect[0];
				
				return (
				<EffectIcon effect={effect[0]} amount={effect[1]} key={`eff-${eff}-${index}-${rnd(1000,9999)}`}/>
			)})}
		</div>
	);
};
