import { useState } from "react";
import Hero from "../../game/Hero";
import { getItemIcon } from "../../game/ItemTools";
import Icon from "../Icon";


import "./hero-inventory.scss";
import Button from "../common/Button/Button";
import { Item } from "../../models/Items";
import { ITEMSLOT } from "../../models/HeroStats";

const filterOptions: [string, string][] = [["weapon", "Weapons"], ["armor", "Armor"], ["boots", "Boots"], ["helmet", "Helmets"], ["shield", "Shield"], ["potion", "Potions"], ["ring", "Rings"]];

export default function HeroInventory(props: { hero: Hero, selectedItem: Item | null, onItemSelect: (item: Item) => void, slotFilter: ITEMSLOT | null }) {

    const [filters, setFilter] = useState<string[]>([]);

    function changeFilter(f: string) {

        setFilter(
            (prev: string[]) => {
                if (prev.includes(f)) {
                    return prev.filter((x) => x !== f);
                }
                return [...prev, f];
            }
        );
    }

    const allItems = props.hero.getInventory();
    const selectableFilters = filterOptions.filter((f) => {

        const key = f[0];
        const itemsWithFilteredGroup = allItems.filter((item) => item.groups.some((g) => g.toLowerCase() === key));

        return itemsWithFilteredGroup.length > 0;
    });

    const items = allItems.filter((item) => {
        if (props.slotFilter !== null) {
            return item.itemSlots.includes(props.slotFilter) && props.hero.itemIsEquipped(item) === false;
        }
        if (filters.length === 0) return true;
        if (item.groups.some((g) => filters.includes(g.toLowerCase()))) return true;
        return false;
    }
    );

    return (
        <div className="hero-inventory">
            <div className="filters">
                {selectableFilters.map((f) => {
                    const [key, name] = f;
                    const cn = filters.includes(key) ? "active" : "";
                    return (
                        <Button key={key} onClick={() => changeFilter(key)} className={cn} disabled={props.slotFilter !== null}>{name}</Button>
                    );
                })
                }
            </div>

            <div className="items">

                {items.map((item) => {
                    const icns: string[] = ["hero-inventory-item"];
                    if (props.selectedItem && props.selectedItem.id === item.id) {
                        icns.push("selected");
                    }
                    if(props.hero.itemIsEquipped(item)){ 
                        icns.push("equipped");
                    }
                    return (
                        <div key={item.id} className={icns.join(" ")} onClick={() => { props.onItemSelect(item) }}>
                            <div className="icon"><Icon type={getItemIcon(item)} /></div>
                            <div className="name">{item.name}</div>
                        </div>
                    );
                })}

                {items.length === 0 && <div className="no-items">No items found.</div>}
            </div>
        </div>

    );
}