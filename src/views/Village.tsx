
import { useEffect, useState } from "react";
import Village from "../game/Village";
import { VillageState } from "../models/VillageState";
import Hero from "../game/Hero";
import { Campaign } from "../models/Campaign";
import { v4 } from "uuid";

export default function VillageView(props: {campaign: Campaign}) {
    
    const [vstate, setVState] = useState<VillageState|null>(null);

    useEffect(() => {

        const village = new Village({});

        setVState({
            id: v4(),
            hero: props.campaign.hero,
            village: village,
        });
    }, [])

    return (
        <div className="village-container">
            VILLAGE
        </div>
    )
}