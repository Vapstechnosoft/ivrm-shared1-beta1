// Dropdown interfaces
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

export interface GroupTypeDropdown {
    HRMGT_Id: number;
    MI_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Code: string;
    HRMGT_Order: number;
    HRMGT_ActiveFlag: boolean;
    CreatedDate?: string;
    UpdatedDate?: string;
}

export interface DepartmentDropdown {
    HRMD_Id: number;
    MI_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Order: number;
    HRMD_ActiveFlag: boolean;
    HRMDC_ID: number;
    HRMD_InternalTrainingMinimumHrs: number;
    CreatedDate?: string;
    UpdatedDate?: string;
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
    HRMDC_ID: number;
    CreatedDate?: string;
    UpdatedDate?: string;
}

// Request interfaces
export interface LoanReportBasicDataRequest {
    MI_Id: number;
    roleId?: number;
    LogInUserId?: number;
}

export interface LoanReportFilterRequest {
    MI_Id: number;
    roleId?: number;
    LogInUserId?: number;
    hrmgT_IdList?: number[];
    hrmD_IdList?: number[];
    hrmdeS_IdList?: number[];
}

export interface LoanReportSearchRequest {
    MI_Id: number;
    roleId?: number;
    LogInUserId?: number;
    hrmgT_IdList?: number[];
    hrmD_IdList?: number[];
    hrmdeS_IdList?: number[];
    hrmE_Id?: number;
}

// Response interface - matches the API response structure
export interface LoanReportResponse {
    MI_Id: number;
    roleId: number;
    LogInUserId: number;
    IVRM_Month_Id: number;
    monthdropdown: MonthDropdown[];
    leaveyeardropdown: LeaveYearDropdown[];
    departmentdropdown: DepartmentDropdown[];
    designationdropdown: DesignationDropdown[];
    groupTypedropdown: GroupTypeDropdown[];
    hrmgT_IdList?: number[];
    employeeTypeIdList?: number[];
    hrmD_IdList?: number[];
    hrmdeS_IdList?: number[];
    hrmE_Id?: number;
    employeedropdown?: EmployeeDropdown[];
    employeeSalaryslipDetails?: any[];
    EmploanTotalAmount?: any[];
    hrmE_EmployeeFirstName?: string;
    hrme_employeecode?: string;
    HRELT_Year?: number;
    HRELT_Month?: string;
    HREL_LoanAmount?: number;
    HRELT_LoanAmount?: number;
    HREL_LoanInsallments?: string;
    HRML_LoanType?: string;
    HREL_TotalPending?: number;
    institutionDetails?: any;
    configurationDetails?: any;
    CreatedDate?: string;
    UpdatedDate?: string;
}

