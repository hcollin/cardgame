import Icon from "../components/Icon";
import MarketItemCard from "../components/MarketItemCard";
import Button from "../components/common/Button/Button";
import { getActiveLocation, getActiveWorld } from "../game/CampaignTools";
import { VillageWorldLocation } from "../game/WorldLocation";
import { Campaign } from "../models/Campaign";
import { Item } from "../models/Items";
import { ItemOnSale } from "../models/VillageState";
import useClassData from "../utils/observable/useClassData";

import "./village-view.css";

export default function VillageView(props: { villageLoc: VillageWorldLocation; campaign: Campaign; onLeaveVillage: () => void }) {
	const vwlData = useClassData<VillageWorldLocation>(props.villageLoc);
	const villageLoc = vwlData.instance;

	if (!villageLoc) return null;

	function buyItem(item: ItemOnSale) {
		if (villageLoc) {
			const village = villageLoc.village;
			const hero = props.campaign.hero;

			village.buyItem(item.id, hero);
			villageLoc.village = village;
			vwlData.set(villageLoc);
		}
	}

	function leaveVillage() {
		if (villageLoc) {
			props.onLeaveVillage();
		}
	}

	const alchemistsInventory = villageLoc.village.getItemSlots("Potion");

    const smithsInventory = villageLoc.village.getItemSlots("BlackSmiths Forge");

    const generalStoresInventory = villageLoc.village.getItemSlots("General Store");

    const magicStoreInventory = villageLoc.village.getItemSlots("Magic Item");



	return (
		<div className="village-container">
			<header>
				<h1>{villageLoc.name}</h1>

				<div className="hero-gold">
					<Icon type="gold" />
					<span>{props.campaign.hero.gold}</span>
				</div>
			</header>

			<div className="content">
				<div className="store alchemist">
					<h2>Alchemist's Laboratory</h2>

					<div className="store-content">
						{alchemistsInventory.map((item, i) => {
							return <MarketItemCard key={item.id} item={item} hero={props.campaign.hero} onBuy={buyItem} />;
						})}
					</div>
				</div>

                <div className="store forge">
					<h2>Blacksmith's Forge</h2>

					<div className="store-content">
						{smithsInventory.map((item, i) => {
							return <MarketItemCard key={item.id} item={item} hero={props.campaign.hero} onBuy={buyItem} />;
						})}
					</div>
				</div>

                <div className="store general">
					<h2>General Store</h2>

					<div className="store-content">
						{generalStoresInventory.map((item, i) => {
							return <MarketItemCard key={item.id} item={item} hero={props.campaign.hero} onBuy={buyItem} />;
						})}
					</div>
				</div>

                <div className="store magic">
					<h2>Exotic Emporium</h2>

					<div className="store-content">
						{magicStoreInventory.map((item, i) => {
							return <MarketItemCard key={item.id} item={item} hero={props.campaign.hero} onBuy={buyItem} />;
						})}
					</div>
				</div>

                <div className="store healer">
					<h2>Healers Hut</h2>

                    <div className="store-content">
                        <div className="service healing">
                            <h3>Healing</h3>
                            <p>Heal to full health</p>

                            <Button onClick={() => {}}>Heal for 50 <Icon type="gold" /></Button>
                        </div>
                    </div>
				</div>

                <div className="store inn">
					<h2>Tavern</h2>

                    <div className="store-content">
                        <div className="service gambling">
                            <h3>Bet small</h3>
                            <p>Bet 50 <Icon type="gold" /> with 60% chance to <big>double</big> it</p>

                            <Button onClick={() => {}}>Bet 50 <Icon type="gold" /></Button>
                        </div>

                        <div className="service gambling">
                            <h3>Bet large</h3>
                            <p>Bet 100 <Icon type="gold" /> with 33% chance to <big>triple</big> it</p>

                            <Button onClick={() => {}}>Bet 50 <Icon type="gold" /></Button>
                        </div>

                        <div className="service quest">
                            <h3>Listen to rumours</h3>
                            <p>Find yourself a quest!</p>

                            <Button onClick={() => {}} disabled={true}>Listen to rumours</Button>
                        </div>


                    </div>
				</div>
			</div>

			<footer>
				<Button onClick={leaveVillage}>Leave Village</Button>
			</footer>
		</div>
	);
}
