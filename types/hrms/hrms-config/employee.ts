// Dropdown Interfaces - All follow the key/value pattern from /api/MasterDropDown endpoints
export interface IGradeDropdown {
    key: number;
    value: string;
}

export interface IEmployeeTypeDropdown {
    key: number;
    value: string;
    hrmeT_Id?: number;
    hrmeT_EmployeeType?: string;
}

export interface IGroupTypeDropdown {
    key: number;
    value: string;
}

export interface IDepartmentDropdown {
    key: number;
    value: string;
    hrmD_Id?: number;
    hrmD_DepartmentName?: string;
    mI_Id?: number;
    hrmD_Order?: number;
    hrmD_ActiveFlag?: boolean;
}

export interface IDesignationDropdown {
    key: number;
    value: string;
}

export interface IGenderDropdown {
    key: number;
    value: string;
}

export interface IMaritalStatusDropdown {
    key: number;
    value: string;
}

export interface IReligionDropdown {
    key: number;
    value: string;
    ivrmmR_Id?: number;
    ivrmmR_Name?: string;
}

export interface ICasteCategoryDropdown {
    key: number;
    value: string;
}

export interface ICasteDropdown {
    key: number;
    value: string;
}

export interface IBankDropdown {
    key: number;
    value: string;
}

export interface ICountryDropdown {
    key: number;
    value: string;
}

export interface IStateDropdown {
    key: number;
    value: string;
}

export interface ICourseDropdown {
    key: number;
    value: string;
}

export interface ISpecializationDropdown {
    key: number;
    value: string;
}

export interface IInstitutionDropdown {
    key: number;
    value: string;
}

export interface IPaymentModeDropdown {
    key: string;
    value: string;
}

export interface ILeaveReasonDropdown {
    key: number;
    value: string;
}

export interface IBloodGroupDropdown {
    key: string;
    value: string;
}

export interface ISalaryTypeDropdown {
    key: string;
    value: string;
}

export interface ITeachingTypeDropdown {
    key: string;
    value: string;
}

export interface IScoreTypeDropdown {
    key: string;
    value: string;
}

export interface IContactTypeDropdown {
    key: string;
    value: string;
}

// Employee List Interface - matches API response from /api/EmployeeRegistration/GetEmployeeDetails
export interface IEmployeeList {
    hrmE_Id: number;
    mI_Id: number;
    hrmeT_Id: number;
    hrmgT_Id: number;
    hrmD_Id: number;
    hrmdeS_Id: number;
    hrmG_Id: number;
    hrmE_EmployeeFirstName: string;
    hrmE_EmployeeMiddleName: string | null;
    hrmE_EmployeeLastName: string;
    hrmE_EmployeeCode: string;
    hrmE_BiometricCode: string | null;
    hrmE_RFCardId: string | null;
    hrmE_PerStreet: string;
    hrmE_PerArea: string;
    hrmE_PerCity: string;
    hrmE_PerAdd4: string | null;
    hrmE_PerStateId: number;
    hrmE_PerCountryId: number;
    hrmE_PerPincode: number;
    hrmE_LocStreet: string;
    hrmE_LocArea: string;
    hrmE_LocCity: string;
    hrmE_LocAdd4: string | null;
    hrmE_LocStateId: number;
    hrmE_LocCountryId: number;
    hrmE_LocPincode: number;
    ivrmmmS_Id: number;
    ivrmmG_Id: number;
    casteCategoryId: number;
    casteId: number;
    religionId: number;
    hrmE_FatherName: string;
    hrmE_MotherName: string;
    hrmE_SpouseName: string | null;
    hrmE_SpouseOccupation: string | null;
    hrmE_SpouseMobileNo: number;
    hrmE_SpouseEmailId: string | null;
    hrmE_SpouseAddress: string | null;
    hrmE_DOB: string;
    hrmE_DOJ: string;
    hrmE_ExpectedRetirementDate: string;
    hrmE_PFDate: string;
    hrmE_ESIDate: string;
    hrmE_MobileNo: number;
    hrmE_EmailId: string;
    hrmE_BloodGroup: string;
    hrmE_PaymentType: string;
    hrmE_BankAccountNo: string | null;
    hrmE_PFApplicableFlag: boolean;
    hrmE_PFMaxFlag: boolean;
    hrmE_PFFixedFlag: boolean;
    hrmE_PFAccNo: string;
    hrmE_ESIAccNo: string;
    hrmE_GratuityAccNo: string;
    hrmE_ESIApplicableFlag: boolean;
    hrmE_Photo: string | null;
    hrmE_LeftFlag: boolean;
    hrmE_DOC: string | null;
    hrmE_DOL: string | null;
    hrmE_LeavingReason: string | null;
    hrmE_Height: string;
    hrmE_HeightUOM: string;
    hrmE_Weight: number;
    hrmE_WeightUOM: string;
    hrmE_IdentificationMark: string;
    hrmE_ApprovalNo: string | null;
    hrmE_PANCardNo: string;
    hrmE_AadharCardNo: number;
    hrmE_SubstituteFlag: boolean;
    hrmE_NationalSSN: string;
    hrmE_SalaryType: string;
    hrmE_EmployeeOrder: number;
    hrmE_ActiveFlag: boolean;
    hrmE_UINumber: string;
    hrmE_SubjectsTaught: string | null;
    hrmE_AppDownloadedDeviceId: string | null;
    hrmE_PHDResearchGuideFlg: boolean;
    hrmE_TechNonTeachingFlg: string;
    hrmE_RGRecognitionYear: number;
    hrmE_AnyHealthIssue: string;
    hrmE_EyeSightIssue: string;
    hrmE_TransfferedTo: number;
    hrmE_RecordTransferredFlg: boolean;
    hrmE_MSTeamsUserId: string | null;
    hrmE_MSTeamsEmailId: string | null;
    hrmE_MSTeamsPassword: string | null;
    hrmE_ExcPunch: boolean;
    hrmE_RetiredFlg: boolean;
    hrmE_PensionStoppedDate: string | null;
    hrmE_FPFNotApplicableFlg: boolean;
    hrmE_EPFNotApplicableFlg: boolean;
    hrmE_AllowSoftwareAccessFlg: boolean;
    createdDate: string;
    updatedDate: string;
}

// Employee Save Request/Response - Will be defined based on actual form payloads
// Basic Employee Details
export interface IEmployee {
    hrmE_Id: number;
    hrmeT_Id: number;
    hrmgT_Id: number;
    hrmD_Id: number;
    hrmdeS_Id: number;
    hrmG_Id: number;
    hrmE_EmployeeFirstName: string;
    hrmE_EmployeeMiddleName: string;
    hrmE_EmployeeLastName: string;
    hrmE_EmployeeCode: string;
    hrmE_BiometricCode: string;
    hrmE_RFCardId: string;
    hrmE_PerStreet: string;
    hrmE_PerArea: string;
    hrmE_PerCity: string;
    hrmE_PerAdd4: string;
    hrmE_PerStateId: number;
    hrmE_PerCountryId: number;
    hrmE_PerPincode: number;
    hrmE_LocStreet: string;
    hrmE_LocArea: string;
    hrmE_LocCity: string;
    hrmE_LocAdd4: string;
    hrmE_LocStateId: number;
    hrmE_LocCountryId: number;
    hrmE_LocPincode: number;
    ivrmmmS_Id: number;
    ivrmmG_Id: number;
    casteCategoryId: number;
    casteId: number;
    religionId: number;
    hrmE_FatherName: string;
    hrmE_MotherName: string;
    hrmE_SpouseName: string;
    hrmE_SpouseOccupation: string;
    hrmE_SpouseMobileNo: number;
    hrmE_SpouseEmailId: string;
    hrmE_SpouseAddress: string;
    hrmE_DOB: string;
    hrmE_DOJ: string;
    hrmE_ExpectedRetirementDate?: string;
    hrmE_PFDate?: string;
    hrmE_ESIDate?: string;
    hrmE_MobileNo: number;
    hrmE_EmailId: string;
    hrmE_BloodGroup: string;
    hrmE_PaymentType: string;
    hrmE_BankAccountNo: string;
    hrmE_PFApplicableFlag: boolean;
    hrmE_PFMaxFlag: boolean;
    hrmE_PFFixedFlag: boolean;
    hrmE_PFAccNo: string;
    hrmE_ESIAccNo: string;
    hrmE_GratuityAccNo: string;
    hrmE_ESIApplicableFlag: boolean;
    hrmE_Photo: string;
    hrmE_LeftFlag: boolean;
    hrmE_DOL?: string;
    hrmE_LeavingReason: string;
    hrmE_Height: string;
    hrmE_HeightUOM: string;
    hrmE_Weight: number;
    hrmE_WeightUOM: string;
    hrmE_IdentificationMark: string;
    hrmE_ApprovalNo: string;
    hrmE_PANCardNo: string;
    hrmE_AadharCardNo: number;
    hrmE_SubstituteFlag: boolean;
    hrmE_NationalSSN: string;
    hrmE_SalaryType: string;
    hrmE_EmployeeOrder: number;
    hrmE_ActiveFlag: boolean;
    hrmE_UINumber: string;
    hrmE_doc?: string;
    hrmE_SubjectsTaught: string;
    hrmE_AppDownloadedDeviceId: string;
    hrmE_PHDResearchGuideFlg: boolean;
    hrmE_TechNonTeachingFlg: string;
    hrmE_RGRecognitionYear: number;
    hrmE_AnyHealthIssue: string;
    hrmE_EyeSightIssue: string;
    hrmE_TransfferedTo: number;
    hrmE_RecordTransferredFlg: boolean;
    hrmE_MSTeamsUserId: string;
    hrmE_MSTeamsEmailId: string;
    hrmE_MSTeamsPassword: string;
    hrmE_ExcPunch: boolean;
    hrmE_RetiredFlg: boolean;
    hrmE_PensionStoppedDate?: string;
    hrmE_FPFNotApplicableFlg: boolean;
    hrmE_EPFNotApplicableFlg: boolean;
    hrmE_AllowSoftwareAccessFlg: boolean;
    // Aliases for validation requirements
    EmployeePhoto?: string;
    HrmeId?: number;
}

// Bank Request Details
export interface IBankRequestDetail {
    hrmeB_Id: number;
    hrmE_Id: number;
    hrmbD_Id: number;
    hrmeB_AccountNo: string;
    hrmeB_ActiveFlag: boolean;
}

// Bank Request Wrapper
export interface IBankRequest {
    mI_Id: number;
    hrmE_Id: number;
    bankDetails: IBankRequestDetail[];
}

// Combined Save Request
export interface IEmployeeSaveRequest {
    employee: IEmployee;
    bankRequest?: IBankRequest;
    trans_id?: string; // Optional transaction ID if needed
}

export interface IEmployeeQualification {
    hrmeQ_Id: number;
    hrmC_Id: number;
    hrmE_Id: number;
    hrmE_QualificationName: string;
    hrmeQ_CollegeName: string;
    hrmeQ_UniversityName: string;
    hrmeQ_YearOfPassing: number;
    hrmeQ_RegistrationNo: string;
    hrmeQ_Result: string;
    hrmeQ_CGPAOrPerFlag: string;
    hrmeQ_CGPA: string;
    hrmeQ_Percentage: string;
    hrmeQ_AreaOfSpecialisation: string;
    hrmeQ_MedicalCouncil: string;
    hrmeQ_Date: string;
    hrmeQ_Hardcopy: string;
    retrunMsg: string;
    hrmeQ_PHDFlg: boolean;
    hrmeQ_StateId: number;
    hrmeQ_CountryId: number;
    hrmeQ_ThesisTitle: string;
    hrmeQ_RegistrationYear: number;
    hrmeQ_GuideName: string;
}

export interface IEmployeeExperience {
    hrmeE_Id: number;
    hrmE_Id: number;
    hrmeE_OrganisationName: string;
    hrmeE_OrganisationAddress: string;
    hrmeE_Department: string;
    hrmeE_Designation: string;
    hrmeE_JoinDate: string;
    hrmeE_ExitDate: string;
    hrmeE_NoOfYears: number;
    hrmeE_NoOfMonths: number;
    hrmeE_AnnualSalary: number;
    hrmeE_ReasonForLeaving: string;
}

export interface IEmployeeSaveResponse {
    success: boolean;
    message: string;
    data?: any;
}

// Employee Detail Response
export interface IEmployeeDetailResponse {
    [key: string]: any;
}
