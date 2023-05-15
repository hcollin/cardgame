import { useState, useEffect } from "react";

export default function useSingleAndDoubleClick(actionSimpleClick: () => void, actionDoubleClick: () => void, delay = 250) {
	const [click, setClick] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			// simple click
			if (click === 1) actionSimpleClick();
			setClick(0);
		}, delay);

		// the duration between this click and the previous one
		// is less than the value of delay = double-click
		if (click === 2) actionDoubleClick();

		return () => clearTimeout(timer);
	}, [click]);

	return () => setClick((prev) => prev + 1);
}

export function useSingleAndDoubleClickParams<T>(actionSimpleClick: (o: T|null) => void, actionDoubleClick: (o: T|null) => void, delay = 250) {
	const [click, setClick] = useState(0);

	const [data, setData] = useState<T|null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			// simple click

			
			if (click === 1) actionSimpleClick(data);
			setClick(0);
			setData(null);
		}, delay);

		// the duration between this click and the previous one
		// is less than the value of delay = double-click
		if (click === 2) {
			actionDoubleClick(data);
			setData(null);
		}

		return () => clearTimeout(timer);
	}, [click]);

	function clickHandler(o: T) {
		setData(o);
		setClick((prev) => prev + 1);
	}

	return clickHandler;
}
