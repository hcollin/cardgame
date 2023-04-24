import { createCampaign, selectActiveLocationFromCampaign } from "../game/CampaignTools";

import { Campaign } from "../models/Campaign";
import { GameState } from "../models/GameState";

function MainMenu(props: { campaign: Campaign; update: (cm: Campaign) => void }) {
	
    function selectArenaHandler() {
		const loc = selectActiveLocationFromCampaign(props.campaign);

		props.update({ ...props.campaign, currentLocationId: loc.id });
	}

    function restartCampaignHandler() {
        props.update(createCampaign());
    }

	return (
		<div>
			<h1>Main menu</h1>

			<button onClick={selectArenaHandler}>Next Arena</button>
            <br />
            <button onClick={restartCampaignHandler}>Restart Campaign</button>


		</div>
	);
}

export default MainMenu;
