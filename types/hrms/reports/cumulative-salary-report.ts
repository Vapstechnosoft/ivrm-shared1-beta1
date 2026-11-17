// Cumulative Salary Report API Types

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

// Group Type Dropdown
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

// Department Dropdown
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

// Designation Dropdown
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

// Month Dropdown
export interface MonthDropdown {
    IVRM_Month_Id: number;
    IVRM_Month_Name: string;
    Is_Active: boolean;
    IVRM_Month_Max_Days: number;
}

// Leave Year Dropdown
export interface LeaveYearDropdown {
    HRMLY_Id: number;
    MI_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_FromDate: string;
    HRMLY_ToDate: string;
    HRMLY_ActiveFlag: boolean;
    HRMLY_LeaveYearOrder: number;
    CreatedDate: string | null;
    UpdatedDate: string;
}

// Onload Response
export interface CumulativeSalaryReportOnloadResponse {
    MI_Id: number;
    groupTypedropdownlist: GroupTypeDropdown[];
    departmentdropdownlist: DepartmentDropdown[];
    designationdropdownlist: DesignationDropdown[];
    monthdropdown: MonthDropdown[];
    leaveyeardropdown: LeaveYearDropdown[];
}

// Search Request
export interface CumulativeSalaryReportSearchRequest {
    MI_Id: number;
    HRES_Year: string;
    HRES_Month: string;
    hrmdeS_IdList: number[];
    hrmD_IdList: number[];
    groupTypeIdList: number[];
    LogInUserId: number;
}

// Salary Report Record
export interface SalaryReportRecord {
    HRME_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName: string;
    HRME_EmployeeLastName: string;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRMD_DepartmentName: string;
    HRMDES_DesignationName: string;

    // Earnings
    basic: number;
    da: number;
    hra: number;
    conveyance: number;
    medical: number;
    splAllowance: number;
    grossEarning: number;

    // Deductions
    pf: number;
    esi: number;
    others: number;
    pt: number;
    grossDeduction: number;

    // Leave and Net Salary
    leaveDedDays: number;
    leaveDedPrevDays: number;
    netSalary: number;

    // Additional fields for mapping
    employeeName?: string;
    designation?: string;
}

// Search Response
export interface CumulativeSalaryReportSearchResponse {
    MI_Id: number;
    ReportData: SalaryReportRecord[];
    retrunMsg: string;
}

// New API Request Structure
export interface CumulativeSalaryReportListRequest {
    page: number;
    page_size: number;
    search_query: string;
    search_column: string;
    sort_column: string;
    sort_direction: string;
    is_export: boolean;
    MIID: number;
    LoginUserId: number;
    UserRole: string;
}

// New API Response Structure - Dropdown Data
export interface CumulativeSalaryReportDropdownData {
    MI_Id: number;
    groupTypedropdownlist: GroupTypeDropdown[];
    departmentdropdownlist: DepartmentDropdown[];
    designationdropdownlist: DesignationDropdown[];
    monthdropdown: MonthDropdown[];
    leaveyeardropdown: LeaveYearDropdown[];
}

// New API Response Structure - Full Response
export interface CumulativeSalaryReportListResponse {
    data: {
        dropdown: CumulativeSalaryReportDropdownData;
        rows: SalaryReportRecord[] | DesignationDropdown[]; // Rows can be salary records or other data depending on filters
    };
    total: number;
    page: number;
    page_size: number;
}