// Salary Updation Types

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Salary Updation Item
export interface SalaryUpdationItem {
    HRESU_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRESU_OldSalary: number;
    HRESU_NewSalary: number;
    HRESU_EffectiveDate: string;
    HRESU_Remarks?: string;
    HRESU_ActiveFlag: boolean;
    CreatedDate?: string;
    UpdatedDate?: string;
}

// Employee Dropdown
export interface EmployeeDropdown {
    HRME_Id: number;
    MI_Id: number;
    HRMET_Id: number;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRMG_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string | null;
    HRME_EmployeeLastName?: string | null;
    HRME_BiometricCode?: string | null;
    HRME_RFCardId?: string | null;
    HRME_PerStreet?: string | null;
    HRME_PerArea?: string | null;
    HRME_PerCity?: string | null;
    HRME_PerAdd4?: string | null;
    HRME_PerStateId?: number | null;
    HRME_PerCountryId?: number | null;
    HRME_PerPincode?: number | null;
    HRME_LocStreet?: string | null;
    HRME_LocArea?: string | null;
    HRME_LocCity?: string | null;
    HRME_LocAdd4?: string | null;
    HRME_LocStateId?: number | null;
    HRME_LocCountryId?: number | null;
    HRME_LocPincode?: number | null;
    IVRMMMS_Id?: number;
    IVRMMG_Id?: number;
    CasteCategoryId?: number;
    CasteId?: number;
    ReligionId?: number;
    HRME_FatherName?: string | null;
    HRME_MotherName?: string | null;
    HRME_SpouseName?: string | null;
    HRME_SpouseOccupation?: string | null;
    HRME_SpouseMobileNo?: number;
    HRME_SpouseEmailId?: string;
    HRME_SpouseAddress?: string | null;
    HRME_DOB?: string;
    HRME_DOJ?: string;
    HRME_ExpectedRetirementDate?: string;
    HRME_PFDate?: string | null;
    HRME_ESIDate?: string | null;
    HRME_MobileNo?: number;
    HRME_EmailId?: string;
    HRME_BloodGroup?: string | null;
    HRME_PaymentType?: string;
    HRME_BankAccountNo?: string | null;
    HRME_PFApplicableFlag?: boolean;
    HRME_PFMaxFlag?: boolean;
    HRME_PFFixedFlag?: boolean;
    HRME_PFAccNo?: string | null;
    HRME_ESIAccNo?: string | null;
    HRME_GratuityAccNo?: string | null;
    HRME_ESIApplicableFlag?: boolean | null;
    HRME_Photo?: string | null;
    HRME_LeftFlag?: boolean;
    HRME_DOL?: string | null;
    HRME_LeavingReason?: string | null;
    HRME_Height?: number | null;
    HRME_HeightUOM?: string | null;
    HRME_Weight?: number | null;
    HRME_WeightUOM?: string | null;
    HRME_IdentificationMark?: string | null;
    HRME_ApprovalNo?: string | null;
    HRME_PANCardNo?: string | null;
    HRME_AadharCardNo?: number | null;
    HRME_SubstituteFlag?: boolean;
    HRME_NationalSSN?: string | null;
    HRME_SalaryType?: string | null;
    HRME_EmployeeOrder?: number;
    HRME_ActiveFlag?: boolean;
    HRME_UINumber?: string | null;
    HRME_doc?: any | null;
    HRME_SubjectsTaught?: string | null;
    HRME_AppDownloadedDeviceId?: string | null;
    HRME_PHDResearchGuideFlg?: boolean | null;
    HRME_TechNonTeachingFlg?: string;
    HRME_RGRecognitionYear?: number | null;
    HRME_AnyHealthIssue?: string | null;
    HRME_EyeSightIssue?: string | null;
    HRME_TransfferedTo?: string | null;
    HRME_RecordTransferredFlg?: boolean | null;
    HRME_MSTeamsUserId?: string | null;
    HRME_MSTeamsEmailId?: string;
    HRME_MSTeamsPassword?: string;
    HRME_ExcPunch?: boolean;
    HRME_RetiredFlg?: boolean;
    HRME_PensionStoppedDate?: string | null;
    HRME_FPFNotApplicableFlg?: boolean | null;
    HRME_EPFNotApplicableFlg?: boolean | null;
    HRME_AllowSoftwareAccessFlg?: boolean | null;
    CreatedDate?: string;
    UpdatedDate?: string;
    // Mapped properties from Search API
    earningResult?: EarningResultItem[];
    deductionResult?: DeductionResultItem[];
}

// Department Dropdown
export interface DepartmentDropdown {
    HRMD_Id: number;
    MI_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Order: number;
    HRMD_ActiveFlag: boolean;
    HRMDC_ID?: number | null;
    HRMD_InternalTrainingMinimumHrs?: number;
    CreatedDate?: string;
    UpdatedDate?: string;
}

// Designation Dropdown
export interface DesignationDropdown {
    HRMDES_Id: number;
    MI_Id: number;
    HRMDES_DesignationName: string;
    HRMDES_BasicAmount?: number;
    HRMDES_SanctionedSeats?: number;
    HRMDES_DisplaySanctionedSeatsFlag?: boolean;
    HRMDES_Order?: number;
    HRMDES_ActiveFlag?: boolean;
    HRMDC_ID?: number | null;
    CreatedDate?: string;
    UpdatedDate?: string;
}

// Group Type Dropdown
export interface GroupTypeDropdown {
    HRMGT_Id: number;
    MI_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Code?: string;
    HRMGT_Order?: number;
    HRMGT_ActiveFlag?: boolean;
    CreatedDate?: string;
    UpdatedDate?: string;
}

// Employee Type Dropdown
export interface EmployeeTypeDropdown {
    HRMET_Id: number;
    MI_Id: number;
    HRMET_EmployeeType: string;
    HRMET_Code?: string;
    HRMET_Order?: number;
    HRMET_ActiveFlag?: boolean;
    CreatedDate?: string;
    UpdatedDate?: string;
}

// Head Dropdown
export interface HeadDropdown {
    HRMED_Id: number;
    HRMED_Name: string;
    HRMED_EDTypeFlag?: string;
    HRMED_EarnDedFlag?: string;
    HRMED_AmountPercentFlag?: string;
    [key: string]: any;
}

// Earning Dropdown
export interface EarningDropdown {
    HRMED_Id: number;
    HRMED_Name: string;
    HRMED_EDTypeFlag?: string;
    HRMED_EarnDedFlag?: string;
    HRMED_AmountPercentFlag?: string;
    [key: string]: any;
}

// Deduction Dropdown
export interface DeductionDropdown {
    HRMED_Id: number;
    HRMED_Name: string;
    HRMED_EDTypeFlag?: string;
    HRMED_EarnDedFlag?: string;
    HRMED_AmountPercentFlag?: string;
    [key: string]: any;
}

// Month Dropdown
export interface MonthDropdown {
    IVRM_Month_Id: number;
    IVRM_Month_Name: string;
    Is_Active?: boolean;
    IVRM_Month_Max_Days?: number;
}

// Leave Year Dropdown
export interface LeaveYearDropdown {
    HRMLY_Id: number;
    MI_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_FromDate?: string;
    HRMLY_ToDate?: string;
    HRMLY_ActiveFlag?: boolean;
    HRMLY_LeaveYearOrder?: number;
    CreatedDate?: string;
    UpdatedDate?: string;
}

// Onload Response
export interface SalaryUpdationOnloadResponse {
    MI_Id: number | null;
    retrunMsg: string | null;
    roleId: number | null;
    HRME_Id: number | null;
    employeedropdown: EmployeeDropdown[] | null;
    departmentdropdown: DepartmentDropdown[] | null;
    designationdropdown: DesignationDropdown[] | null;
    employeeTypedropdown: EmployeeTypeDropdown[] | null;
    groupTypedropdown: GroupTypeDropdown[] | null;
    headdropdown: HeadDropdown[] | null;
    earningdropdown: EarningDropdown[] | null;
    detectiondropdown: DeductionDropdown[] | null;
    monthdropdown?: MonthDropdown[] | null;
    leaveyeardropdown?: LeaveYearDropdown[] | null;
    [key: string]: any; // Allow additional fields
}

// Onload Request
export interface SalaryUpdationOnloadRequest {
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
    roleId?: number;
}

// Save Request
export interface SalaryUpdationSaveRequest {
    HRESU_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HRESU_OldSalary: number;
    HRESU_NewSalary: number;
    HRESU_EffectiveDate: string;
    HRESU_Remarks?: string;
    HRESU_ActiveFlag: boolean;
    roleId: number;
}

// Save Response
export interface SalaryUpdationSaveResponse extends SalaryUpdationOnloadResponse {
    HRESU_Id?: number;
}

// Delete Request
export interface SalaryUpdationDeleteRequest {
    HRESU_Id: number;
    roleId: number;
}

// Filter/Search Request
export interface SalaryUpdationFilterRequest {
    MI_Id?: number;
    LogInUserId?: number;
    designationselected?: number[];
    departmentselected?: number[];
    groupTypeselected?: number[];
    headselected?: number[];
}

// Earning Result Item
export interface EarningResultItem {
    HREED_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HRMED_Id: number;
    HREED_Amount: number;
    HREED_Percentage: string;
    HREED_ActiveFlag: boolean;
    HREED_MaxApplicableFlg: boolean;
    HREED_ApplicableMaxValue: number;
}

// Deduction Result Item
export interface DeductionResultItem {
    HREED_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HRMED_Id: number;
    HREED_Amount: number;
    HREED_Percentage: string;
    HREED_ActiveFlag: boolean;
    HREED_MaxApplicableFlg: boolean;
    HREED_ApplicableMaxValue: number;
}

// Get Employee Details By Selection Request
export interface SalaryUpdationEmployeeDetailsRequest {
    earningresult?: EarningResultItem[];
    deductionresult?: DeductionResultItem[];
    LogInUserId?: number;
}

// Get Employee Details By Selection Response
export interface SalaryUpdationEmployeeDetailsResponse {
    MI_Id?: number | null;
    retrunMsg?: string | null;
    roleId?: number | null;
    employeedropdown?: EmployeeDropdown[] | null;
    departmentdropdown?: DepartmentDropdown[] | null;
    designationdropdown?: DesignationDropdown[] | null;
    employeeTypedropdown?: any[] | null;
    groupTypedropdown?: GroupTypeDropdown[] | null;
    headdropdown?: HeadDropdown[] | null;
    earningdropdown?: EarningDropdown[] | null;
    detectiondropdown?: DeductionDropdown[] | null;
    monthdropdown?: MonthDropdown[] | null;
    leaveyeardropdown?: LeaveYearDropdown[] | null;
    [key: string]: any; // Allow additional fields
}

// Get Departments Request
export interface SalaryUpdationDepartmentRequest {
    MI_Id?: number;
    hrmgT_IdList?: number[];
}

// Get Departments Response
export interface SalaryUpdationDepartmentResponse {
    departmentdropdown?: DepartmentDropdown[] | null;
    [key: string]: any; // Allow additional fields
}

// Get Designations Request
export interface SalaryUpdationDesignationRequest {
    MI_Id?: number;
    hrmgT_IdList?: number[];
    hrmD_IdList?: number[];
}

// Get Designations Response
export interface SalaryUpdationDesignationResponse {
    designationdropdown?: DesignationDropdown[] | null;
    [key: string]: any; // Allow additional fields
}

// Update Request Item (Inner Object)
export interface SalaryUpdationUpdateItem {
    hreeD_Id: number;
    mI_Id: number;
    hrmE_Id: number;
    hrmeD_Id: number;
    hreeD_Amount: number;
    hreeD_Percentage: string;
    hreeD_ActiveFlag: boolean;
    hreeD_MaxApplicableFlg: boolean;
    hreeD_ApplicableMaxValue: number;
    updatedDate: string;
    hreeD_UpdatedBy: number;
    [key: string]: any;
}

// Update Request Payload
export interface SalaryUpdationUpdateRequest {
    earnings: SalaryUpdationUpdateItem[];
    deductions: SalaryUpdationUpdateItem[];
}

// Update Response
export interface SalaryUpdationUpdateResponse {
    success: boolean;
    message?: string;
    data?: any;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}
