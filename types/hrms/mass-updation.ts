// Mass Updation Types

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Dropdown Interfaces
export interface GroupTypeDropdown {
    HRMGT_Id: number;
    HRMGT_EmployeeGroupType: string;
}

export interface DepartmentDropdown {
    HRMD_Id: number;
    HRMD_DepartmentName: string;
}

export interface DesignationDropdown {
    HRMDES_Id: number;
    HRMDES_DesignationName: string;
}

export interface EmployeeDropdown {
    HRME_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
}

export interface EarningDeductionHead {
    HRMED_Id: number;
    HRMED_Name: string;
    HRMED_EarnDedFlag: string;
}

// Employee Details
export interface EmployeeDetail {
    HRME_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRMD_DepartmentName?: string;
    HRMDES_DesignationName?: string;
    HRMGT_EmployeeGroupType?: string;
}

// Onload Response
export interface MassUpdationOnloadResponse {
    MI_Id: number;
    roleId: number;
    employeedropdown: EmployeeDropdown[];
    // API returns these fields without 'list' suffix
    departmentdropdown?: DepartmentDropdown[];
    designationdropdown?: DesignationDropdown[];
    groupTypedropdown?: GroupTypeDropdown[];
    // Also support fields with 'list' suffix for backward compatibility
    departmentdropdownlist?: DepartmentDropdown[];
    designationdropdownlist?: DesignationDropdown[];
    groupTypedropdownlist?: GroupTypeDropdown[];
    headdropdown: EarningDeductionHead[];
    employeeDetails: EmployeeDetail[];
    retrunMsg?: string;
}

// Onload Request
export interface MassUpdationOnloadRequest {
    MI_Id: number;
    roleId: number;
    LogInUserId: number;
}

// Save Request
export interface MassUpdationSaveRequest {
    MI_Id: number;
    roleId: number;
    LogInUserId: number;
    Type: string; // "Earning" or "Deduction"
    EarningDeduction: string;
    AmountPercentage: string; // "Amount" or "Percentage"
    HRMED_Id: number;
    HREED_Amount: number;
    HREED_Percentage: string;
    AddRemove: string; // "Add" or "Remove"
    groupTypeIdList: number[];
    hrmD_IdList: number[];
    hrmdeS_IdList: number[];
    employeeselected: number[];
}

// Save Response
export interface MassUpdationSaveResponse extends MassUpdationOnloadResponse { }

// Search Request
export interface MassUpdationSearchRequest {
    MI_Id: number;
    roleId: number;
    LogInUserId: number;
    groupTypeIdList: number[];
    hrmD_IdList: number[];
    hrmdeS_IdList: number[];
    HRMED_Id?: number;
}
