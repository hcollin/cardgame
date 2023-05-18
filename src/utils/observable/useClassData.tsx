import { useState, useEffect } from "react";
import Observable from "./Observable";

export interface IUseClassData<T extends Observable> {
	instance: T;
	rev: number;
}

export default function useClassData<T extends Observable>(instance: T) {
	const [data, setData] = useState<IUseClassData<T>>({
		instance: instance,
		rev: 0,
	});

	useEffect(() => {
		return instance.addObserver((data) => {
			setData((prev) => {
				return {
					instance: data,
					rev: prev.rev + 1,
				};
			});
		});
	}, []);

	return data;
}
