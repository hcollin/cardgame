
import { Item } from "../../models/Items";


export const Shield: Item = {
    id: "shield",
    name: "Shield",
    description: "A simple shield",
    cards: [
        {
            name: "Block",
            description: "Simple block",
            count: 10,
            damage: [],
            apCost: 1,
            reach: 1,
            onHit: (gs) => { return {...gs} },
            onMiss: (gs) => { return {...gs} },
            onUse: (gs) => { return {...gs} },
        }
            
    ]
}