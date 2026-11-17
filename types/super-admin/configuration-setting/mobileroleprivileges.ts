export interface InstitutionDropdown {
    mI_Id: number;
    mI_Name: string;
}

export interface RoleDropdown {
    ivrmrT_Id: number;
    ivrmrT_Role: string;
}

export interface IMobileRolePrivilege {
    ivrmmaP_Id: number;
    ivrmmaP_AppPageName: string;
    ivrmmaP_Displayname: string;
    ivrmrP_Id: number;
    ivrmrP_AddFlag: boolean;
    ivrmrP_UpdateFlag: boolean;
    ivrmrP_DeleteFlag: boolean;
    ivrmrP_ReportFlag: boolean;
    mI_Id: number;
    ivrmrT_Id: number;
    checked?: boolean;
    isNew?: boolean;
}

export interface IMobilePrivilegeRecord {
    ivrmrmaP_Id: number;
    ivrmmaP_AppPageName: string;
    ivrmrT_Role: string;
    ivrmR_Id: number;
    ivrmmaP_Id: number;
    institutename: string;
    ivrmmmI_MenuOrder: number;
}

export interface IMasterPageRecord {
    ivrmmaP_Id: number;
    ivrmmaP_AppPageName: string;
    ivrmmaP_Displayname: string;
    ivrmmaP_AppPageDesc: string;
    ivrmmaP_AppPageURL: string;
    ivrmmaP_AnalyticalFlag: boolean;
    ivrmmaP_ActiveFlg: boolean;
    createdDate: string;
    updatedDate: string;
}
