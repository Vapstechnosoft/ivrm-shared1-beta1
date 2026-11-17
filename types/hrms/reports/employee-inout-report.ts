// Employee In-Out Report API Types

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

// Group Type (from types array in response)
export interface EmployeeInOutGroupType {
    HRMGT_Id?: number;
    hrmgT_Id?: number;
    MI_Id?: number;
    mI_Id?: number;
    HRMGT_EmployeeGroupType?: string;
    hrmgT_EmployeeGroupType?: string;
    HRMGT_Code?: string;
    hrmgT_Code?: string;
    HRMGT_Order?: number;
    hrmgT_Order?: number;
    HRMGT_ActiveFlag?: boolean;
    hrmgT_ActiveFlag?: boolean;
    CreatedDate?: string;
    createdDate?: string;
    UpdatedDate?: string;
    updatedDate?: string;
}

// Onload Request
export interface EmployeeInOutReportOnloadRequest {
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
export interface EmployeeInOutReportOnloadResponse {
    types: EmployeeInOutGroupType[];
    lieo: any | null;
    lateInApproval: any | null;
}

// Full API Response
export interface EmployeeInOutReportGetDataResponse {
    success: boolean;
    message: string;
    data: EmployeeInOutReportOnloadResponse;
    total: number;
    page: number;
    page_size: number;
}

// Department Request
export interface EmployeeInOutReportDepartmentRequest {
    MI_Id: number;
    UserId: number;
    IVRMRT_Id: number;
    multipletype: string;
}

// Department Response Item
export interface EmployeeInOutReportDepartment {
    [key: string]: any; // Structure will be determined by API response
}

// Designation Request
export interface EmployeeInOutReportDesignationRequest {
    MI_Id: number;
    multipledep: string;
}

// Designation Response Item
export interface EmployeeInOutReportDesignation {
    [key: string]: any; // Structure will be determined by API response
}

// Employee Request
export interface EmployeeInOutReportEmployeeRequest {
    MI_Id: number;
    multipledes: string;
    multipledep: string;
    multipletype: string;
}

// Employee Response Item
export interface EmployeeInOutReportEmployee {
    [key: string]: any; // Structure will be determined by API response
}

