import type { ApiResponse } from '@/lib/apiService';

/**
 * Request interface for ESI Report onload
 */
export interface ESIReportOnloadRequest {
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
 * Response interface for ESI Report onload
 */
export interface ESIReportOnloadResponse {
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
    HRME_EmployeeCode: string | null;
    groupTypeselected: any;
    employeeTypeselected: any;
    departmentselected: any;
    designationselected: any;
    employeeDetails: any;
    HRME_ESIAccNo: string | null;
    EmployeeName: string | null;
    HRES_WorkingDays: number | null;
    EmployeeContibution: number | null;
    EmployerContibution: number | null;
    totalAmount: number | null;
    HRME_DOL: string | null;
    basicAmount: number | null;
    institutionDetails: any;
    LogInUserId: number;
    hrmgT_IdList: number[] | null;
    employeeTypeIdList: number[] | null;
    hrmD_IdList: number[] | null;
    hrmdeS_IdList: number[] | null;
    groupTypeIdList: number[] | null;
    HRC_ECodePrefix: string | null;
    configurationDetails: any;
}

/**
 * Request interface for ESI Report search
 */
export interface ESIReportSearchRequest {
    MI_Id: number;
    groupTypeselected: number[];
    departmentselected: number[];
    designationselected: number[];
    HRES_Year: string;
    HRES_Month: string;
}

/**
 * Response interface for ESI Report search
 * The response structure may vary, but typically includes employee ESI details
 */
export interface ESIReportSearchResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    employeeDetails?: any[];
    [key: string]: any;
}

