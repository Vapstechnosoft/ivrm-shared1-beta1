export interface ITrustMaster {
    mO_Id: number;
    ivrmmcT_Name: string;
    ivrmmS_Id: number;
    ivrmmC_Id: number;
    mO_Name: string;
    mO_Address1: string;
    mO_Address2: string;
    mO_Address3: string;
    mO_Landmark: string;
    mO_Pincode: number;
    mO_FaxNo: string;
    mO_Website: string;
    mO_OrganisationType: string;
    mO_ActiveFlag: number; // API returns 0 or 1
    mT_Currency: string;
    mT_Domain_name: string;
    mO_AboutInstitute: string | null;
    mO_ContactDetails: string | null;
    mO_Logo: string | null;
    createdDate: string;
    updatedDate: string;
}


