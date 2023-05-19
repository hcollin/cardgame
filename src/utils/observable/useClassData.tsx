import { useState, useEffect } from "react";
import Observable from "./Observable";

export interface IUseClassData<T extends Observable> {
	instance: T|null;
	rev: number;
	set: (ins: T|null) => void;
}

export default function useClassData<T extends Observable>(instance: T|null) {
	const [data, setData] = useState<IUseClassData<T>>({
		instance: instance,
		rev: 0,
		set: setInstance,
	});

	useEffect(() => {
		if (!instance) return;
		return instance.addObserver((data) => {
			setData((prev) => {

				return {
					instance: data,
					rev: prev.rev + 1,
					set: setInstance,
				};
			});
		});
	}, []);

	function setInstance(ins: T|null) {
		setData((prev) => {
			return {
				instance: ins,
				rev: ins === null ? 0 : prev.rev + 1,
				set: setInstance,
			};
		});
	}

	return data;
}
