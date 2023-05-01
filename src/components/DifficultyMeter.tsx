import { ARENADIFFICULTY } from "../game/Arena";

import "./difficulty-meter.css";

const diffLevels: ARENADIFFICULTY[] = [
	ARENADIFFICULTY.VERYEASY,
	ARENADIFFICULTY.EASY,
	ARENADIFFICULTY.MEDIUM,
	ARENADIFFICULTY.HARD,
	ARENADIFFICULTY.VERYHARD,
	ARENADIFFICULTY.EXTREME,
	ARENADIFFICULTY.INSANE,
];

function DifficultyMeter(props: { difficulty: ARENADIFFICULTY }) {
	const diffActive = diffLevels.indexOf(props.difficulty);

    

	return (
		<div className="difficulty-meter">
            
			{diffLevels.map((diff, i) => {
				const cns: string[] = ["slot"];
                cns.push(`level-${i}`);
				if (i < diffActive) cns.push("on");
				if (i === diffActive) cns.push("active");
				return <div className={cns.join(" ")} key={diff}></div>;
			})}
		</div>
	);
}

export default DifficultyMeter;
