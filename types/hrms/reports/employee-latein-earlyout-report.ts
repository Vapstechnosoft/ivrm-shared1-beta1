// Employee Late In Early Out Report API Types

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

// Group Type (from types array in response)
export interface LateInEarlyOutGroupType {
    hrmgT_Id: number;
    mI_Id: number;
    hrmgT_EmployeeGroupType: string;
    hrmgT_Code: string;
    hrmgT_Order: number;
    hrmgT_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

// Employee (from employees array in response)
export interface LateInEarlyOutEmployee {
    mI_Id: number;
    filltypes: any | null;
    filldepartment: any | null;
    filldesignation: any | null;
    fillemployee: any | null;
    filldata: any | null;
    multipletype: any | null;
    multipledep: any | null;
    multipledes: any | null;
    multipleemp: any | null;
    hrmD_Id: number;
    hrmD_DepartmentName: string | null;
    hrmdeS_Id: number;
    hrmdeS_DesignationName: string | null;
    hrmE_Id: number;
    ename: string;
    hrmE_EmployeeCode: string;
    fromdate: string | null;
    todate: string | null;
    columnnames: any | null;
    multiplehrmeid: any | null;
    lateby: any | null;
    foeP_PunchDate: string | null;
    punchtype: any | null;
}

// Month (from months array in response)
export interface LateInEarlyOutMonth {
    ivrM_Month_Id: number;
    ivrM_Month_Name: string;
    is_Active: boolean;
    ivrM_Month_Max_Days: number;
}

// Year (from years array in response)
export interface LateInEarlyOutYear {
    hrmlY_Id: number;
    mI_Id: number;
    hrmlY_LeaveYear: string;
    hrmlY_FromDate: string;
    hrmlY_ToDate: string;
    hrmlY_ActiveFlag: boolean;
    hrmlY_LeaveYearOrder: number;
    createdDate: string | null;
    updatedDate: string;
}

// Onload Request
export interface EmployeeLateInEarlyOutReportOnloadRequest {
    page: number;
    page_size: number;
    search_query: string;
    search_column: string;
    sort_column: string;
    sort_direction: string;
    is_export: boolean;
    miid: number;
    loginUserId: number;
    userRole: string;
}

// Onload Response
export interface EmployeeLateInEarlyOutReportOnloadResponse {
    types: LateInEarlyOutGroupType[];
    employees: LateInEarlyOutEmployee[];
    months: LateInEarlyOutMonth[];
    years: LateInEarlyOutYear[];
}

// Full API Response
export interface EmployeeLateInEarlyOutReportGetDataResponse {
    success: boolean;
    message: string;
    data: EmployeeLateInEarlyOutReportOnloadResponse;
    total: number;
    page: number;
    page_size: number;
}

