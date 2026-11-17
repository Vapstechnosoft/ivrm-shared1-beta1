// Salary Approval Types

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Onload Request
export interface SalaryApprovalOnloadRequest {
    MI_Id: number;
}

// Dropdown Types
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

export interface LeaveYearDropdown {
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

export interface MonthDropdown {
    IVRM_Month_Id: number;
    IVRM_Month_Name: string;
    Is_Active: boolean;
    IVRM_Month_Max_Days: number;
}

// Onload Response
export interface SalaryApprovalOnloadResponse {
    MI_Id: number;
    groupTypedropdownlist: GroupTypeDropdown[];
    departmentdropdownlist: DepartmentDropdown[];
    designationdropdownlist: DesignationDropdown[];
    monthdropdown: MonthDropdown[];
    leaveyeardropdown: LeaveYearDropdown[];
}

// Search Request
export interface SalaryApprovalSearchRequest {
    MI_Id: number;
    HRES_Year: string;
    HRES_Month: string;
    hrmdeS_IdList: number[];
    hrmD_IdList: number[];
    groupTypeIdList: number[];
    LogInUserId: number;
}

// Employee Detail in Search Response
export interface EmployeeDetail {
    HRME_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName: string | null;
    HRME_EmployeeLastName: string | null;
    HRMGT_EmployeeGroupType: string;
    HRMD_DepartmentName: string;
    HRMDES_DesignationName: string;
    TotalEarning: number;
    TotalDeduction: number;
    NetSalary: number;
    HRES_WorkingDays: number;
    HRES_Year: string;
    HRES_Month: string;
}

// Search Response
export interface SalaryApprovalSearchResponse {
    ReportData: EmployeeDetail[] | null;
    employeeDetails?: any;
    designationdropdownlist?: DesignationDropdown[];
    departmentdropdownlist?: DepartmentDropdown[];
    groupTypedropdownlist?: GroupTypeDropdown[];
}

// Approval Request
export interface SalaryApprovalRequest {
    MI_Id: number;
    HRES_Year: string;
    HRES_Month: string;
    employeeIdList: number[];
    LogInUserId: number;
    approvalStatus: 'Approved' | 'Rejected';
    remarks?: string;
}

// Approval Response
export interface SalaryApprovalResponse {
    success: boolean;
    message: string;
    approvedCount: number;
    failedCount: number;
}
