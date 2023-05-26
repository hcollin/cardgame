
import { ARENADIFFICULTY } from "../data/Difficulties";
import { defaultPotions, defaultWeapons, exoticWeapons, minorPotions } from "../data/items/itemLists";
import { rewardGenerator } from "../game/Arena";
import "./test-view.scss";


export default function TestView() {

    const items = [...defaultWeapons, ...defaultPotions, ...minorPotions, ...exoticWeapons];


    console.log("REWARDS", rewardGenerator(items, 3, ARENADIFFICULTY.MEDIUM).map(r => r.type));




    return (
        <div className="test-view">
            <div className="part one">
                <p>Part 1</p>
            </div>
            <div className="part two">
                <p>Part 2</p>
                <div className="inner-one">
                    Inner 1
                </div>
                <div className="inner-two">
                    Inner 2
                </div>
            </div>
        </div>
    )
}