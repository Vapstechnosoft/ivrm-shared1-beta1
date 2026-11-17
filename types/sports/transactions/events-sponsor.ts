export interface IEventSponsorMapping {
    spccesP_Id: number;
    mI_Id: number;
    spccE_Id: number;
    spccmsP_Id: number;
    spccesP_ActiveFlag: boolean;
    spccpM_Name?: string; // Program Name
    sponsorName?: string; // Sponsor Name
    createdDate?: string;
    updatedDate?: string;
}

export interface IEventSponsorInitialData {
    events: {
        spccesP_Id: number;
        mI_Id: number;
        spccE_Id: number;
        spccmsP_Id: number;
        spccesP_ActiveFlag: boolean;
        count: number;
        spccmE_Id: number;
        spccpM_Id: number;
        spccpM_Name: string;
    }[];
    sponsorList: {
        spccmsP_Id: number;
        mI_Id: number;
        spccmsP_SponsorName: string;
        spccmsP_ContactNo: number;
        spccmsP_ActiveFlag: boolean;
        count: number;
    }[];
    sponsormappingList: IEventSponsorMapping[];
}
