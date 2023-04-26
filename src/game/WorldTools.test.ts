import { Campaign } from "../models/Campaign";
import { createCampaign } from "./CampaignTools";
import { buildMapLocations } from "./WorldTools";


describe("WorldTools", () => {

    it("Create valid maplocations", () => {

        const campaign = createCampaign();

        const mps = buildMapLocations(campaign);

        console.warn(mps);

        expect(mps.length).toBe(5);
        

        
    });
})
