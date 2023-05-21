import { expForNextLevel } from "../../game/HeroTools";
import { Campaign } from "../../models/Campaign";
import Icon from "../Icon";
import useHero from "../useHero";
import ValueCircle from "../common/valueCircle/ValueCircle";

import "./chr-sheet.scss";

export default function CharacterSheet(props: { campaign: Campaign; full?: boolean }) {
	const [hero, setHero] = useHero(props.campaign.hero);

	if (!hero) return null;
    console.log(hero.getHealth(), hero.getMaxHealth());
	return (
		<div className={`character-sheet ${props.full ? "full" : ""}`}>
			<h1>{hero.getName()}</h1>
			<h2>
				Level {hero.getLevel()} {hero.getRaceName()} {hero.getClassName()}
			</h2>

            <div className="health-meters">
                <ValueCircle className="dodge" value={33} maxValue={100} size={245} gaugeColor="#0F0A" thickness={10}/>
                {/* <ValueCircle className="dodge" value={hero.getDodge()} maxValue={100} size={245} gaugeColor="#0F0A" thickness={10}/> */}
                {/* <ValueCircle className="block" value={hero.getArmor()} maxValue={100} size={215} gaugeColor="#48FA" thickness={10}/> */}
                {/* <ValueCircle className="health" value={hero.getHealth()} maxValue={hero.getMaxHealth()} size={195} gaugeColor="#F00A" thickness={20}/> */}
                
                
                <ValueCircle
                    flip
					className="armor"
					value={17}
					maxValue={20}
					size={160}
					sizeY={80}
					gaugeColor="#FF0A"
					gaugeBgColor="#000E"
					thickness={20}
					startPoint={0.1}
					endPoint={0.4}
				/>
                
            </div>

            

            

			{/* <div className="attributes">

                <h3>Health & Armor</h3>
				
                <div className="health">
					<div className="info">
						<Icon type="health" /> Health
					</div>
					<div className="value">
						{hero.getHealth()}

						<div className="maxValue">/ {hero.getMaxHealth()}</div>
					</div>
				</div>
                <div className="block">
					<div className="info">
						<Icon type="block" /> Block
					</div>
					<div className="value">
						{hero.getArmor()}

						<div className="maxValue">/ {hero.getBaseArmor()}</div>
					</div>
				</div>
                <div className="armor">
					<div className="info">
						<Icon type="damagereduction" /> Armor
					</div>
					<div className="value">
						{hero.getDamageReduction()}		
					</div>
				</div>
                <div className="dodge">
					<div className="info">
						<Icon type="dodge" /> Dodge
					</div>
					<div className="value">
						{hero.getDodge()}		
					</div>
				</div>

                <h3>Rewards</h3>

                <div className="exp">
					<div className="info">
						<Icon type="experience" /> Experience
					</div>
					<div className="value">
						{hero.getExperience()}

						<div className="maxValue">/ {expForNextLevel(hero)}</div>
					</div>
				</div>
			</div> */}
		</div>
	);
}
