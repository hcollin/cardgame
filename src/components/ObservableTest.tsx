import WorldLocation from "../game/WorldLocation";

import { LOCATIONSTATUS } from "../models/LocationModels";
import useClassData from "../utils/observable/useClassData";

const loc = new WorldLocation();

export default function ObservableTest() {
	const wloc = useClassData<WorldLocation>(loc).instance;

	function changeStatus() {
		switch (wloc.status) {
			case LOCATIONSTATUS.LOCKED:
				wloc.setSelectable();
				break;
			case LOCATIONSTATUS.SELECTABLE:
				wloc.setCompleted();
				break;
			case LOCATIONSTATUS.COMPLETED:
				wloc.setLocked();
				break;
		}
	}

	return (
		<span>
			S: {wloc.status} <button onClick={changeStatus}>S</button>
		</span>
	);
}
