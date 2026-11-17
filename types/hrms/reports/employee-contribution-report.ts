// API Response interface
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Request interfaces
export interface EmployeeContributionReportOnloadRequest {
    MI_Id: number;
    LogInUserId: number;
}

// Dropdown interfaces
export interface MonthDropdown {
    IVRM_Month_Id: number;
    IVRM_Month_Name: string;
    Is_Active: boolean;
    IVRM_Month_Max_Days: number;
}

export interface YearDropdown {
    HRMLY_Id: number;
    MI_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_FromDate: string;
    HRMLY_ToDate: string;
    HRMLY_ActiveFlag: boolean;
    HRMLY_LeaveYearOrder: number;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface GroupTypeDropdown {
    HRMGT_Id: number;
    MI_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Code: string;
    HRMGT_Order: number;
    HRMGT_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface DepartmentDropdown {
    HRMD_Id: number;
    MI_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Order: number;
    HRMD_ActiveFlag: boolean;
    HRMDC_ID: number | null;
    HRMD_InternalTrainingMinimumHrs: number;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface DesignationDropdown {
    HRMDES_Id: number;
    MI_Id: number;
    HRMDES_DesignationName: string;
    HRMDES_BasicAmount: number;
    HRMDES_SanctionedSeats: number;
    HRMDES_DisplaySanctionedSeatsFlag: boolean;
    HRMDES_Order: number;
    HRMDES_ActiveFlag: boolean;
    HRMDC_ID: number | null;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface EmployeeTypeDropdown {
    HRMET_Id: number;
    MI_Id: number;
    HRMET_EmployeeType: string;
    HRMET_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface EarningDropdown {
    HRMED_Id: number;
    MI_Id: number;
    HRMED_Name: string;
    HRMED_EarnDedFlag: string;
    HRMED_ActiveFlag: boolean;
}

export interface DeductionDropdown {
    HRMED_Id: number;
    MI_Id: number;
    HRMED_Name: string;
    HRMED_EarnDedFlag: string;
    HRMED_ActiveFlag: boolean;
}

export interface EmployeeDropdown {
    HRME_Id: number;
    MI_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName: string | null;
    HRME_EmployeeLastName: string;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRMGT_Id: number;
}

// Response interface
export interface EmployeeContributionReportResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    HRME_Id: number | null;
    EarningDeduction: any;
    EarningHead: any;
    DeductionHead: any;
    MonthBetweenDates: any;
    FromDate: string | null;
    ToDate: string | null;
    FormatType: string | null;
    hreS_Month: string | null;
    hreS_Year: string | null;
    monthdropdown: MonthDropdown[] | null;
    employeedropdown: EmployeeDropdown[] | null;
    leaveyeardropdown: YearDropdown[] | null;
    departmentdropdown: DepartmentDropdown[] | null;
    designationdropdown: DesignationDropdown[] | null;
    employeeTypedropdown: EmployeeTypeDropdown[] | null;
    groupTypedropdown: GroupTypeDropdown[] | null;
    earningdropdown: EarningDropdown[] | null;
    detectiondropdown: DeductionDropdown[] | null;
    groupTypeselected: any;
    departmentselected: any;
    designationselected: any;
    employeeDetails: any;
    employeeContributionDetails: any;
    headerlist: any;
    EmployeeCode: string | null;
    HRME_EmployeeFirstName: string | null;
    HRME_EmployeeMiddleName: string | null;
    HRME_EmployeeLastName: string | null;
    departmentName: string | null;
    designationName: string | null;
    GrossSalary: number | null;
    selectedHeadAmount: number | null;
    remarks: string | null;
    institutionDetails: any;
    LogInUserId: number;
    hrmgT_IdList: number[] | null;
    hrmD_IdList: number[] | null;
}

// Filter request interface
export interface EmployeeContributionReportFilterRequest {
    MI_Id: number;
    FormatType: string;
    MonthBetweenDates: string;
    hreS_Month: string;
    hreS_Year: string;
    FromDate: string;
    ToDate: string;
    designationselected: number[];
    departmentselected: number[];
    groupTypeselected: number[];
}

// Filter response interface (same structure as onload response)
export interface EmployeeContributionReportFilterResponse extends EmployeeContributionReportResponse {}

// Search request interface
export interface EmployeeContributionReportSearchRequest {
    MI_Id: number;
    designationselected: number[];
    departmentselected: number[];
    groupTypeselected: number[];
    MonthBetweenDates: string;
    hreS_Month: string;
    hreS_Year: string;
    FromDate: string;
    ToDate: string;
    FormatType: string;
    HRME_Id: number;
    EarningDeduction: string;
    EarningHead: number;
    DeductionHead: number;
}

// Search response interface (same structure as onload response)
export interface EmployeeContributionReportSearchResponse extends EmployeeContributionReportResponse {}

// Type exports
export type EmployeeContributionReportOnloadResponse = ApiResponse<EmployeeContributionReportResponse>;
export type EmployeeContributionReportFilterResponseType = ApiResponse<EmployeeContributionReportFilterResponse>;
export type EmployeeContributionReportSearchResponseType = ApiResponse<EmployeeContributionReportSearchResponse>;

