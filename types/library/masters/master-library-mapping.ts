export interface ILibraryClassMapping {
    lmaL_Id: number;
    lmaL_LibraryName: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
    lmaLMC_Id: number;
}

export interface ILibraryStaffMapping {
    lmaL_Id: number;
    lmaL_LibraryName: string;
    ivrm_Role_Id: number;
    ivrm_Role_Name: string;
    hrmE_Id: number;
    hrmE_EmployeeFirstName: string;
    lmaLMS_Id: number;
}

export interface ILibraryMappingInitialData {
    libraryList: { lmaL_Id: number; lmaL_LibraryName: string }[];
    classList: { asmcL_Id: number; asmcL_ClassName: string }[];
    roleList: { ivrm_Role_Id: number; ivrm_Role_Name: string }[];
    staffList: { hrmE_Id: number; hrmE_EmployeeFirstName: string }[];
}
