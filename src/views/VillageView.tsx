import { useState } from "react";
import { chance } from "rndlib";
import Icon from "../components/Icon";
import MarketItemCard from "../components/MarketItemCard";
import Button from "../components/common/Button/Button";

import { VillageWorldLocation } from "../game/WorldLocation";
import { Campaign } from "../models/Campaign";

import { ItemOnSale } from "../models/VillageState";
import useClassData from "../utils/observable/useClassData";

import "./village-view.css";
import { v4 } from "uuid";
import useHero from "../components/useHero";

interface VillageTransaction {
	target: string;
	amount: number;
	type: string;
	id: string;
}

export default function VillageView(props: {
	villageLoc: VillageWorldLocation;
	campaign: Campaign;
	onLeaveVillage: () => void;
	updateCampaign: (c: Campaign) => void;
}) {
	const vwlData = useClassData<VillageWorldLocation>(props.villageLoc);

	const [transaction, setTransaction] = useState<VillageTransaction[]>([]);
	const [hero, setHero] = useHero(props.campaign.hero);

	const villageLoc = vwlData.instance;

	if (!villageLoc) return null;

	function addTransaction(txt: string, amount: number, type?: string) {
		const transaction = { target: txt, amount: amount, id: v4(), type: type || "" };
		setTransaction((prev) => {
			return [...prev, transaction];
		});
		setTimeout(() => {
			setTransaction((prev) => {
				return prev.filter((t) => t.id !== transaction.id);
			});
		}, 3000);
	}

	function buyItem(item: ItemOnSale) {
		if (villageLoc) {
			const village = villageLoc.village;
			const hero = props.campaign.hero;

			village.buyItem(item.id, hero);

			addTransaction(`You bought ${item.item.name} for `, item.price);
			villageLoc.village = village;
			setHero(hero);
			vwlData.set(villageLoc);
		}
	}

	function heal(amount: number, price: number) {
		console.log("HEAL", amount, price);
		if (villageLoc) {
			const village = villageLoc.village;
			const hero = props.campaign.hero;

			if (hero.gold >= price) {
				const dmg = hero.getMaxHealth() - hero.getHealth();
				hero.gold -= price;
				hero.healHero(amount);
				addTransaction(`You healed ${dmg} for `, 50);
				props.updateCampaign({ ...props.campaign, hero: hero });
			}

			villageLoc.village = village;
			vwlData.set(villageLoc);
		}
	}

	function gamble(bet: number, cha: number, win: number) {
		if (villageLoc && hero !== null) {
			const village = villageLoc.village;
			// const hero = props.campaign.hero;

			if (hero.gold >= bet) {
				hero.gold -= bet;
				if (chance(cha)) {
					addTransaction("You gambled and won ", bet * win, "positive");
					hero.gold += bet * win;
				} else {
					addTransaction("You gambled and lost ", bet, "negative");
				}
			}

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

	if (hero === null) throw new Error("Hero is null");

	const heroGold = hero.gold;

	return (
		<div className="village-container">
			<header>
				<h1>{villageLoc.name}</h1>

				<div className="transactions">
					{transaction.map((t, i) => {
						return (
							<div key={t.id} className={`transaction ${t.type}`}>
								{t.target}
								<span className="amount">{t.amount}</span>
								<Icon type="gold" />
							</div>
						);
					})}
				</div>
				<div className="mini-hero">
					<div className="gold"><Icon type="gold" /> <span>{hero.gold}</span></div>
					<div className="experience"><Icon type="experience" /> <span>{hero.getExperience()}</span></div>

					<div className="health"><Icon type="health" /> <span>{hero.getHealth()}</span></div>
					<div className="block"><Icon type="block" /> <span>{hero.getBlock()}</span></div>

					<div className="energy"><Icon type="energy" /> <span>{hero.getEnergy()}</span></div>

					
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

							<Button onClick={() => heal(3000, 50)} disabled={heroGold < 50}>
								Heal for 50 <Icon type="gold" />
							</Button>
						</div>
					</div>
				</div>

				<div className="store inn">
					<h2>Tavern</h2>

					<div className="store-content">
						<div className="service gambling">
							<h3>Bet small</h3>
							<p>
								Bet 50 <Icon type="gold" /> with 60% chance to <big>double</big> it
							</p>

							<Button onClick={() => gamble(50, 60, 2)} disabled={heroGold < 50}>
								Bet 50 <Icon type="gold" />
							</Button>
						</div>

						<div className="service gambling">
							<h3>Bet large</h3>
							<p>
								Bet 100 <Icon type="gold" /> with 33% chance to <big>triple</big> it
							</p>

							<Button onClick={() => gamble(100, 33, 3)} disabled={heroGold < 100}>
								Bet 100 <Icon type="gold" />
							</Button>
						</div>

						<div className="service quest">
							<h3>Listen to rumours</h3>
							<p>Find yourself a quest!</p>

							<Button onClick={() => {}} disabled={true}>
								Listen to rumours
							</Button>
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
