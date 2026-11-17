import type { ApiResponse } from '@/lib/apiService';

/**
 * Request interface for Head Wise Report onload
 */
export interface HeadWiseReportOnloadRequest {
    MI_Id: number;
    LogInUserId: number;
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

export interface EmployeeTypeDropdown {
    HRMET_Id: number;
    MI_Id: number;
    HRMET_EmployeeType: string;
    HRMET_ActiveFlag: boolean;
    CreatedDate?: string;
    UpdatedDate?: string;
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

/**
 * Response interface for Head Wise Report onload
 */
export interface HeadWiseReportOnloadResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    HRES_Year: string | null;
    HRES_Month: string | null;
    monthdropdown: MonthDropdown[] | null;
    leaveyeardropdown: LeaveYearDropdown[] | null;
    departmentdropdown: DepartmentDropdown[] | null;
    designationdropdown: DesignationDropdown[] | null;
    employeeTypedropdown: EmployeeTypeDropdown[] | null;
    groupTypedropdown: GroupTypeDropdown[] | null;
    groupTypeselected: any;
    employeeTypeselected: any;
    departmentselected: any;
    designationselected: any;
    employeeDetails: any;
    EmployeeCode: string | null;
    EmployeeName: string | null;
    DesignationName: string | null;
    TotalEarning: number | null;
    TotalDeduction: number | null;
    NetSalary: number | null;
    institutionDetails: any;
    LogInUserId: number;
    hrmgT_IdList: number[] | null;
    employeeTypeIdList: number[] | null;
    hrmD_IdList: number[] | null;
    hrmdeS_IdList: number[] | null;
    groupTypeIdList: number[] | null;
}

/**
 * Request interface for Head Wise Report search
 */
export interface HeadWiseReportSearchRequest {
    MI_Id: number;
    groupTypeselected: number[];
    departmentselected: number[];
    designationselected: number[];
    HRES_Year: string;
    HRES_Month: string;
}

/**
 * Response interface for Head Wise Report search
 * The response structure may vary, but typically includes employee head wise details
 */
export interface HeadWiseReportSearchResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    employeeDetails?: any[];
    [key: string]: any;
}

