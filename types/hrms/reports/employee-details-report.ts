// Employee Details Report Types

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
    CreatedDate: string | null;
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

export interface EmployeeDetailsReportOnloadRequest {
    MI_Id: number;
    LogInUserId: number;
}

export interface EmployeeDetailsReportOnloadResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    Type: number;
    FormatType: string | null;
    DOBJL: string | null;
    AllOrIndividual: string | null;
    FromDate: string | null;
    ToDate: string | null;
    HRMET_Id: number | null;
    HRME_Id: number | null;
    TypeOrEmployee: string | null;
    Working: boolean | null;
    Left: boolean | null;
    monthdropdown: MonthDropdown[];
    employeedropdown: any[] | null;
    leaveyeardropdown: LeaveYearDropdown[];
    departmentdropdown: DepartmentDropdown[];
    designationdropdown: DesignationDropdown[];
    employeeTypedropdown: EmployeeTypeDropdown[];
    groupTypedropdown: GroupTypeDropdown[];
    groupTypeselected: any[] | null;
    employeeTypeselected: any[] | null;
    departmentselected: any[] | null;
    designationselected: any[] | null;
    masterEmployeeList: any[] | null;
    employeeDetails: any[] | null;
    headerselected: any[] | null;
    columnName: string | null;
    columnID: string | null;
    coloumns: any[] | null;
    empIds: any[] | null;
    LogInUserId: number;
    hrmgT_IdList: any[] | null;
    hrmD_IdList: any[] | null;
    HRMD_Id: number | null;
}

export interface EmployeeDetailsReportFilterRequest {
    MI_Id: number;
    FormatType: string;
    DOBJL: string;
    FromDate: string;
    ToDate: string;
    AllOrIndividual: string;
    TypeOrEmployee: string;
    HRMET_Id: number;
    HRME_Id: number;
    Left: boolean;
    Working: boolean;
}

export interface EmployeeDetailsReportFilterResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    Type: number;
    FormatType: string;
    DOBJL: string;
    AllOrIndividual: string;
    FromDate: string;
    ToDate: string;
    HRMET_Id: number;
    HRME_Id: number;
    TypeOrEmployee: string;
    Working: boolean;
    Left: boolean;
    monthdropdown: MonthDropdown[] | null;
    employeedropdown: any[] | null;
}

export interface EmployeeDetailsReportSearchRequest {
    LogInUserId: number;
    MI_Id: number;
    FormatType: string;
    DOBJL: string;
    AllOrIndividual: string;
    TypeOrEmployee: string;
    HRMET_Id: number;
    HRME_Id: number;
    FromDate: string;
    ToDate: string;
    Working: boolean;
    Left: boolean;
}

export interface EmployeeDetailsReportSearchResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    Type: number;
    FormatType: string;
    DOBJL: string;
    AllOrIndividual: string;
    FromDate: string;
    ToDate: string;
    HRMET_Id: number;
    HRME_Id: number;
    TypeOrEmployee: string;
    Working: boolean;
    Left: boolean;
    monthdropdown: MonthDropdown[] | null;
    employeedropdown: any[] | null;
    leaveyeardropdown: LeaveYearDropdown[] | null;
    departmentdropdown: DepartmentDropdown[] | null;
    designationdropdown: DesignationDropdown[] | null;
    employeeTypedropdown: EmployeeTypeDropdown[] | null;
    groupTypedropdown: GroupTypeDropdown[] | null;
    groupTypeselected: any[] | null;
    employeeTypeselected: any[] | null;
    departmentselected: any[] | null;
    designationselected: any[] | null;
    masterEmployeeList: any[] | null;
    employeeDetails: any[] | null;
    headerselected: any[] | null;
    columnName: string | null;
    columnID: string | null;
    coloumns: any[] | null;
    empIds: any[] | null;
    LogInUserId: number;
    hrmgT_IdList: any[] | null;
    hrmD_IdList: any[] | null;
    HRMD_Id: number | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}
