import { LOCATIONSTATUS, LocationData, WORLDLOCATIONTYPE } from "../models/LocationModels";

import "./location-view.css";

function LocationView(props: { loc: LocationData; onArenaSelect: (i: number) => void; onSelectLocation: (lid: string) => void }) {



	return (
		<div className="location-view">
			<h1>Location</h1>
			<h2>{props.loc.status} / {props.loc.type}</h2>

			{props.loc.status === LOCATIONSTATUS.ACTIVE && props.loc.type !== WORLDLOCATIONTYPE.START && (
				<>
					<h3>Select Arena</h3>
					<div className="arenas">
						{props.loc.arena.map((a, i) => {
							return (
								<div className="ar" key={i}>
									<h3>{a.name}</h3>
									<button onClick={() => props.onArenaSelect(i)}>Start</button>
								</div>
							);
						})}
					</div>
				</>
			)}

			{(props.loc.status === LOCATIONSTATUS.COMPLETED || props.loc.type === WORLDLOCATIONTYPE.START) && (
				<>
					<h3>Select next location</h3>
					<div className="locations">
						{props.loc.nextLocations.map((l, i) => {
							return (
								<div className="next-loc" key={l}>
									<button onClick={() => props.onSelectLocation(l)}>{l}</button>
								</div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}

export default LocationView;
