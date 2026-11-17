export interface IInvMasterStore {
    invmsT_Id: number;
    invmS_StoreName: string;
    invmS_StoreLocation: string;
    invmS_ContactPerson?: string;
    invmS_ContactNo: string;
    hrmE_Id: number;
    invmS_ActiveFlg: boolean;
    employeename?: string;
}

export interface IInvMasterStoreDTO {
    invmsT_Id: number;
    invmS_StoreName: string;
    invmS_StoreLocation: string;
    invmS_ContactPerson?: string;
    invmS_ContactNo: string;
    hrmE_Id: number;
}

export interface IEmployeeDropdown {
    hrmE_Id: number;
    employeename: string;
    hrmE_MobileNo: string;
}
