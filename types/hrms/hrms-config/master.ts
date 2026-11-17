export interface IMasterBankList {
    hrmbD_Id: number;
    mI_Id: number;
    hrmbD_BankName: string;
    hrmbD_BankAccountNo: string;
    hrmbD_BankAddress: string;
    hrmbD_BranchName: string;
    hrmbD_IFSCCode: string;
    hrmbD_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterCourseList {
    hrmC_Id: number;
    mI_Id: number;
    hrmC_QulaificationName: string;
    hrmC_QualificationDesc: string;
    hrmC_DefaultQualFag: boolean;
    hrmC_ActiveFlag: boolean;
    hrmC_SpecialisationFlag: boolean;
    hrmC_Order: number;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterCourseSetOrderList {
    hrmC_Id: number;
    hrmC_QulaificationName: string;
    hrmC_Order: number;
}

export interface IMasterDepartmentList {
    hrmD_Id: number;
    mI_Id: number;
    hrmD_DepartmentName: string;
    hrmD_Order: number;
    hrmD_ActiveFlag: boolean;
    hrmD_InternalTrainingMinimumHrs: number;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterDepartmentSetOrderList {
    hrmD_Id: number;
    hrmD_DepartmentName: string;
    hrmD_Order: number;
}

export interface IMasterDesignationList {
    hrmdeS_Id: number;
    mI_Id: number;
    hrmdeS_DesignationName: string;
    hrmdeS_BasicAmount: number;
    hrmdeS_SanctionedSeats: number;
    hrmdeS_DisplaySanctionedSeatsFlag: boolean;
    hrmdeS_Order: number;
    hrmdeS_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterDesignationSetOrderList {
    hrmdeS_Id: number;
    hrmdeS_DesignationName: string;
    hrmdeS_Order: number;
}

export interface IMasterGenderList {
    ivrmmG_Id: number;
    mI_Id: number;
    ivrmmG_GenderName: string;
    ivrmmG_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterGradeList {
    hrmG_Id: number;
    mI_Id: number;
    hrmG_GradeName: string;
    hrmG_GradeDisplayName: string;
    hrmG_PayScaleRange: string;
    hrmG_PayScaleFrom: number;
    hrmG_IncrementOf: number;
    hrmG_PayScaleTo: number;
    hrmG_Order: number;
    hrmG_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterGradeSetOrderList {
    hrmG_Id: number;
    hrmG_GradeName: string;
    hrmG_Order: number;
}

export interface IMasterGroupTypeList {
    hrmgT_Id: number;
    mI_Id: number;
    hrmgT_EmployeeGroupType: string;
    hrmgT_Code: string;
    hrmgT_Order: number;
    hrmgT_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterGroupTypeSetOrderList {
    hrmgT_Id: number;
    hrmgT_EmployeeGroupType: string;
    hrmgT_Order: number;
}

export interface IMasterLeaveYearList {
    hrmlY_Id: number;
    mI_Id: number;
    hrmlY_LeaveYear: string;
    hrmlY_FromDate: string;
    hrmlY_ToDate: string;
    hrmlY_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterLeaveYearSetOrderList {
    hrmlY_Id: number;
    hrmlY_LeaveYear: string;
    hrmlY_LeaveYearOrder: number;
}

export interface IMasterMaritalStatusList {
    ivrmmmS_Id: number;
    mI_Id: number;
    ivrmmmS_MaritalStatus: string;
    ivrmmmS_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterProfessionalTaxList {
    hrmpT_Id: number;
    mI_Id: number;
    hrmpT_SalaryFrom: number;
    hrmpT_SalaryTo: number;
    hrmpT_PTax: number;
    hrmpT_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterEmployeeTypeList {
    hrmeT_Id: number;
    mI_Id: number;
    hrmeT_EmployeeType: string;
    hrmeT_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterSpecializationList {
    hrmspL_Id: number;
    mI_Id: number;
    hrmspL_SpecialisationName: string;
    hrmspL_ActiveFlg: boolean;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterLoanList {
    hrmlN_Id: number;
    mI_Id: number;
    hrmL_LoanType: string;
    hrmL_Max: number;
    hrmlN_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}

// Attendance Management Masters

export interface IMasterEarningsDeductionsList {
    hrmeD_Id: number;
    mI_Id: number;
    hrmeD_Name: string;
    hrmeD_EDTypeFlag: string;
    hrmeD_EarnDedFlag: string;
    hrmeD_AmountPercentFlag: string;
    hrmeD_AmountPercent: string;
    hrmeD_ActiveFlag: boolean;
    hrmeD_RoundOffFlag: string;
    hrmeD_Order: number;
    hrmeD_ReviseFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterGroupDeptDessgMappingList {
    hrgtddS_Id: number;
    mI_Id: number;
    hrmgT_Id: number;
    hrmD_Id: number;
    hrmdeS_Id: number;
    hrgtddS_ActiveFlg: boolean;
    hrmgT_EmployeeGroupType: string;
    hrmD_DepartmentName: string;
    hrmdeS_DesignationName: string;
    hrgtddS_CreatedDate?: string;
    hrgtddS_UpdatedDate?: string;
}

export interface IMasterReligionCategoryMappingList {
    ircC_Id: number;
    mI_Id: number;
    userId: number;
    ivrmmR_Id: number;
    imcC_Id: number;
    ircC_ActiveFlg: boolean;
    ivrmmR_Name: string;
    imcC_CategoryName: string;
    ircC_CreatedDate?: string | null;
    ircC_UpdatedDate?: string | null;
}

export interface IMasterPayrollStandardList {
    hrC_Id: number;
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
    hrC_partAmaxflag: number;
    hrC_partBmaxflag: number;
    hrC_IncrementMonth: string;
    hrC_MinimumWorkingPeriod: number;
    hrC_FixedIncrmentFlg: boolean;
    hrC_NoOfOptionalHolidays: number;
    hrC_IncrementOnceInMonths: number;
    hrC_AlertDay: number;
}

// Dropdown Interfaces for Master Forms
export interface IEarningsDeductionsTypeDropdown {
    key: string;
    value: string;
}

export interface IRoundingTypeDropdown {
    key: string;
    value: string;
}

export interface IAmountOrPercentageDropdown {
    key: string;
    value: string;
}

export interface ISalaryComponentTypeDropdown {
    key: string;
    value: string;
}

//Month Dropdown
export interface IMonthDropdown {
    key: number;
    value: string;
}
