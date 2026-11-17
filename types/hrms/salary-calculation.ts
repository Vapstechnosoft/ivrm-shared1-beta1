// Salary Calculation Types

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Onload Request
export interface SalaryCalculationOnloadRequest {
    MI_Id: number;
    LogInUserId: number;
}

// Onload Response
export interface SalaryCalculationOnloadResponse {
    HRES_Id: number | null;
    MI_Id: number | null;
    HRME_Id: number | null;
    userid: number | null;
    HRES_Year: string | null;
    HRES_Month: string | null;
    HRES_QRCode: string | null;
    abc: string | null;
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
    HRES_BankCashFlag: string | null;
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
    employeetype: string | null;
    employeedropdown: EmployeeDropdown[] | null;
    leaveyeardropdown: LeaveYearDropdown[] | null;
    departmentdropdown: DepartmentDropdown[] | null;
    designationdropdown: DesignationDropdown[] | null;
    groupTypedropdownlist: GroupTypeDropdown[] | null;
    departmentdropdownlist: DepartmentDropdown[] | null;
    designationdropdownlist: DesignationDropdown[] | null;
    ReportData: any | null;
    hrmgT_IdList: number[] | null;
    employeeTypeIdList: number[] | null;
    hrmD_IdList: number[] | null;
    hrmdeS_IdList: number[] | null;
    LogInUserId: number | null;
    masterEmployeeList: any | null;
    employeeDetails: any | null;
    configurationDetails: ConfigurationDetails | null;
    institutionDetails: any | null;
    currentemployeeDetails: any | null;
    DepartmentName: string | null;
    DesignationName: string | null;
    GenderName: string | null;
    HRME_FatherName: string | null;
    NetAmountInwords: string | null;
    employeeSalaryslipDetails: any | null;
    groupTypedropdown: GroupTypeDropdown[] | null;
    groupTypeIdList: number[] | null;
    CumulativeSalaryReportDTO: any | null;
    headList: any | null;
    LopAmount: number | null;
    Lopdays: number | null;
    HRME_EPFNotApplicableFlg: boolean | null;
    HRME_RetiredFlg: boolean | null;
    HRME_FPFNotApplicableFlg: boolean | null;
    employeeLeaveDetails: any | null;
    empsaldetail: any | null;
    PayrollStandard: any | null;
    EmailSMS: any | null;
    hrmE_EmployeeCode: string | null;
    TemplateString: string | null;
    Template: any | null;
    employe: any | null;
    earningdeductiondetails: any | null;
    empid: number | null;
    main_list: any | null;
    empGrossSal: number | null;
    HRESD_Amount: number | null;
    comm: any | null;
    columnnames: any | null;
    totalworkingdays: number | null;
    filldata: any | null;
    MonthList: any | null;
    PensionFund: any | null;
}

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
    CreatedDate: string;
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

export interface EmployeeDropdown {
    HRME_Id: number;
    MI_Id: number;
    HRMET_Id: number;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRMG_Id: number;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName: string | null;
    HRME_EmployeeLastName: string | null;
    HRME_EmployeeCode: string;
    HRME_ActiveFlag: boolean;
}

export interface ConfigurationDetails {
    hrC_Id: number;
    mI_Id: number;
    hrC_PFMaxAmt: number;
    hrC_FPFPer: number;
    hrC_EPFPer: number;
    hrC_AsPerEmpFlag: boolean;
    hrC_PFAccNoPrefix: string;
    hrC_AccNo2: number;
    hrC_AccNo21: number;
    hrC_AccNo22: number;
    hrC_RetirementYrs: number;
    hrC_ECodePrefix: string;
    hrC_ESIMax: number;
    hrC_ESIEmplrCont: number;
    hrC_PayMethodFlg: string;
    hrC_ArrSalaryFlag: boolean;
    hrC_CummArrFlag: boolean;
    hrC_SalaryFromDay: number;
    hrC_SalaryToDay: number;
    hrC_ARTFPFPer: number;
    hrC_ARTEPFPer: number;
    hrC_ESIMaxAmount: number;
    hrC_AC2MinAmount: number;
    hrC_AC21MinAmount: number;
    hrC_AC22MinAmount: number;
    hrC_SalAdvApprovalFlg: boolean;
    hrC_LoanApprovalFlg: boolean;
    hrC_LeaveApprovalFlg: boolean;
    hrC_IncrementApprovalFlg: boolean;
    hrC_ProbationApprovalFlg: boolean;
    hrC_SalApprovalFlg: boolean;
    hrC_EducationCess: number;
    roleId: number;
    retrunMsg: string | null;
    hrStandardList: any | null;
    monthdropdown: any | null;
    hrC_partAmaxflag: number;
    hrC_partBmaxflag: number;
    hrC_IncrementMonth: string | null;
    hrC_MinimumWorkingPeriod: number;
    hrC_FixedIncrmentFlg: boolean;
    hrC_NoOfOptionalHolidays: number;
    hrC_IncrementOnceInMonths: number;
    hrC_AlertDay: number;
}

// Search Request
export interface SalaryCalculationSearchRequest {
    MI_Id: number;
    HRES_Year: string;
    HRES_Month: string;
    groupTypeIdList: number[];
    hrmD_IdList: number[];
    hrmdeS_IdList: number[];
    LogInUserId: number;
}

// Generate Request
export interface SalaryCalculationGenerateRequest {
    MI_Id: number;
    HRES_Year: string;
    HRES_Month: string;
    employeeIdList: number[];
    LogInUserId: number;
}

// Generate Response
export interface SalaryCalculationGenerateResponse {
    success: boolean;
    message: string;
    processedCount: number;
    failedCount: number;
    processedEmployees: number[];
    failedEmployees: number[];
    retrunMsg: string;
}

// New Search Request based on user provided JSON
export interface NewSalaryCalculationSearchRequest {
    hreS_Year: string;
    hreS_Month: string;
    hrmdeS_IdList: number[];
    hrmD_IdList: number[];
    groupTypeIdList: number[];
}

// New Selection Employee interface
export interface SelectionEmployee {
    hrmE_Id: number;
    hrmE_FirstName: string;
    hrmE_MiddleName: string | null;
    hrmE_LastName: string | null;
    hrmE_DOJ: string;
    hrmE_DOL: string | null;
    hrmE_LeftFlag: boolean;
    hrmgT_Id: number;
    hrmD_Id: number;
    hrmdeS_Id: number;
    hrmE_EmployeeCode: string;
    hrmE_MobileNo: string | null;
    hrmE_EmailID: string | null;
    hrmE_EmployeeOrder: number | null;
}

// New Calculate/Generate Request
export interface NewSalaryCalculationGenerateRequest {
    hreS_Year: string;
    hreS_Month: string;
    comm: string;
    masterEmployeeList: {
        hrmE_Id: number;
        type: string;
        imC_Id: number;
    }[];
}
