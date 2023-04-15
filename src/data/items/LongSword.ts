import { DAMAGETYPE } from "../../models/Card";
import { Item } from "../../models/Items";


export const LongSword: Item = {
    id: "long-sword",
    name: "Long Sword",
    description: "A long sword",
    cards: [
        {
            name: "Slash",
            description: "Slash your enemy",
            count: 10,
            damage: [
                {
                    amount: 6,
                    type: DAMAGETYPE.SLASH,
                    variation: 0
                }
            ],
            apCost: 1,
            reach: 1,
            onHit: (gs) => { return {...gs} },
            onMiss: (gs) => { return {...gs} },
            onUse: (gs) => { return {...gs} },
        }
            
    ]
}