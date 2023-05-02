export class Cloneable {
	public static clone<T>(source: T): T {
		return Array.isArray(source)
			? source.map((item) => this.clone(item))
			: source instanceof Date
			? new Date(source.getTime())
            : source instanceof Map
            ? new Map(source)
			: source && typeof source === "object"
			? Object.getOwnPropertyNames(source).reduce((o, prop) => {
					Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
					o[prop] = this.clone((source as { [key: string]: any })[prop]);
					return o;
			  }, Object.create(Object.getPrototypeOf(source)))
			: (source as T);
	}
}
