import usePlayerEffects from "../utils/usePlayerEffect";

import "./player-effects-display.css";

export default function PlayerEffectsDisplay() {
	const [playerEffects, addPlayerEffect] = usePlayerEffects();

	return (
		<div className="player-effects-display">
			{playerEffects.map((eff, index) => {
				return (
					<div key={eff.id} className={`player-effect ${eff.type}`}>
						{eff.text}
					</div>
				);
			})}
		</div>
	);
}
