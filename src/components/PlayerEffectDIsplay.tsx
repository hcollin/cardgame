import usePlayerEffects from "../utils/usePlayerEffect";

import "./player-effects-display.scss";

export default function PlayerEffectsDisplay() {
	const playerEffects = usePlayerEffects()[0];

	return (
		<div className="player-effects-display">
			{playerEffects.map((eff) => {
				return (
					<div key={eff.id} className={`player-effect ${eff.type}`}>
						<p>{eff.text}</p>
					</div>
				);
			})}
		</div>
	);
}
