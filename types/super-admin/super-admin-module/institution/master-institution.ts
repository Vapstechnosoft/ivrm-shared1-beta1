export interface IMasterInstitution {
    mI_Id: number;
    mO_Id: number;
    mO_Name?: string;
    organisationName?: string;
    mI_Name: string;
    mI_OrganisationType: string;
    mI_SchoolCollegeFlag?: string;
    mI_Affiliation: string;
    mI_Subdomain: string;
    mI_CreditType: string;

    mI_Address1: string;
    mI_Address2: string;
    mI_Address3: string;
    ivrmmcT_Name: string;
    ivrmmS_Id: number;
    ivrmmC_Id: number;
    mI_Pincode: string;

    mI_FaxNo?: string;
    mI_ContactDetails?: string;

    mI_WeekStartDay?: string;
    mI_DateFormat?: string;
    mI_DateSeparator?: string;
    mI_GradingSystem?: string;
    mI_FranchiseFlag?: boolean;
    mI_FontSize?: string;
    mI_FontColor?: string;
    mI_FormColor?: string;

    mI_NAAC_InstitutionTypeFlg: string;
    mI_NAAC_SubInstitutionTypeFlg: string;

    mI_TAN?: string;
    mI_PAN?: string;
    mI_80GRegNo?: string;
    mI_AboutInstitute?: string;

    mI_SMSCountAlert?: string;
    mI_EntityId: string;

    // VC
    mI_VCStudentFlag?: string;
    mI_VCOthersFlag?: string;
    // Note: vcDetails usually not part of the main master object in list view, but might be needed for form handling type. 
    // We'll exclude it here if this type is strictly for the listing/grid, but safe to add if needed.

    // MS Teams
    mI_MSTeamsClientId?: string;
    mI_MSTeamsTenentId?: string;
    mI_MSTemasClinetSecretCode?: string;
    mI_MSTeamsAppAccessTockenURL?: string;
    mI_MSTeamsAdminUsername?: string;
    mI_MSTeamsUserAceessTockenURL?: string;
    mI_MSTeamsMeetingScheduleURL?: string;
    mI_MSTeamsGrantType?: string;
    mI_MSTeamsScope?: string;
    mI_MSTeamsAdminPassword?: string;

    mI_ActiveFlag: number;
    createdDate: string;
    updatedDate: string;
}

export interface ICountryDropdown {
    ivrmmC_Id: number;
    ivrmmC_CountryName: string;
}

export interface IStateDropdown {
    ivrmmS_Id: number;
    ivrmmS_Name: string;
}

export interface IInstitutionDropdown {
    mI_Id: number;
    mI_Name: string;
}
