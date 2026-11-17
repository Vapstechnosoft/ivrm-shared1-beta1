// API Response interface
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Dropdown interfaces
export interface MonthDropdown {
    monthId: number;
    monthName: string;
}

export interface YearDropdown {
    yearId: number;
    yearName: string;
}

export interface EmployeeDropdown {
    HRME_Id: number;
    MI_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName: string | null;
    HRME_EmployeeLastName: string;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRMGT_Id: number;
}

export interface GroupTypeDropdown {
    HRMGT_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Code: string;
}

export interface DepartmentDropdown {
    HRMD_Id: number;
    HRMD_DepartmentName: string;
}

export interface DesignationDropdown {
    HRMDES_Id: number;
    HRMDES_DesignationName: string;
}

// Request interfaces
export interface SalarySlipOnloadRequest {
    MI_Id: number;
    LogInUserId: number;
}

export interface SalarySlipFilterRequest {
    MI_Id?: number;
    LogInUserId?: number;
    hreS_Year: string;
    hreS_Month: string;
    hrmdes_ids: string;
    hrmd_ids: string;
    hrmgt_ids: string;
}

export interface SalarySlipGenerateRequest {
    MI_Id?: number;
    hreS_Year: string;
    hreS_Month: string;
    empid: number[];
    hrmdeS_IdList: number[];
    hrmD_IdList: number[];
    groupTypeIdList: number[];
}

// Response interface (matches the API response structure)
export interface SalarySlipResponse {
    HRES_Id: number;
    MI_Id: number;
    HRME_Id: number;
    userid: number;
    HRES_Year: string | null;
    HRES_Month: string | null;
    HRES_QRCode: string | null;
    abc: any;
    HRES_WorkingDays: number | null;
    HRES_DailyRates: number | null;
    HRELT_TotDays: number | null;
    HRES_EPF: number | null;
    HRES_FPF: number | null;
    HRES_Ac21: number | null;
    HRES_Ac22: number | null;
    HRES_Ac5: number | null;
    HRES_FromDate: string | null;
    HRES_ToDate: string | null;
    HRES_ArrearRegFlag: boolean | null;
    HRES_BankCashFlag: boolean | null;
    HRMGT_Id: number | null;
    HRMD_Id: number | null;
    HRMDES_Id: number | null;
    HRES_BankCode: string | null;
    HRES_AccountNo: string | null;
    HRES_ESIEmplr: number | null;
    HRME_Age: number | null;
    HRME_EmployeeOrder: number | null;
    basicamount: number | null;
    check_role: string | null;
    roleId: number | null;
    retrunMsg: string | null;
    monthdropdown: MonthDropdown[] | null;
    employeetype: any;
    employeedropdown: EmployeeDropdown[] | null;
    leaveyeardropdown: YearDropdown[] | null;
    departmentdropdown: DepartmentDropdown[] | null;
    designationdropdown: DesignationDropdown[] | null;
    groupTypedropdownlist: GroupTypeDropdown[] | null;
    departmentdropdownlist: DepartmentDropdown[] | null;
    designationdropdownlist: DesignationDropdown[] | null;
    ReportData: any;
    hrmgT_IdList: number[] | null;
    employeeTypeIdList: number[] | null;
    hrmD_IdList: number[] | null;
    hrmdeS_IdList: number[] | null;
    LogInUserId: number;
    masterEmployeeList: any;
    employeeDetails: any;
    configurationDetails: any;
    institutionDetails: any;
    currentemployeeDetails: any;
    DepartmentName: string | null;
    DesignationName: string | null;
    GenderName: string | null;
    HRME_FatherName: string | null;
    NetAmountInwords: string | null;
    employeeSalaryslipDetails: any;
    groupTypedropdown: GroupTypeDropdown[] | null;
    groupTypeIdList: number[] | null;
    CumulativeSalaryReportDTO: any;
    headList: any;
    LopAmount: number | null;
    Lopdays: number | null;
    HRME_EPFNotApplicableFlg: boolean | null;
    HRME_RetiredFlg: boolean | null;
    HRME_FPFNotApplicableFlg: boolean | null;
    employeeLeaveDetails: any;
    empsaldetail: any;
    PayrollStandard: any;
    EmailSMS: any;
    hrmE_EmployeeCode: string | null;
    TemplateString: string | null;
    Template: any;
    employe: any;
    earningdeductiondetails: any;
    empid: number[] | null;
    main_list: any;
    empGrossSal: number | null;
    HRESD_Amount: number | null;
    comm: any;
    columnnames: any;
    totalworkingdays: number | null;
    filldata: any;
    MonthList: any;
    PensionFund: any;
    salarySlipList?: any[] | null;
    totalEmployees?: number | null;
    month?: string | null;
    year?: string | null;
}

// Type exports
export type SalarySlipOnloadResponse = ApiResponse<SalarySlipResponse>;
export type SalarySlipFilterResponse = ApiResponse<SalarySlipResponse>;
export type SalarySlipGenerateResponse = ApiResponse<SalarySlipResponse>;

