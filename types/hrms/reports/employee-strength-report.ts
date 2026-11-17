import type { ApiResponse } from '@/lib/apiService';

/**
 * Request interface for Employee Strength Report onload
 */
export interface EmployeeStrengthReportOnloadRequest {
    MI_Id: number;
    LogInUserId: number;
}

/**
 * Dropdown item interfaces
 */
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
    HRMDC_ID: number | null;
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
    HRMDC_ID: number | null;
    CreatedDate?: string;
    UpdatedDate?: string;
}

/**
 * Response interface for Employee Strength Report onload
 */
export interface EmployeeStrengthReportOnloadResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    HRME_Id: number | null;
    FromDate: string | null;
    ToDate: string | null;
    FormatType: string | null;
    AllEmployee: boolean;
    Departmentwise: boolean;
    LeftEmployee: boolean;
    employeedropdown: any[] | null;
    departmentdropdown: DepartmentDropdown[] | null;
    designationdropdown: DesignationDropdown[] | null;
    groupTypedropdown: GroupTypeDropdown[] | null;
    groupTypeselected: any;
    departmentselected: any;
    designationselected: any;
    employeeDetails: any;
    grouptypeName: string | null;
    departmentName: string | null;
    designationName: string | null;
    totalEmployees: number;
    totalLeftEmployees: number;
    totalWorkingEmployees: number;
    institutionDetails: any;
    LogInUserId: number;
    hrmgT_IdList: number[] | null;
    employeeTypeIdList: number[] | null;
    hrmD_IdList: number[] | null;
    hrmdeS_IdList: number[] | null;
    groupTypeIdList: number[] | null;
    HRMD_Id: number | null;
}

/**
 * Request interface for Employee Strength Report search
 */
export interface EmployeeStrengthReportSearchRequest {
    MI_Id: number;
    designationSelected: number[];
    departmentSelected: number[];
    groupTypeSelected: number[];
    allEmployee: boolean;
    departmentwise: boolean;
    leftEmployee: boolean;
    fromDate: string;
    toDate: string;
}

/**
 * Response interface for Employee Strength Report search
 * The response structure may vary, but typically includes employee details and strength data
 */
export interface EmployeeStrengthReportSearchResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    employeeDetails?: any[];
    totalEmployees?: number;
    totalLeftEmployees?: number;
    totalWorkingEmployees?: number;
    [key: string]: any;
}

