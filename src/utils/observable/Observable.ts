import { v4 } from "uuid";

interface Observer {
	id: string;
	event: string;
	fn: (data: any, event?: string) => void;
}

export default class Observable {
	private _observers: Observer[] = [];

	constructor() {
		this._observers = [];
	}

	protected notifyObservers(data: any, event?: string) {
        
        const ekey = event || "ALL";

		this._observers.forEach((obs) => {
			if (obs.event === ekey || obs.event === "ALL") {
                obs.fn(data, ekey);
            };
		});
	}

    protected notify() {
        this.notifyObservers(this);
    }

	public addObserver(fn: (data: any) => void, event?: string): () => void {
		const obs: Observer = {
			id: v4(),
			event: event || "ALL",
			fn: fn,
		};
		this._observers.push(obs);

		return () => {
			this.removeObserver(obs.id);
		};
	}

	public removeObserver(id: string) {
		this._observers = this._observers.filter((obs) => obs.id !== id);
	}

	public clearObservers() {
		this._observers = [];
	}
}
