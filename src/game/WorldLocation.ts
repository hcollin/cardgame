import { v4 } from "uuid";
import { LOCATIONFLAG, LOCATIONSTATUS, LocationId, WORLDLOCATIONTYPE } from "../models/LocationModels";
import { Arena } from "./Arena";
import { EmptyArena } from "../data/EmptyArena";
import { ArenaTheme } from "../data/arenaThemes";
import { ARENATHEMES } from "../data/arenaThemes";
import { ARENADIFFICULTY } from "../data/Difficulties";
import Observable from "../utils/observable/Observable";


export default class WorldLocation extends Observable {
	public readonly id: LocationId = "";
	public name: string = "";
	public status: LOCATIONSTATUS = LOCATIONSTATUS.LOCKED;
	public type: WORLDLOCATIONTYPE = WORLDLOCATIONTYPE.ARENA;
	public nextLocationIds: LocationId[] = [];
	public flags: LOCATIONFLAG[] = [];
	public worldPos: { x: number; y: number; dx: number; dy: number } = { x: 0, y: 0, dx: 0, dy: 0 };

    public icon: string = "";

	constructor() {
        super();
		this.id = v4();
	}

    public setCompleted() {
        this.status = LOCATIONSTATUS.COMPLETED;
        // this.notifyObservers(this);
        this.notify();
    }

    public setSelectable() {
        this.status = LOCATIONSTATUS.SELECTABLE;
        // this.notifyObservers(this);
        this.notify();
    }   

    public setLocked() {
        this.status = LOCATIONSTATUS.LOCKED;
        // this.notifyObservers(this);
        this.notify();
    }



}

export class ArenaWorldLocation extends WorldLocation {
    public type: WORLDLOCATIONTYPE = WORLDLOCATIONTYPE.ARENA;
    
    public arena: Arena = new EmptyArena();
    public theme: ArenaTheme = ARENATHEMES["FOREST"];
    public difficulty: ARENADIFFICULTY = ARENADIFFICULTY.VERYEASY;

    constructor(themeId: string, difficulty: ARENADIFFICULTY) {
        super();
        this.icon = "camp";
        this.difficulty = difficulty;
        this.setTheme(themeId);
        this.createArena();

        
    }

    /**
     * Set a new theme for this WorldArenaLocation
     * @param themeId 
     */
    public setTheme(themeId: string) {
        const t = ARENATHEMES[themeId];
        if(t) {
            this.theme = t;
        }            
    }

    /**
     * Create a new Arena into this location
     */
    public createArena() {
        const arena = Arena.generate(this.difficulty, this.theme.id);
        if(arena) {
            this.arena = arena;
        }
    }
}


export class VillageWorldLocation extends WorldLocation {
    public type: WORLDLOCATIONTYPE = WORLDLOCATIONTYPE.VILLAGE;
    
    constructor() {
        super();
        this.icon = "tent";
    }   
}