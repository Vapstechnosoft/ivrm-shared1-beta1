export interface RoleTypeDTO {
    ivrmrT_Id: number;
    ivrmrT_Role: string;
    flag?: string;
    Selected?: boolean;
}

export interface TrustDTO {
    mO_Id: number;
    mO_Name: string;
    Selected?: boolean;
}

export interface InstitutionDTO {
    mI_Id: number;
    mI_Name: string;
    Selected?: boolean;
}

export interface StaffDTO {
    hrmE_Id: number;
    stafname: string;
    hrmE_EmployeeCode?: string;
    ivrmstauL_Id?: number;
    Selected?: boolean;
}

export interface CategoryDTO {
    amC_Id: number;
    amC_Name: string;
    catid?: boolean;
}

export interface ModuleDTO {
    ivrmM_Id: number;
    ivrmM_ModuleName: string;
    model?: boolean;
}

export interface PageDTO {
    pageMappingId: number;
    pageName: string;
    moduleName: string;
    institutionName?: string;
    addFlag: boolean;
    deleteFlag: boolean;
    updateFlag: boolean;
    processFlag: boolean;
    reportFlag: boolean;
    checked?: boolean;
}

export interface MobilePageDTO {
    ivrmmaP_Id: number;
    ivrmmaP_AppPageName: string;
    ivrmmaP_AddFlg: boolean;
    ivrmmaP_DeleteFlg: boolean;
    ivrmmaP_UpdateFlg: boolean;
    ivrmrT_Role?: string;
    ivrmR_Id?: number;
    ivrmrP_Id?: number;
    checked?: boolean;
}

export interface SavedPageDTO {
    ivrmmP_PageName: string;
    ivrmstauP_Id: number;
    ivrmrP_AddFlag: boolean;
    ivrmrP_DeleteFlag: boolean;
    ivrmrP_UpdateFlag: boolean;
    ivrmrP_ProcessFlag: boolean;
    ivrmrP_ReportFlag: boolean;
    ivrmimP_Id: number;
    checked?: boolean;
}

export interface SavedMobilePageDTO {
    ivrmmaP_Id: number;
    ivrmmaP_AppPageName: string;
    ivrmrT_Role: string;
    ivrmR_Id: number;
    ivrmrP_Id: number;
    ivrmumalP_Id: number;
    ivrmumalP_AddFlg: boolean | null;
    ivrmumalP_UpdateFlg: boolean | null;
    ivrmumalP_DeleteFlg: boolean | null;
    checked?: boolean;
}

export interface EmployeeListDTO {
    stafname: string;
    hrmE_EmployeeCode: string;
    user_Name: string;
    intname?: string;
    mI_Name?: string;
}

export interface StaffUserCreationOnloadDTO {
    fillorganisation: TrustDTO[];
    fillinstitution: InstitutionDTO[];
    fillroletype: RoleTypeDTO[];
    fillmodule: ModuleDTO[];
    fillstaff: StaffDTO[];
    fillstaffusers: StaffDTO[];
    fillcategory: CategoryDTO[];
    showgrid1: PageDTO[];
}

export interface SearchGridDTO {
    hrmE_Id: number;
    hrmE_EmployeeCode: string;
    ivrmmR_Role: string;
    hrmE_EmployeeFirstName: string;
    hrmE_EmployeeMiddleName: string | null;
    hrmE_EmployeeLastName: string | null;
    ivrmrT_Role: string;
    hrmE_MobileNo: number;
    hrmE_EmailId: string;
    ivrmuL_Id: number;
    ivrmuL_UserName: string;
    ivrmuL_ActiveFlag: boolean;
    checked?: boolean; // For selection in the grid

    // Fields for the new API (get_search_list_grid_onchange_of_institute_name)
    user_Name?: string;
    ivrmM_ModuleName?: string;
    mI_Name?: string;
    ivrmstauP_Id?: number;
    ivrmmP_PageName?: string;
    staffusername?: string | null;
    ivrmP_Id?: number;
}
