// Salary Increment Types

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Employee Dropdown - API returns full employee object, but we only need these fields for dropdown
export interface EmployeeDropdown {
    HRME_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string | null;
    HRME_EmployeeLastName?: string | null;
    // API returns many more fields, but these are the ones we use
    [key: string]: any; // Allow additional fields from API
}

// Earning/Deduction Type
export interface EarningDeductionType {
    HRMED_Id: number;
    HRMED_Name: string;
    HRMED_EDTypeFlag: string;
    HRMED_EarnDedFlag: string;
    HRMED_AmountPercentFlag: string;
}

// Leave Year Dropdown
export interface LeaveYearDropdown {
    HRMLY_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_FromDate: string;
    HRMLY_ToDate: string;
}

// Month Dropdown
export interface MonthDropdown {
    IVRM_Month_Id: number;
    IVRM_Month_Name: string;
}

// Grid Data Item
export interface SalaryIncrementGridItem {
    HREIC_Id: number;
    HRME_Id?: number;
    EmployeeName?: string;
    HRMD_DepartmentName?: string;
    HRMED_Name?: string;
    Amount: number;
    PreviousAmount?: number;
    Flag?: string;
    HREIC_IncrementDate?: string | Date;
    [key: string]: any; // Allow additional fields from API
}

// Monthly Data (Leave Year) from API
export interface MonthlyData {
    HRMLY_Id: number;
    MI_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_FromDate: string;
    HRMLY_ToDate: string;
    HRMLY_ActiveFlag: boolean;
    HRMLY_LeaveYearOrder: number;
    CreatedDate: string;
    UpdatedDate: string;
}

// Onload Response
export interface SalaryIncrementOnloadResponse {
    MI_Id: number | null;
    roleId: number | null;
    HREIC_Id: number | null;
    HRME_Id: number | null;
    HREIC_LastIncrementDate: string | null;
    HREIC_IncrementDueDate: string | null;
    HREIC_IncrementDate: string | null;
    Fromdate: string | null;
    Todate: string | null;
    HREIC_ArrearApplicableFlg: boolean | null;
    HREIC_ArrearGivenFlg: boolean | null;
    HREIC_ArrearMonths: number | null;
    UserId: number | null;
    HREIC_ActiveFlag: boolean | null;
    HREICED_Id: number | null;
    HRMED_Id: number | null;
    HREICED_Amount: number | null;
    HREICED_Percentage: string | null;
    HREICED_ActiveFlag: boolean | null;
    retrunMsg: string | null;
    Status: string | null;
    monthdropdown: MonthDropdown[] | null;
    griddata: SalaryIncrementGridItem[] | null;
    Reportdata: any | null;
    employeelist: EmployeeDropdown[] | null;
    earningdeductiontype: EarningDeductionType[] | null;
    getempsdetails: any | null;
    leaveyeardropdown: LeaveYearDropdown[] | null;
    monthlydata: MonthlyData[] | null; // API returns this instead of leaveyeardropdown
    Type: string | null;
    Option: string | null;
    Month: number | null;
    Year: number | null;
    selected_hrmeID: number | null;
    employee: any | null;
}

// Onload Request
export interface SalaryIncrementOnloadRequest {
    page?: number;
    page_size?: number;
    search_query?: string;
    search_column?: string;
    sort_column?: string;
    sort_direction?: string;
    is_export?: boolean;
    MIID?: number;
    LoginUserId?: number;
    UserRole?: string;
    // Legacy support
    MI_Id?: number;
    roleId?: number;
}

// Save Request
export interface SalaryIncrementSaveRequest {
    HREIC_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HREIC_IncrementDate: string;
    HREIC_ArrearApplicableFlg: boolean;
    HREIC_ArrearGivenFlg: boolean;
    HREIC_ArrearMonths: number;
    HRMED_Id: number;
    HREICED_Amount: number;
    HREICED_Percentage: string;
    HREIC_ActiveFlag: boolean;
    roleId: number;
    UserId: number;
}

// Save Response
export interface SalaryIncrementSaveResponse extends Omit<SalaryIncrementOnloadResponse, 'HREIC_Id'> {
    HREIC_Id?: number | null;
}

// Delete Request
export interface SalaryIncrementDeleteRequest {
    HREIC_Id: number;
    MI_Id: number;
    roleId: number;
}

// Delete Response
export interface SalaryIncrementDeleteResponse {
    retrunMsg?: string;
}
