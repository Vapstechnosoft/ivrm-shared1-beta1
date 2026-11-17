export interface ISuperAdminMaster {
    emsA_Id: number;
    mI_Id: number;
    emsA_SuperAdminName: string;
    emsA_SuperAdminCode: string;
    emsA_SuperAdminDescription: string;
    emsA_ActiveFlag: boolean;
    emsA_CreatedBy: number;
    emsA_UpdatedBy: number;
    emsA_CreatedDate: string;
    emsA_UpdatedDate: string;
}


export interface ISuperAdminMasterOrder {
    emsA_Id: number;
    emsA_SuperAdminOrder: number;
}
