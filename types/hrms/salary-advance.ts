// Salary Advance Types

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

// Grid Item Type
export interface SalaryAdvanceGridItem {
    hresA_Id: number;
    mI_Id: number;
    hrmE_Id: number;
    hresA_EntryDate: string;
    hresA_AdvYear: number;
    hresA_AdvMonth: string;
    hresA_Remarks: string;
    hresA_AdvStatus: string;
    hresA_ActiveFlag: boolean;
    hresA_AppliedAmount: number;
    hresA_SanctinedAmount: number | null;
    hresA_ModeOfPayment: string;
    hresA_ReferenceNo: number;
    masterEmployee?: any;
    employeeName?: string; // From UI or joined data
    createdDate?: string | null;
    updatedDate?: string | null;
}

// Employee Dropdown Item Type
export interface SalaryAdvanceEmployeeDropdownItem {
    hrmE_Id: number;
    employeeName: string;
}

// Save Request Type
export interface SalaryAdvanceSaveRequest {
    HRESA_Id: number;
    HRME_Id: number;
    HRESA_EntryDate: string;
    HRESA_AdvYear: number;
    HRESA_AdvMonth: string;
    HRESA_Remarks: string;
    HRESA_AdvStatus: string;
    HRESA_ActiveFlag: boolean;
    HRESA_AppliedAmount: number;
    HRESA_SanctinedAmount: number | null;
    HRESA_ModeOfPayment: string;
    HRESA_ReferenceNo: number;
}

// Detailed Info Request
export interface SalaryAdvanceDetailsRequest {
    HRME_Id: number;
    HRESA_Id: number;
    HRESA_EntryDate: string;
}

// Detailed Info Response
export interface EmployeeSalaryAdvanceDetails {
    hrmE_Id: number;
    mI_Id: number;
    hresA_Id: number;
    hresA_EntryDate: string;
    totalAppliedAmount: number;
    empGrossSalary: number;
}

// Keep existing types for backward compatibility if needed, but primarily use the new ones above
// Onload Response (Existing)
export interface SalaryAdvanceOnloadResponse {
    CreatedDate?: string;
    UpdatedDate?: string;
    HRESA_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HRESA_EntryDate?: string;
    HRESA_AdvYear?: number;
    HRESA_AdvMonth?: string;
    HRESA_AppliedAmount?: number;
    HRESA_Remarks?: string;
    HRESA_ActiveFlag?: boolean;
    HRESA_AdvStatus?: string;
    HRESA_SanctinedAmount?: number;
    HRESA_ModeOfPayment?: string;
    HRESA_ReferenceNo?: number;
    empadvaList: any[];
    retrunMsg: string;
    Status?: string;
    roleId: number;
    employeedropdown: any[];
    leaveyeardropdown: any[];
    monthdropdown: any[];
    modeOfPaymentdropdown: any[];
    configurationDetails?: any;
    empGrossSal?: number;
    totalAppliedAmount?: number;
    searchfilter?: string;
}
