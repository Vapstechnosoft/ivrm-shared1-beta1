// Employee Loan Types - Simplified for IVRMNext

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T | null;
    total?: number;
    page?: number;
    page_size?: number;
}

// Simplified Employee Dropdown
export interface EmployeeDropdown {
    HRME_Id: number;
    employeeName: string;
    HRME_EmployeeCode?: string; // Kept for compatibility if mapped manually
    HRME_EmployeeFirstName?: string; // Kept for compatibility if mapped manually
    HRME_EmployeeMiddleName?: string | null;
    HRME_EmployeeLastName?: string | null;
}

// Master Loan Dropdown
export interface MasterLoanDropdown {
    HRMLN_Id: number; // Mapped from 'key'
    HRML_LoanType: string; // Mapped from 'value'
    MI_Id?: number;
    HRML_Max?: number;
    HRMLN_ActiveFlag?: boolean;
}

// Mode of Payment Dropdown
export interface ModeOfPaymentDropdown {
    IVRMMOD_Id: number;
    IVRMMOD_ModeOfPayment: string;
    MI_Id?: number;
    IVRMMOD_ActiveFlag?: boolean;
    IVRMMOD_Flag?: string;
    IVRMMOD_ModeOfPayment_Code?: string;
}

// Employee Loan Item (Unified View Model)
export interface EmployeeLoanItem {
    HREL_Id: number;
    MI_Id: number;
    HRME_Id: number;
    EmployeeFullName?: string; // Added from new API
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string | null;
    HRME_EmployeeLastName?: string | null;
    HRMLN_Id: number;
    HRML_LoanType?: string;
    HREL_AppliedDate: string;
    HREL_EmpLoanId?: string;
    HREL_LoanAmount: number;
    HREL_LoanInsallments: number | string;
    HREL_LaonEMI: number | string;
    HREL_LoanStatus: string;
    HREL_SanctionedAmount: number;
    HREL_TotalPrincipalPaid: number;
    HREL_TotalInterestPaid: number;
    HREL_TotalPending: number;
    HREL_LoanInterest: number;
    HREL_ModeOfPayment: string;
    HREL_ReferenceNo: string | number;
    HREL_ActiveFlag: boolean;
    HREL_NoofInstallment?: number;
    CreatedDate?: string;
    UpdatedDate?: string;
}

// Earning/Deduction Item from API
export interface EarningDeductionItem {
    hresD_Id: number;
    hreS_Id: number;
    hrmeD_Id: number;
    hrmeD_Order: number;
    hresD_Amount: number;
    hrmeD_Name: string;
    hrmeD_EarnDedFlag: string;
    hreS_Year: string | null;
    hrmE_Id: number;
    hreS_Month: string | null;
}

// Employee Details Response (from employees_loan_by_employee_id)
export interface EmployeeDetailsResponse {
    empEarningsDeduction: EarningDeductionItem[];
    empGrossSalary: number;
}

// Configuration Details
export interface ConfigurationDetails {
    HRC_Id: number;
    MI_Id: number;
    HRC_PFMaxAmt: number;
    HRC_FPFPer: number;
    HRC_EPFPer: number;
    HRC_AsPerEmpFlag: boolean;
    HRC_PFAccNoPrefix: string;
    HRC_AccNo2: number;
    HRC_AccNo21: number;
    HRC_AccNo22: number;
    HRC_RetirementYrs: number;
    HRC_ECodePrefix: string;
    HRC_ESIMax: number;
    HRC_ESIEmplrCont: number;
    HRC_PayMethodFlg: string;
    HRC_ArrSalaryFlag: boolean;
    HRC_CummArrFlag: boolean;
    HRC_SalaryFromDay: number;
    HRC_SalaryToDay: number;
    HRC_ARTFPFPer: number;
    HRC_ARTEPFPer: number;
    HRC_ESIMaxAmount: number;
    HRC_AC2MinAmount: number;
    HRC_AC21MinAmount: number;
    HRC_AC22MinAmount: number;
    HRC_SalAdvApprovalFlg: boolean;
    HRC_LoanApprovalFlg: boolean;
    HRC_LeaveApprovalFlg: boolean;
    HRC_IncrementApprovalFlg: boolean;
    HRC_ProbationApprovalFlg: boolean;
    HRC_SalApprovalFlg: boolean;
    HRC_EducationCess: number;
    roleId?: number | null;
    retrunMsg?: string | null;
    HRC_partAmaxflag?: number;
    HRC_partBmaxflag?: number;
    HRC_IncrementMonth?: string;
    HRC_MinimumWorkingPeriod?: number;
    HRC_FixedIncrmentFlg?: boolean;
    HRC_NoOfOptionalHolidays?: number;
    HRC_IncrementOnceInMonths?: number;
    HRC_AlertDay?: number;
}

// Masters/Dropdowns Response (Legacy Onload)
export interface EmployeeLoanMastersResponse {
    employeedropdown: EmployeeDropdown[];
    masterloandropdown: MasterLoanDropdown[];
    modeOfPaymentdropdown: ModeOfPaymentDropdown[];
    configurationDetails: ConfigurationDetails | null;
    ASMAY_Id: number;
    roleId: number;
    retrunMsg: string;
}

// Grid Response
export interface EmployeeLoanGridResponse {
    emploanList: EmployeeLoanItem[];
    total: number;
    page: number;
    page_size: number;
}

// Combined Onload Response (for backward compatibility if needed, or specific hooks)
export interface EmployeeLoanOnloadResponse extends EmployeeLoanMastersResponse {
    emploanList: EmployeeLoanItem[] | null; // Can be null if using separate grid call

    // Flattened fields possibly returned by legacy Facade
    HREL_Id?: number;
    MI_Id?: number;
    HRME_Id?: number;
    HREL_AppliedDate?: string | null;
    HREL_EmpLoanId?: string | null;
    HRMLN_Id?: number;
    HREL_LoanAmount?: number | null;
    HREL_LoanInsallments?: number | null;
    HREL_LaonEMI?: number | null;
    HREL_LoanStatus?: string | null;
    HREL_SanctionedAmount?: number | null;
    HREL_TotalPrincipalPaid?: number | null;
    HREL_TotalInterestPaid?: number | null;
    HREL_TotalPending?: number | null;
    HREL_LoanInterest?: number | null;
    HREL_ModeOfPayment?: string | null;
    HREL_ReferenceNo?: number | null;
    HREL_ActiveFlag?: boolean;
    empGrossSal?: number | null;
    HREL_NoofInstallment?: number;
    CreatedDate?: string | null;
    UpdatedDate?: string | null;
    hrmE_EmployeeFirstName?: string | null;
    HRML_LoanType?: string | null;
    transnumconfigsettings?: any | null;
}

// Onload Request
export interface EmployeeLoanOnloadRequest {
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
    roleId?: number;
}

// Save Request
export interface EmployeeLoanSaveRequest {
    HREL_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HREL_AppliedDate: string;
    HREL_EmpLoanId?: string;
    HRMLN_Id: number;
    HREL_LoanAmount: number;
    HREL_LoanInsallments: number | string;
    HREL_LaonEMI: number | string;
    HREL_LoanInterest: number;
    HREL_ModeOfPayment: string;
    HREL_ReferenceNo: string | number;
    ASMAY_Id?: number;
    HREL_LoanStatus?: string;
    HREL_SanctionedAmount?: number;
    HREL_TotalPrincipalPaid?: number;
    HREL_TotalInterestPaid?: number;
    HREL_TotalPending?: number;
    HREL_ActiveFlag?: boolean;
    HREL_NoofInstallment?: number;
    roleId?: number;
}

// Delete/Deactivate Request
export interface EmployeeLoanDeleteRequest {
    HREL_Id: number;
    MI_Id?: number;
    HREL_ActiveFlag?: boolean;
    roleId?: number;
}

export type EmployeeLoanSaveResponse = ApiResponse<EmployeeLoanOnloadResponse>;
