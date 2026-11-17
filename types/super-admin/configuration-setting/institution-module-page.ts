export interface InstitutionRolePrivilegeDTO {
    ivrmirP_Id: number;
    mI_Name: string;
    ivrmM_ModuleName: string;
    ivrmmP_PageName: string;
    ivrmrT_Role: string;
    ivrmirP_AddFlag: boolean;
    ivrmirP_DeleteFlag: boolean;
    ivrmirP_UpdateFlag: boolean;
    ivrmirP_ProcessFlag: boolean;
    ivrmirP_ReportFlag: boolean;
    ivrmirP_SearchFlag: boolean;
    checked?: boolean;
}

export interface InstitutionDTO {
    mI_Id: number;
    mI_Name: string;
    Selected?: boolean;
}

export interface ModuleDTO {
    ivrmM_Id: number;
    ivrmM_ModuleName: string;
    Selected?: boolean;
}

export interface RoleDTO {
    ivrmrT_Id: number;
    ivrmrT_Role: string;
    Selected?: boolean;
}

export interface PageDTO {
    ivrmP_Id: number;
    ivrmmP_PageName: string;
    checked?: boolean;
    // Privilege Flags for the 'Selected Institute Role' Grid
    ivrmrP_AddFlag?: boolean;
    ivrmrP_DeleteFlag?: boolean;
    ivrmrP_UpdateFlag?: boolean;
    ivrmrP_ProcessFlag?: boolean;
    ivrmrP_ReportFlag?: boolean;
    ivrmrP_SearchFlag?: boolean;
    ivrmrT_Id?: number; // referenced in the HTML hidden field
}
