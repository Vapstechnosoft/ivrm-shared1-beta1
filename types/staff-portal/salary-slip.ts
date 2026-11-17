
export interface ISalarySlipInitialData {
    leaveyeardropdown: ILeaveYear[];
    monthdropdown: IMonth[];
}

export interface ILeaveYear {
    hrmlY_Id: number;
    hrmlY_LeaveYear: string;
    Selected?: boolean;
}

export interface IMonth {
    ivrM_Month_Id: number;
    ivrM_Month_Name: string;
    Selected?: boolean;
}

export interface ISalarySlipRequest {
    HRES_Year: string;
    HRES_Month: string;
}

export interface ISalarySlipResponse {
    main_list: ISalarySlipMainItem[];
    check_role: string;
}

export interface ISalarySlipMainItem {
    employeeSalaryslipDetails: ISalarySlipDetail[];
    institutionDetails: IInstitutionDetails;
    currentemployeeDetails: IEmployeeDetails;
    empsaldetail: IEmployeeSalarySummary;
    payrollStandard: IPayrollStandard;
    lopAmount: number;
    employeeLeaveDetails: IEmployeeLeaveDetail[];
    esary: ISalaryPortion;
    dsary: ISalaryPortion;
    items: ISalarySlipLineItem[];
    totals: [number, number];
    NetSalary: number;
    NetAmountInwords: string;
    selectedMonth: string;
    selectedYear: string;
    departmentName: string;
    designationName: string;
    genderName: string;
    CurrentInstuteAddress: string;
}

export interface ISalarySlipDetail {
    HRMED_EarnDedFlag: 'Earning' | 'Deduction';
    HRMED_Name: string;
    Amount: number;
}

export interface IInstitutionDetails {
    mI_Name: string;
    mI_Logo: string;
    mI_Address1: string;
    mI_Address2: string;
    mI_Address3: string;
}

export interface IEmployeeDetails {
    hrmE_EmployeeCode: string;
    hrmE_EmployeeFirstName: string;
    hrmE_EmployeeMiddleName: string;
    hrmE_EmployeeLastName: string;
    hrmE_DOJ: string;
    hrmE_PANCardNo: string;
    hrmE_UINumber: string;
    hrmE_ESIAccNo: string;
    hrmE_PFApplicableFlag: boolean;
    hrmE_ESIApplicableFlag: boolean;
}

export interface IEmployeeSalarySummary {
    hreS_WorkingDays: number;
    hreS_BankCode: string;
    hreS_AccountNo: string;
    lopdays: number;
}

export interface IPayrollStandard {
    hrC_PayMethodFlg: string;
}

export interface IEmployeeLeaveDetail {
    hrmL_LeaveName: string;
    hrelS_TotalLeaves: number;
    hrelS_TransLeaves: number;
    hrelS_CBLeaves: number;
}

export interface ISalaryPortion {
    out: ISalarySlipLineItem[];
    sum: number;
}

export interface ISalarySlipLineItem {
    HRMED_Name: string;
    Amount: number;
    ds?: ISalarySlipLineItem;
}
