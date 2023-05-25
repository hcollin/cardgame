import { useEffect, useState } from "react";
import { v4 } from "uuid";

interface PlayerEffect {
	id: string;
	type: string;
	text: string;
	count: number;
	duration: number;
}

interface Listener {
	fn: (effs: PlayerEffect[]) => void;
	id: string;
}

class EffectsStore {
	private effs: PlayerEffect[] = [];
    private effArchive: PlayerEffect[] = [];

	private listeners: Listener[] = [];

	constructor() {
		this.effs = [];
	}

	public addEffect(type: string, text: string) {
		const id = v4();
		const duration = 3000;
		this.effs.push({ type, text, count: 1, duration, id });
        this.effArchive.push({ type, text, count: 1, duration, id });
		this.notify();
        
		setTimeout(() => {
			this.effs = this.effs.filter((e) => e.id !== id);
			this.notify();
		}, duration);
	}

	public listen(fn: (effs: PlayerEffect[]) => void): () => void {
		const id = v4();
		this.listeners.push({ fn, id });
		return () => {
			this.listeners = this.listeners.filter((l) => l.id !== id);
		};
	}

	public getAll() {
		return this.effs;
	}

    public clear() {
        this.effs = [];
        this.effArchive = [];
        this.notify();
    }

	private notify() {
		this.listeners.forEach((l) => l.fn(this.effs));
	}
}

export const effStore = new EffectsStore();



export default function usePlayerEffects(): [PlayerEffect[], (text: string, type?: string) => void] {
	const [effects, setEffects] = useState<PlayerEffect[]>([]);

	useEffect(() => {
		setEffects(effStore.getAll());
		const unsub = effStore.listen((effs) => {
            setEffects([...effs]);
		});

		return unsub;
	}, []);

	function addEffect(text: string, type?: string) {
        const realType = type || "INFO";
        effStore.addEffect(realType, text);
    }

	return [effects, addEffect];
}
