// Employee Log Report API Types

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

// Group Type (from types array in response)
export interface EmployeeLogGroupType {
    hrmgT_Id: number;
    mI_Id: number;
    hrmgT_EmployeeGroupType: string;
    hrmgT_Code: string;
    hrmgT_Order: number;
    hrmgT_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

// Onload Request
export interface EmployeeLogReportOnloadRequest {
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
export interface EmployeeLogReportOnloadResponse {
    types: EmployeeLogGroupType[];
    months: null;
    years: null;
}

// Full API Response
export interface EmployeeLogReportGetDataResponse {
    success: boolean;
    message: string;
    data: EmployeeLogReportOnloadResponse;
    total: number;
    page: number;
    page_size: number;
}

