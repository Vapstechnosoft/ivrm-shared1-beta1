// Employee Advance Report Types

export interface EmployeeAdvanceReportOnloadRequest {
    MI_Id: number;
    LogInUserId: number;
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
    HRC_SalAdvApprovalFlg: boolean | null;
    HRC_LoanApprovalFlg: boolean | null;
    HRC_LeaveApprovalFlg: boolean | null;
    HRC_IncrementApprovalFlg: boolean | null;
    HRC_ProbationApprovalFlg: boolean | null;
    HRC_SalApprovalFlg: boolean | null;
    HRC_EducationCess: number;
    roleId: number;
    retrunMsg: string | null;
    hrStandardList: any | null;
    monthdropdown: any | null;
    HRC_partAmaxflag: number;
    HRC_partBmaxflag: number;
    HRC_IncrementMonth: string;
    HRC_MinimumWorkingPeriod: number;
    HRC_FixedIncrmentFlg: boolean | null;
    HRC_NoOfOptionalHolidays: number;
    HRC_IncrementOnceInMonths: number;
    HRC_AlertDay: number;
}

export interface InstitutionDetails {
    MI_Id: number;
    MI_Name: string;
    MI_Address1: string;
    MI_Address2: string;
    MI_Address3: string;
    [key: string]: any;
}

export interface EmployeeAdvanceReportOnloadResponse {
    MI_Id: number;
    roleId: number;
    LogInUserId: number;
    monthdropdown: MonthDropdown[];
    institutionDetails: InstitutionDetails | null;
    leaveyeardropdown: LeaveYearDropdown[];
    employeeSalaryslipDetails: any | null;
    departmentdropdown: DepartmentDropdown[];
    designationdropdown: DesignationDropdown[];
    hrmgT_IdList: number[] | null;
    employeeTypeIdList: number[] | null;
    hrmD_IdList: number[] | null;
    hrmdeS_IdList: number[] | null;
    groupTypedropdown: GroupTypeDropdown[];
    configurationDetails: ConfigurationDetails;
    hrmE_EmployeeFirstName: string | null;
    hrme_employeecode: string | null;
    HRESA_AdvMonth: string | null;
    HRESA_AdvYear: number;
    HRESA_EntryDate: string;
    HRESA_AppliedAmount: number | null;
    CreatedDate: string | null;
    UpdatedDate: string | null;
}

export interface EmployeeAdvanceReportSearchRequest {
    MI_Id: number;
    hrmD_IdList: number[];
    hrmdeS_IdList: number[];
    HRESA_AdvYear: number;
    HRESA_AdvMonth: string;
}

export interface EmployeeAdvanceDetails {
    HRESA_Id: number;
    HRME_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName: string | null;
    HRME_EmployeeLastName: string | null;
    HRMD_DepartmentName: string;
    HRMDES_DesignationName: string;
    HRMGT_EmployeeGroupType: string;
    HRESA_AdvMonth: string;
    HRESA_AdvYear: number;
    HRESA_AppliedAmount: number;
    HRESA_ApprovedAmount: number;
    HRESA_RecoveredAmount: number;
    HRESA_RemainingAmount: number;
    HRESA_Status: string;
    HRESA_AdvanceType: string;
    HRESA_Reason: string;
    HRESA_ApprovalDate: string | null;
    HRESA_ApprovedBy: string | null;
    HRESA_RecoveryStartDate: string | null;
    HRESA_RecoveryEndDate: string | null;
    HRESA_TotalInstallments: number;
    HRESA_InstallmentAmount: number;
    HRME_BasicSalary: number;
    [key: string]: any;
}

export interface EmployeeAdvanceReportSearchResponse {
    employeeDetails: EmployeeAdvanceDetails[];
    [key: string]: any;
}
