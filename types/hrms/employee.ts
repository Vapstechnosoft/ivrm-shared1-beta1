// Employee Register Types

export interface EmployeeOnloadResponse {
    // Basic Employee Fields
    CreatedDate?: string;
    UpdatedDate?: string;
    HRME_Id: number;
    MI_Id: number;
    HRMET_Id?: number;
    HRMGT_Id?: number;
    HRMD_Id?: number;
    HRMDES_Id?: number;
    HRMG_Id?: number;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRME_EmployeeCode?: string;
    HRME_BiometricCode?: string;
    HRME_RFCardId?: string;
    HRME_PerStreet?: string;
    HRME_PerArea?: string;
    HRME_PerCity?: string;
    HRME_PerAdd4?: string;
    HRME_PerStateId?: number;
    HRME_PerCountryId?: number;
    HRME_PerPincode?: number;
    HRME_LocStreet?: string;
    HRME_LocArea?: string;
    HRME_LocCity?: string;
    HRME_LocAdd4?: string;
    HRME_LocStateId?: number;
    HRME_LocCountryId?: number;
    HRME_LocPincode?: number;
    IVRMMMS_Id?: number;
    IVRMMG_Id?: number;
    CasteCategoryId?: number;
    CasteId?: number;
    ReligionId?: number;
    HRME_FatherName?: string;
    HRME_MotherName?: string;
    HRME_SpouseName?: string;
    HRME_SpouseOccupation?: string;
    HRME_SpouseMobileNo?: number;
    HRME_SpouseEmailId?: string;
    HRME_SpouseAddress?: string;
    HRME_DOB?: string;
    HRME_DOJ?: string;
    HRME_ExpectedRetirementDate?: string;
    HRME_PFDate?: string;
    HRME_ESIDate?: string;
    HRME_MobileNo?: number;
    HRME_EmailId?: string;
    HRME_BloodGroup?: string;
    HRME_PaymentType?: string;
    HRME_BankAccountNo?: string;
    HRME_PFApplicableFlag?: boolean;
    HRME_PFMaxFlag?: boolean;
    HRME_PFFixedFlag?: boolean;
    HRME_PFAccNo?: string;
    HRME_ESIAccNo?: string;
    HRME_GratuityAccNo?: string;
    HRME_ESIApplicableFlag?: boolean;
    HRME_Photo?: string;
    HRME_LeftFlag?: boolean;
    HRME_DOC?: string;
    HRME_DOL?: string;
    HRME_LeavingReason?: string;
    HRME_Height?: string;
    HRME_HeightUOM?: string;
    HRME_Weight?: number;
    HRME_WeightUOM?: string;
    HRME_IdentificationMark?: string;
    HRME_ApprovalNo?: string;
    HRME_PANCardNo?: string;
    HRME_AadharCardNo?: number;
    HRME_SubstituteFlag?: boolean;
    HRME_NationalSSN?: string;
    HRME_SalaryType?: string;
    HRME_EmployeeOrder?: number;
    HRME_ActiveFlag?: boolean;
    HRME_SubjectsTaught?: string;
    HRME_UINumber?: string;
    HRME_AnyHealthIssue?: string;
    HRME_EyeSightIssue?: string;
    HRME_TransfferedTo?: number;
    HRME_RecordTransferredFlg?: boolean;
    HRME_PHDResearchGuideFlg?: boolean;
    HRME_TechNonTeachingFlg?: string;
    HRME_RGRecognitionYear?: number;
    HRME_ExcPunch?: boolean;
    HRME_RetiredFlg?: boolean;
    HRME_PensionStoppedDate?: string;
    HRME_FPFNotApplicableFlg?: boolean;
    HRME_EPFNotApplicableFlg?: boolean;
    HRME_AllowSoftwareAccessFlg?: boolean;
    HRME_AppDownloadedDeviceId?: string;
    HRME_MSTeamsUserId?: string;
    HRME_MSTeamsEmailId?: string;
    HRME_MSTeamsPassword?: string;

    // Lists
    employeedetailList?: any[];
    experienceDetails?: any[];
    qualificationDetails?: any[];
    documentList?: any[];
    LeavingReasonList?: any[];
    institutiondropdownlist?: any[];
    employeeTypedropdownlist?: any[];
    groupTypedropdownlist?: any[];
    departmentdropdownlist?: any[];
    designationdropdownlist?: any[];
    gradedropdownlist?: any[];
    genderdropdownlist?: any[];
    maritalStatusdropdownlist?: any[];
    coursedropdownlist?: any[];
    SpecialisationList?: any[];
    countrydropdownlist?: any[];
    castedropdownlist?: any[];
    casteCategorydropdownlist?: any[];
    religiondropdownlist?: any[];
    AllState?: any[];
    bankdropdownlist?: any[];
    
    // Earnings/Deductions
    earningList?: any[];
    detectionList?: any[];
    EarningDTO?: any[];
    DeductionDTO?: any[];
    ArrearDTO?: any[];
    arrearList?: any[];
    grossList?: any[];
    employeeEarningsDeductionsDetails?: any[];
    
    // Increment Details
    IncrementDetailsDTO?: any;
    incrementDetails?: any[];
    
    // Configuration
    configurationDetails?: any;
    
    // Employee Dropdowns
    employeedropdown?: any[];
    employeedropdowndetails?: any[];
    employeegrade?: any[];
    employeedesig?: any[];
    employeedept?: any[];
    employeeemptype?: any[];
    employeeempgrouptype?: any[];
    departmentdropdown?: any[];
    designationdropdown?: any[];
    
    // DTOs
    EmployeeExperienceDTO?: any[];
    EmployeeQulaificationDTO?: any[];
    EmployeeDocumentDTO?: any[];
    
    // Mobile and Email
    mobile_list_dto?: any[];
    email_list_dto?: any[];
    selectedmobile_list_dto?: any[];
    selectedemail_list_dto?: any[];
    HRMEMNO_MobileNo?: number;
    HRMEM_EmailId?: string;
    HRMEMNO_Id?: number;
    HRMEEM_Id?: number;
    
    // Bank Details
    employeebankDetails?: any[];
    employeebankDTO?: any[];
    
    // Other fields
    retrunMsg?: string;
    roleId?: number;
    Employeedto?: string;
    Type?: string;
    TabName?: string;
    hrmgT_IdList?: number[];
    employeeTypeIdList?: number[];
    hrmD_IdList?: number[];
    hrmdeS_IdList?: number[];
    groupTypeIdList?: number[];
    LogInUserId?: number;
    username?: string;
    HRMD_DepartmentName?: string;
    HRMDES_DesignationName?: string;
    IMC_CasteName?: string;
    HRME_QualificationName?: string;
    IMC_Id?: number;
    HRMEQ_Id?: number;
    castlist?: string[];
    qualificationlist?: string[];
    MI_Logo?: string;
    HRESD_Amount?: number;
    HRESD_Id?: number;
    hrmE_EmployeeFirstName?: string;
    HRMG_GradeName?: string;
    HRMG_PayScaleRange?: string;
    HREIC_Id?: number;
    HREIC_ArrearApplicableFlg?: boolean;
    HREIC_ArrearGivenFlg?: boolean;
    HREIC_ActiveFlag?: boolean;
    HREIC_LastIncrementDate?: string;
    HREIC_IncrementDueDate?: string;
    HREIC_IncrementDate?: string;
    HREIC_ArrearMonths?: number;
    HREIC_CreatedBy?: number;
    HREIC_UpdatedBy?: number;
    HREICED_Id?: number;
    HREICED_Percentage?: number;
    HREICED_Amount?: number;
    HREICED_ActiveFlag?: boolean;
    HRME_PHOTO?: string;
    dropdownvalus?: Array<{ Id: number; DisplayText: string }>;
    EmporderDTO?: string[];
    tcflagexists?: string;
    IVRMUL_Id?: number;
    HREED_ApplicableMaxValue?: number;
    HREED_MaxApplicableFlg?: boolean;
}

export interface EmployeeListItem {
    HRME_Id: number;
    MI_Id: number;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRME_EmployeeCode: string;
    HRME_EmployeeOrder?: number;
    HRME_Photo?: string;
    HRMET_EmployeeType?: string;
    HRMGT_EmployeeGroupType?: string;
    HRMD_DepartmentName?: string;
    HRMDES_DesignationName?: string;
    HRME_MobileNo?: number;
    HRME_EmailId?: string;
    HRME_ActiveFlag: boolean;
    HRME_DOJ?: string;
    HRME_DOB?: string;
}

export interface EmployeeSaveRequest {
    HRME_Id: number;
    MI_Id: number;
    HRMET_Id?: number | null;
    HRMGT_Id?: number | null;
    HRMD_Id?: number | null;
    HRMDES_Id?: number | null;
    HRMG_Id?: number | null;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRME_EmployeeCode: string;
    HRME_BiometricCode?: string;
    HRME_RFCardId?: string;

    // Personal Details
    HRME_DOB?: string;
    HRME_DOJ?: string;
    IVRMMG_Id?: number | null;
    IVRMMMS_Id?: number | null;
    ReligionId?: number | null;
    CasteCategoryId?: number | null;
    CasteId?: number | null;
    HRME_FatherName?: string;
    HRME_MotherName?: string;
    HRME_SpouseName?: string;
    HRME_MobileNo?: number | null;
    HRME_EmailId?: string;
    HRME_BloodGroup?: string;
    HRME_Photo?: string;

    // Address Details
    HRME_PerStreet?: string;
    HRME_PerArea?: string;
    HRME_PerCity?: string;
    HRME_PerAdd4?: string;
    HRME_PerStateId?: number | null;
    HRME_PerCountryId?: number | null;
    HRME_PerPincode?: number | null;
    HRME_LocStreet?: string;
    HRME_LocArea?: string;
    HRME_LocCity?: string;
    HRME_LocAdd4?: string;
    HRME_LocStateId?: number | null;
    HRME_LocCountryId?: number | null;
    HRME_LocPincode?: number | null;

    // PF/ESI Details
    HRME_PFApplicableFlag?: boolean;
    HRME_PFAccNo?: string;
    HRME_PFDate?: string;
    HRME_ESIApplicableFlag?: boolean;
    HRME_ESIAccNo?: string;
    HRME_ESIDate?: string;
    HRME_GratuityAccNo?: string;

    // Bank Details
    HRME_PaymentType?: string;
    HRME_BankAccountNo?: string;

    // Other Details
    HRME_ExpectedRetirementDate?: string;
    HRME_PANCardNo?: string;
    HRME_AadharCardNo?: number | null;
    HRME_SubjectsTaught?: string;
    HRME_TechNonTeachingFlg?: boolean;
    HRME_ActiveFlag?: boolean;
    HRME_LeftFlag?: boolean;

    // Arrays for related data
    qualificationDetails?: any[];
    experienceDetails?: any[];
    documentList?: any[];

    LogInUserId: number;
}

export interface EmployeeSaveResponse {
    HRME_Id: number;
    retrunMsg?: string;
}

export interface EmployeeDetailResponse {
    HRME_Id: number;
    MI_Id: number;
    HRMET_Id?: number;
    HRMGT_Id?: number;
    HRMD_Id?: number;
    HRMDES_Id?: number;
    HRMG_Id?: number;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRME_EmployeeCode: string;
    HRME_BiometricCode?: string;
    HRME_RFCardId?: string;
    HRME_DOB?: string;
    HRME_DOJ?: string;
    IVRMMG_Id?: number;
    IVRMMMS_Id?: number;
    ReligionId?: number;
    CasteCategoryId?: number;
    CasteId?: number;
    HRME_FatherName?: string;
    HRME_MotherName?: string;
    HRME_SpouseName?: string;
    HRME_MobileNo?: number;
    HRME_EmailId?: string;
    HRME_BloodGroup?: string;
    HRME_Photo?: string;
    HRME_PerStreet?: string;
    HRME_PerArea?: string;
    HRME_PerCity?: string;
    HRME_PerStateId?: number;
    HRME_PerCountryId?: number;
    HRME_PerPincode?: number;
    HRME_LocStreet?: string;
    HRME_LocArea?: string;
    HRME_LocCity?: string;
    HRME_LocStateId?: number;
    HRME_LocCountryId?: number;
    HRME_LocPincode?: number;
    HRME_PFApplicableFlag?: boolean;
    HRME_PFAccNo?: string;
    HRME_PFDate?: string;
    HRME_ESIApplicableFlag?: boolean;
    HRME_ESIAccNo?: string;
    HRME_ESIDate?: string;
    HRME_GratuityAccNo?: string;
    HRME_PaymentType?: string;
    HRME_BankAccountNo?: string;
    HRME_ExpectedRetirementDate?: string;
    HRME_PANCardNo?: string;
    HRME_AadharCardNo?: number;
    HRME_SubjectsTaught?: string;
    HRME_TechNonTeachingFlg?: boolean;
    HRME_ActiveFlag: boolean;
    HRME_LeftFlag?: boolean;
    qualificationDetails?: any[];
    experienceDetails?: any[];
    documentList?: any[];
}

export interface QualificationDetail {
    HRMEQ_Id: number;
    HRME_Id: number;
    HRMC_Id?: number;
    HRME_QualificationName?: string;
    HRMEQ_CollegeName?: string;
    HRMEQ_UniversityName?: string;
    HRMEQ_YearOfPassing?: number;
    HRMEQ_RegistrationNo?: string;
    HRMEQ_Result?: string;
    HRMEQ_CGPAOrPerFlag?: string;
    HRMEQ_CGPA?: string;
    HRMEQ_Percentage?: string;
    HRMEQ_AreaOfSpecialisation?: string;
}

export interface ExperienceDetail {
    HRMEE_Id: number;
    HRME_Id: number;
    HRMEE_OrganisationName?: string;
    HRMEE_OrganisationAddress?: string;
    HRMEE_Department?: string;
    HRMEE_Designation?: string;
    HRMEE_JoinDate?: string;
    HRMEE_ExitDate?: string;
    HRMEE_NoOfYears?: number;
    HRMEE_NoOfMonths?: number;
    HRMEE_AnnualSalary?: number;
    HRMEE_ReasonForLeaving?: string;
}

export interface DocumentDetail {
    HRMEDS_Id: number;
    HRME_Id: number;
    HRMEDS_DocumentName?: string;
    HRMEDS_DocumentImageName?: string;
    HRMEDS_DucumentDescription?: string;
}
