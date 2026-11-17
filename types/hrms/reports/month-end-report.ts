/**
 * Request interface for Month End Report onload
 */
export interface MonthEndReportOnloadRequest {
    MI_Id: number;
}

/**
 * Dropdown item interfaces
 */
export interface MonthDropdown {
    IVRM_Month_Id: number;
    IVRM_Month_Name: string;
    Is_Active: boolean;
    IVRM_Month_Max_Days: number;
}

export interface LeaveYearDropdown {
    HRMLY_Id: number;
    MI_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_FromDate: string;
    HRMLY_ToDate: string;
    HRMLY_ActiveFlag: boolean;
    HRMLY_LeaveYearOrder: number;
    CreatedDate?: string;
    UpdatedDate?: string;
}

export interface DepartmentDropdown {
    hrmD_Id: number;
    HRMD_DepartmentName: string;
    [key: string]: any;
}

export interface DesignationDropdown {
    hrmdeS_Id: number;
    HRMDES_DesignationName: string;
    [key: string]: any;
}

export interface GroupTypeDropdown {
    hrmgT_Id: number;
    HRMGT_GroupTypeName: string;
    [key: string]: any;
}

export interface EmployeeDetails {
    HRME_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    [key: string]: any;
}

export interface InstitutionDetails {
    MI_Id: number;
    MI_Name: string;
    MI_Code?: string;
    MI_Address1?: string;
    MI_Address2?: string;
    MI_Address3?: string;
    [key: string]: any;
}

/**
 * Response interface for Month End Report onload
 */
export interface MonthEndReportOnloadResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    HRES_Year: string | null;
    HRES_Month: string | null;
    monthdropdown: MonthDropdown[] | null;
    leaveyeardropdown: LeaveYearDropdown[] | null;
    employeeDetails: EmployeeDetails[] | null;
    workingEmployee: number;
    leftEmployee: number;
    newEmployee: number;
    salaryGenerated: number;
    salaryslipGenerated: number;
    missingPhoto: number;
    missingEmailId: number;
    missingContactNumber: number;
    missingContactNumberleft: number;
    missingEmailIdleft: number;
    missingPhotoleft: number;
    missingPhotonew: number;
    missingEmailIdnew: number;
    missingContactNumbernew: number;
    monthendDate: string | null;
    institutionDetails: InstitutionDetails | null;
    salaryslipsent: number;
    salaryslipsmssent: number;
    departmentdropdown: DepartmentDropdown[] | null;
    designationdropdown: DesignationDropdown[] | null;
    groupTypedropdown: GroupTypeDropdown[] | null;
    groupTypeIdList: number[] | null;
    hrmD_IdList: number[] | null;
    hrmdeS_IdList: number[] | null;
    empid: number[] | null;
    smscount: string[] | null;
    emailcount: string[] | null;
}

/**
 * Request interface for Month End Report search
 */
export interface MonthEndReportSearchRequest {
    MI_Id: number;
    retrunMsg?: string;
    roleId?: number;
    HRES_Year: string;
    HRES_Month: string;
    monthdropdown?: string[];
    leaveyeardropdown?: string[];
    employeeDetails?: string[];
    groupTypeIdList?: number[];
    hrmD_IdList?: number[];
    hrmdeS_IdList?: number[];
    empid?: number[];
    [key: string]: any;
}

/**
 * Response interface for Month End Report search
 * Typically returns employee details for selected month and year
 */
export interface MonthEndReportSearchResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    HRES_Year: string | null;
    HRES_Month: string | null;
    employeeDetails: EmployeeDetails[] | null;
    workingEmployee: number;
    leftEmployee: number;
    newEmployee: number;
    salaryGenerated: number;
    salaryslipGenerated: number;
    missingPhoto: number;
    missingEmailId: number;
    missingContactNumber: number;
    missingContactNumberleft: number;
    missingEmailIdleft: number;
    missingPhotoleft: number;
    missingPhotonew: number;
    missingEmailIdnew: number;
    missingContactNumbernew: number;
    monthendDate: string | null;
    institutionDetails: InstitutionDetails | null;
    salaryslipsent: number;
    salaryslipsmssent: number;
    departmentdropdown: DepartmentDropdown[] | null;
    designationdropdown: DesignationDropdown[] | null;
    groupTypedropdown: GroupTypeDropdown[] | null;
    [key: string]: any;
}
