/**
 * Request interface for PF Form 5 Report onload
 */
export interface PFForm5ReportOnloadRequest {
    MI_Id: number;
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

export interface EmployeeDropdown {
    HRME_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    [key: string]: any;
}

/**
 * Response interface for PF Form 5 Report onload
 */
export interface PFForm5ReportOnloadResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    HRME_EmployeeCode: string | null;
    HRME_EPFNotApplicableFlg: boolean | null;
    HRME_RetiredFlg: boolean | null;
    HRME_FPFNotApplicableFlg: boolean | null;
    HRME_PensionStoppedDate: string | null;
    HRES_WorkingDays: number | null;
    departmentname: string | null;
    employeedropdown: EmployeeDropdown[] | null;
    leaveyeardropdown: LeaveYearDropdown[] | null;
    monthdropdown: MonthDropdown[] | null;
    HRME_Age: number;
    HRME_Id: number;
    HRES_Year: string | null;
    HRES_Month: string | null;
    FromDate: string | null;
    ToDate: string | null;
    getpfgriddata: any;
    pfreport: any;
    employeeDetails: any;
    contactnum: string | null;
    institutionDetails: any;
    MI_Name: string | null;
    MI_Address1: string | null;
    finYearFromDate: string | null;
    finYearToDate: string | null;
    HeadType: string | null;
    PFVPFflag: string | null;
    DepositWithdrow: string | null;
    Remark: string | null;
    IMFY_Id: number;
    IVRM_Month_Id: number;
    UserId: number;
    TransAmount: number | null;
    Schoolamount: number | null;
    Procedure: string | null;
    Flag: string | null;
    EmployeePFreportDetails: any;
    TransactionID: number;
    STJOwnPF: number | null;
    HRESD_Id: number;
    HRMED_Id: number;
    HRMED_Name: string | null;
    HRESD_Amount: number | null;
    HRME_DOJ: string | null;
    AmountofWages: number | null;
    PFAmount: number | null;
    HRES_Id: number;
    HRES_EPF: number | null;
    HRES_FPF: number | null;
    VPFAmount: number | null;
    PayrollStandard: string | null;
    HRC_RetirementYrs: number | null;
    FatherHusbandName: string | null;
    HRME_PFAccNo: string | null;
    HRME_FatherName: string | null;
    HRME_EmployeeFirstName: string | null;
    HRME_EmployeeMiddleName: string | null;
    HRME_EmployeeLastName: string | null;
    HRME_DOL: string | null;
    HRME_LeavingReason: string | null;
    HRME_PFDate: string | null;
    HRME_DOB: string | null;
    IVRMMG_GenderName: string | null;
    TotalServicePeriod: string | null;
    HRES_Ac21: number | null;
    HRES_Ac22: number | null;
    HRES_Ac5: number | null;
    HRES_Ac10: number | null;
    HRMED_EDTypeFlag: string | null;
    bankdetails: any;
    professionaltaxamount: number | null;
    HRME_PFuAN: string | null;
    empGrossSal: number | null;
    netsalary: number | null;
    groupTypeIdList: number[] | null;
    hrmgT_IdList: number[] | null;
    employeeTypeIdList: number[] | null;
    hrmD_IdList: number[] | null;
    hrmdeS_IdList: number[] | null;
    abc: number;
    currentemployeeDetails: any;
    employee: any;
    H_DOB: string | null;
    H_Month: number;
    basicamount: number;
    DAamount: number;
    Othersamount: number;
    emptotdedSal: number | null;
    basicvalue: number | null;
    davalue: number | null;
    HRMS_Age: number;
    HRMPFVPFINT_Id: number;
    HRMPFVPFINT_PFInterestRate: number;
    HRMPFVPFINT_VPFInterestRate: number;
    HRMPFVPFINT_ActiveFlg: boolean;
    HRMPFVPFINT_RecalculationConsentFlg: boolean;
    HRMPFVPFINT_ApplicableDate: string;
    HRMPFVPFINT_CreatedDate: string;
    HRMPFVPFINT_UpdatedDate: string;
    HRMPFVPFINT_CreatedBy: number;
    HRMPFVPFINT_UpdatedBy: number;
    returnduplicatestatus: string | null;
    returnval: boolean;
    message: string | null;
    get_store: any;
    IMFY_FinancialYear: string | null;
    vpfTranaction: any;
    pfTranaction: any;
}

/**
 * Request interface for PF Form 5 Report filter
 */
export interface PFForm5ReportFilterRequest {
    MI_Id: number;
}

/**
 * Response interface for PF Form 5 Report filter
 * Typically returns employee dropdown data or filtered employee list
 */
export interface PFForm5ReportFilterResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    employeedropdown?: EmployeeDropdown[] | null;
    employeeDetails?: any[] | null;
    [key: string]: any;
}

/**
 * Request interface for PF Form 5 Report search
 */
export interface PFForm5ReportSearchRequest {
    MI_Id: number;
    HRES_Month: string;
    HRES_Year: string;
}

/**
 * Response interface for PF Form 5 Report search
 * Typically returns PF Form 5 data for selected month and year
 */
export interface PFForm5ReportSearchResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    employeeDetails?: any[];
    getpfgriddata?: any[];
    pfreport?: any;
    [key: string]: any;
}
