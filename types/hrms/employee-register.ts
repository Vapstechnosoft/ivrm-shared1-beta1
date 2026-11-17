export interface EmployeeRegisterOnloadRequest {
    MI_Id: number;
    LogInUserId: number;
}

export interface DropdownItemGeneric {
    // Generic fallback type for various dropdowns with inconsistent shapes
    [key: string]: any;
}

export interface EmployeeRegisterOnloadResponse {
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

    // All dropdown lists
    employeeTypedropdownlist?: DropdownItemGeneric[] | null;
    groupTypedropdownlist?: DropdownItemGeneric[] | null;
    departmentdropdownlist?: DropdownItemGeneric[] | null;
    designationdropdownlist?: DropdownItemGeneric[] | null;
    gradedropdownlist?: DropdownItemGeneric[] | null;
    genderdropdownlist?: DropdownItemGeneric[] | null;
    maritalStatusdropdownlist?: DropdownItemGeneric[] | null;
    coursedropdownlist?: DropdownItemGeneric[] | null;
    SpecialisationList?: DropdownItemGeneric[] | null;
    bankdropdownlist?: DropdownItemGeneric[] | null;
    religiondropdownlist?: DropdownItemGeneric[] | null;
    casteCategorydropdownlist?: DropdownItemGeneric[] | null;
    castedropdownlist?: DropdownItemGeneric[] | null;
    countrydropdownlist?: DropdownItemGeneric[] | null;
    AllState?: DropdownItemGeneric[] | null;
    institutiondropdownlist?: DropdownItemGeneric[] | null;

    // Data lists
    employeedetailList?: DropdownItemGeneric[] | null;
    experienceDetails?: DropdownItemGeneric[] | null;
    qualificationDetails?: DropdownItemGeneric[] | null;
    documentList?: DropdownItemGeneric[] | null;
    LeavingReasonList?: DropdownItemGeneric[] | null;

    // Earnings/Deductions
    earningList?: DropdownItemGeneric[] | null;
    detectionList?: DropdownItemGeneric[] | null;
    EarningDTO?: DropdownItemGeneric[] | null;
    DeductionDTO?: DropdownItemGeneric[] | null;
    ArrearDTO?: DropdownItemGeneric[] | null;
    arrearList?: DropdownItemGeneric[] | null;
    grossList?: DropdownItemGeneric[] | null;
    employeeEarningsDeductionsDetails?: DropdownItemGeneric[] | null;

    // Increment Details
    IncrementDetailsDTO?: any;
    incrementDetails?: DropdownItemGeneric[] | null;

    // Configuration
    configurationDetails?: any;

    // Other fields
    retrunMsg?: string | null;
    roleId?: number | null;

    // Additional fields from the comprehensive response
    [key: string]: any; // Allow additional fields to match the full API response
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Save Personal Details Request (Employee + Address tabs combined)
// Note: Optional string fields should be null (not empty string) when not provided
// Note: MI_Id is extracted from JWT by backend, so it's optional in the request
export interface SavePersonalDetailsRequest {
    CreatedDate: string;
    UpdatedDate: string;
    HRME_Id: number;
    MI_Id?: number; // Optional - backend extracts from JWT
    dmoObj?: any; // Required by API but unclear structure
    HRMET_Id: number;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRMG_Id: number;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string | null;
    HRME_EmployeeLastName?: string | null;
    HRME_EmployeeCode?: string | null;
    HRME_BiometricCode?: string | null;
    HRME_RFCardId?: string | null;
    HRME_PerStreet?: string | null;
    HRME_PerArea?: string | null;
    HRME_PerCity?: string | null;
    HRME_PerAdd4?: string | null;
    HRME_PerStateId: number;
    HRME_PerCountryId: number;
    HRME_PerPincode: number;
    HRME_LocStreet?: string | null;
    HRME_LocArea?: string | null;
    HRME_LocCity?: string | null;
    HRME_LocAdd4?: string | null;
    HRME_LocStateId: number;
    HRME_LocCountryId: number;
    HRME_LocPincode: number;
    IVRMMMS_Id: number;
    IVRMMG_Id: number;
    CasteCategoryId: number;
    CasteId: number;
    ReligionId: number;
    HRME_FatherName?: string | null;
    HRME_MotherName?: string | null;
    HRME_SpouseName?: string | null;
    HRME_SpouseOccupation?: string | null;
    HRME_SpouseMobileNo: number;
    HRME_SpouseEmailId?: string | null;
    HRME_SpouseAddress?: string | null;
    HRME_DOB?: string | null;
    HRME_DOJ?: string | null;
    HRME_ExpectedRetirementDate?: string | null;
    HRME_PFDate?: string | null;
    HRME_ESIDate?: string | null;
    HRME_MobileNo: number;
    HRME_EmailId?: string | null;
    HRME_BloodGroup?: string | null;
    HRME_PaymentType?: string | null;
    HRME_BankAccountNo?: string | null;
    HRME_PFApplicableFlag: boolean;
    HRME_PFMaxFlag: boolean;
    HRME_PFFixedFlag: boolean;
    HRME_PFAccNo?: string | null;
    HRME_ESIAccNo?: string | null;
    HRME_GratuityAccNo?: string | null;
    HRME_ESIApplicableFlag: boolean;
    HRME_Photo?: string | null;
    HRME_LeftFlag: boolean;
    HRME_DOL?: string | null;
    HRME_LeavingReason?: string | null;
    HRME_Height?: string | null;
    HRME_HeightUOM?: string | null;
    HRME_Weight: number;
    HRME_WeightUOM?: string | null;
    HRME_IdentificationMark?: string | null;
    HRME_ApprovalNo?: string | null;
    HRME_PANCardNo?: string | null;
    HRME_AadharCardNo: number;
    HRME_SubstituteFlag: boolean;
    HRME_NationalSSN?: string | null;
    HRME_SalaryType?: string | null;
    HRME_EmployeeOrder: number;
    HRME_ActiveFlag: boolean;
    HRME_UINumber?: string | null;
    HRME_DOC?: string | null;
    HRME_SubjectsTaught?: string | null;
    HRME_AppDownloadedDeviceId?: string | null;
    HRME_PHDResearchGuideFlg: boolean;
    HRME_TechNonTeachingFlg?: string | null;
    HRME_RGRecognitionYear: number;
    HRME_AnyHealthIssue?: string | null;
    HRME_EyeSightIssue?: string | null;
    HRME_TransfferedTo: number;
    HRME_RecordTransferredFlg: boolean;
    HRME_MSTeamsUserId?: string | null;
    HRME_MSTeamsEmailId?: string | null;
    HRME_MSTeamsPassword?: string | null;
    HRME_ExcPunch: boolean;
    HRME_RetiredFlg: boolean;
    HRME_PensionStoppedDate?: string | null;
    HRME_FPFNotApplicableFlg: boolean;
    HRME_EPFNotApplicableFlg: boolean;
    HRME_AllowSoftwareAccessFlg: boolean;
}

// Save Personal Details Response
export interface SavePersonalDetailsResponse {
    HRME_Id: number;
    retrunMsg?: string;
    roleId?: number;
    countrydropdownlist?: DropdownItemGeneric[] | null;
    AllState?: DropdownItemGeneric[] | null;
}

// Save Personal Details API Request (with lowercase field names as per API)
// Updated to nested structure per backend requirement
export interface SavePersonalDetailsApiRequest {
    employee: {
        hrmE_Id: number;
        HRME_Id: number;
        mI_Id: number;
        hrmeT_Id: number;
        hrmgT_Id: number;
        hrmD_Id: number;
        hrmdeS_Id: number;
        hrmG_Id: number;
        hrmE_EmployeeFirstName: string | null;
        hrmE_EmployeeMiddleName: string | null;
        hrmE_EmployeeLastName: string | null;
        hrmE_EmployeeCode: string | null;
        hrmE_BiometricCode: string | null;
        hrmE_RFCardId: string | null;
        hrmE_PerStreet: string | null;
        hrmE_PerArea: string | null;
        hrmE_PerCity: string | null;
        hrmE_PerAdd4: string | null;
        hrmE_PerStateId: number;
        hrmE_PerCountryId: number;
        hrmE_PerPincode: number;
        hrmE_LocStreet: string | null;
        hrmE_LocArea: string | null;
        hrmE_LocCity: string | null;
        hrmE_LocAdd4: string | null;
        hrmE_LocStateId: number;
        hrmE_LocCountryId: number;
        hrmE_LocPincode: number;
        ivrmmmS_Id: number;
        ivrmmG_Id: number;
        casteCategoryId: number;
        casteId: number;
        religionId: number;
        hrmE_FatherName: string | null;
        hrmE_MotherName: string | null;
        hrmE_SpouseName: string | null;
        hrmE_SpouseOccupation: string | null;
        hrmE_SpouseMobileNo: number;
        hrmE_SpouseEmailId: string | null;
        hrmE_SpouseAddress: string | null;
        hrmE_DOB: string | null;
        hrmE_DOJ: string | null;
        hrmE_ExpectedRetirementDate: string | null;
        hrmE_PFDate: string | null;
        hrmE_ESIDate: string | null;
        hrmE_MobileNo: number;
        hrmE_EmailId: string | null;
        hrmE_BloodGroup: string | null;
        hrmE_PaymentType: string | null;
        hrmE_BankAccountNo: string | null;
        hrmE_PFApplicableFlag: boolean;
        hrmE_PFMaxFlag: boolean;
        hrmE_PFFixedFlag: boolean;
        hrmE_PFAccNo: string | null;
        hrmE_ESIAccNo: string | null;
        hrmE_GratuityAccNo: string | null;
        hrmE_ESIApplicableFlag: boolean;
        hrmE_Photo: string | null;
        hrmE_LeftFlag: boolean;
        hrmE_DOL: string | null;
        hrmE_LeavingReason: string | null;
        hrmE_Height: string | null;
        hrmE_HeightUOM: string | null;
        hrmE_Weight: number;
        hrmE_WeightUOM: string | null;
        hrmE_IdentificationMark: string | null;
        hrmE_ApprovalNo: string | null;
        hrmE_PANCardNo: string | null;
        hrmE_AadharCardNo: number;
        hrmE_SubstituteFlag: boolean;
        hrmE_NationalSSN: string | null;
        hrmE_SalaryType: string | null;
        hrmE_EmployeeOrder: number;
        hrmE_ActiveFlag: boolean;
        hrmE_UINumber: string | null;
        hrmE_doc: string | null;
        hrmE_SubjectsTaught: string | null;
        hrmE_AppDownloadedDeviceId: string | null;
        hrmE_PHDResearchGuideFlg: boolean;
        hrmE_TechNonTeachingFlg: string | null;
        hrmE_RGRecognitionYear: number;
        hrmE_AnyHealthIssue: string | null;
        hrmE_EyeSightIssue: string | null;
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
        EmployeePhoto?: string | null;
        HrmeId?: number;
    };
    bankRequest?: {
        mI_Id: number;
        hrmE_Id: number;
        bankDetails: Array<{
            hrmeB_Id: number;
            hrmE_Id: number;
            hrmbD_Id: number;
            hrmeB_AccountNo: string;
            hrmeB_ActiveFlag: boolean;
        }>;
    } | null;
}

// Employee Save/Update Request - Updated to match API expectations
export interface EmployeeRegisterSaveRequest {
    HRME_Id: number;
    MI_Id: number;
    HRMET_Id: number | null;
    HRMGT_Id: number | null;
    HRMD_Id: number | null;
    HRMDES_Id: number | null;
    HRMG_Id: number | null;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRME_EmployeeCode: string;
    HRME_BiometricCode?: string;
    HRME_RFCardId?: string;
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
    IVRMMMS_Id?: number | null;
    IVRMMG_Id?: number | null;
    CasteCategoryId?: number | null;
    CasteId?: number | null;
    ReligionId?: number | null;
    HRME_FatherName?: string;
    HRME_MotherName?: string;
    HRME_SpouseName?: string;
    HRME_SpouseOccupation?: string;
    HRME_SpouseMobileNo?: number | null;
    HRME_SpouseEmailId?: string;
    HRME_SpouseAddress?: string;
    HRME_DOB?: string;
    HRME_DOJ?: string;
    HRME_ExpectedRetirementDate?: string;
    HRME_PFDate?: string;
    HRME_ESIDate?: string;
    HRME_MobileNo?: number | null;
    HRME_EmailId?: string;
    HRME_BloodGroup?: string;
    HRME_PaymentType?: string;
    HRME_BankAccountNo?: string;
    HRME_PFApplicableFlag?: string | boolean;
    HRME_PFMaxFlag?: string | boolean;
    HRME_PFFixedFlag?: string | boolean;
    HRME_PFAccNo?: string;
    HRME_ESIAccNo?: string;
    HRME_GratuityAccNo?: string;
    HRME_ESIApplicableFlag?: string | boolean;
    HRME_Photo?: string;
    HRME_LeftFlag?: boolean;
    HRME_DOC?: string;
    HRME_DOL?: string | null;
    HRME_LeavingReason?: string;
    HRME_Height?: string;
    HRME_HeightUOM?: string;
    HRME_Weight?: number | null;
    HRME_WeightUOM?: string;
    HRME_IdentificationMark?: string;
    HRME_ApprovalNo?: string;
    HRME_PANCardNo?: string;
    HRME_AadharCardNo?: number | null;
    HRME_SubstituteFlag?: boolean;
    HRME_NationalSSN?: string;
    HRME_SalaryType?: string;
    HRME_EmployeeOrder?: number | null;
    HRME_ActiveFlag?: boolean;
    HRME_SubjectsTaught?: string;
    HRME_UINumber?: string;
    HRME_AnyHealthIssue?: string;
    HRME_EyeSightIssue?: string;
    HRME_TransfferedTo?: number | null;
    HRME_RecordTransferredFlg?: boolean;
    HRME_PHDResearchGuideFlg?: string | boolean;
    HRME_TechNonTeachingFlg?: boolean; // Boolean field for Teaching/Non-Teaching
    HRME_RGRecognitionYear?: string;
    HRME_ExcPunch?: boolean;
    HRME_RetiredFlg?: boolean;
    HRME_PensionStoppedDate?: string | null;
    HRME_FPFNotApplicableFlg?: boolean;
    HRME_EPFNotApplicableFlg?: boolean;
    HRME_AllowSoftwareAccessFlg?: boolean;
    LogInUserId: number;
    employeedetailList?: any[];
    experienceDetails?: any[];
    qualificationDetails?: any[];
    documentList?: any[];
    retrunMsg?: string;
    roleId?: number;
}

// Employee Save/Update Response
export interface EmployeeRegisterSaveResponse {
    HRME_Id: number;
    retrunMsg?: string;
    roleId?: number;
}

// Employee Personal Details Request (for Employee tab)
export interface EmployeePersonalDetailsRequest {
    MI_Id: number;
    Employeedto: {
        CreatedDate: string;
        UpdatedDate: string;
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
        HRME_EmployeeCode: string | null;
        HRME_BiometricCode: string | null;
        HRME_RFCardId: string | null;
        HRME_PerStreet: string | null;
        HRME_PerArea: string | null;
        HRME_PerCity: string | null;
        HRME_PerAdd4: string | null;
        HRME_PerStateId: number;
        HRME_PerCountryId: number;
        HRME_PerPincode: number;
        HRME_LocStreet: string | null;
        HRME_LocArea: string | null;
        HRME_LocCity: string | null;
        HRME_LocAdd4: string | null;
        HRME_LocStateId: number;
        HRME_LocCountryId: number;
        HRME_LocPincode: number;
        IVRMMMS_Id: number;
        IVRMMG_Id: number;
        CasteCategoryId: number;
        CasteId: number;
        ReligionId: number;
        HRME_FatherName: string | null;
        HRME_MotherName: string | null;
        HRME_SpouseName: string | null;
        HRME_SpouseOccupation: string | null;
        HRME_SpouseMobileNo: number;
        HRME_SpouseEmailId: string | null;
        HRME_SpouseAddress: string | null;
        HRME_DOB: string | null;
        HRME_DOJ: string | null;
        HRME_ExpectedRetirementDate: string | null;
        HRME_PFDate: string | null;
        HRME_ESIDate: string | null;
        HRME_MobileNo: number;
        HRME_EmailId: string | null;
        HRME_BloodGroup: string | null;
        HRME_PaymentType: string | null;
        HRME_BankAccountNo: string | null;
        HRME_PFApplicableFlag: boolean;
        HRME_PFMaxFlag: boolean;
        HRME_PFFixedFlag: boolean;
        HRME_PFAccNo: string | null;
        HRME_ESIAccNo: string | null;
        HRME_GratuityAccNo: string | null;
        HRME_ESIApplicableFlag: boolean;
        HRME_Photo: string | null;
        HRME_LeftFlag: boolean;
        HRME_DOC: string | null;
        HRME_DOL: string | null;
        HRME_LeavingReason: string | null;
        HRME_Height: string | null;
        HRME_HeightUOM: string | null;
        HRME_Weight: number;
        HRME_WeightUOM: string | null;
        HRME_IdentificationMark: string | null;
        HRME_ApprovalNo: string | null;
        HRME_PANCardNo: string | null;
        HRME_AadharCardNo: number;
        HRME_SubstituteFlag: boolean;
        HRME_NationalSSN: string | null;
        HRME_SalaryType: string | null;
        HRME_EmployeeOrder: number;
        HRME_ActiveFlag: boolean;
        HRME_SubjectsTaught: string | null;
        HRME_UINumber: string | null;
        HRME_AnyHealthIssue: string | null;
        HRME_EyeSightIssue: string | null;
        HRME_TransfferedTo: number;
        HRME_RecordTransferredFlg: boolean;
        HRME_PHDResearchGuideFlg: boolean;
        HRME_TechNonTeachingFlg: string;
        HRME_RGRecognitionYear: number;
        HRME_ExcPunch: boolean;
        HRME_RetiredFlg: boolean;
        HRME_PensionStoppedDate: string | null;
        HRME_FPFNotApplicableFlg: boolean;
        HRME_EPFNotApplicableFlg: boolean;
        HRME_AllowSoftwareAccessFlg: boolean;
        employeedetailList: any[];
        experienceDetails: any[];
        qualificationDetails: any[];
        documentList: any[];
        [key: string]: any; // For additional properties
    };
    mobile_list_dto: any[];
    email_list_dto: any[];
    employeebankDTO: any[];
}

export interface EmployeePersonalDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

// Employee Address Details Request (for Address tab) - same structure as Personal Details
export interface EmployeeAddressDetailsRequest {
    MI_Id: number;
    Employeedto: {
        CreatedDate: string;
        UpdatedDate: string;
        HRME_Id: number;
        MI_Id: number;
        HRMET_Id: number;
        HRMGT_Id: number;
        HRMD_Id: number;
        HRMDES_Id: number;
        HRMG_Id: number;
        HRME_EmployeeFirstName: string;
        HRME_EmployeeMiddleName: string;
        HRME_EmployeeLastName: string;
        HRME_EmployeeCode: string;
        HRME_BiometricCode: string;
        HRME_RFCardId: string;
        HRME_PerStreet: string;
        HRME_PerArea: string;
        HRME_PerCity: string;
        HRME_PerAdd4: string;
        HRME_PerStateId: number;
        HRME_PerCountryId: number;
        HRME_PerPincode: number;
        HRME_LocStreet: string;
        HRME_LocArea: string;
        HRME_LocCity: string;
        HRME_LocAdd4: string;
        HRME_LocStateId: number;
        HRME_LocCountryId: number;
        HRME_LocPincode: number;
        IVRMMMS_Id: number;
        IVRMMG_Id: number;
        CasteCategoryId: number;
        CasteId: number;
        ReligionId: number;
        HRME_FatherName: string;
        HRME_MotherName: string;
        HRME_SpouseName: string;
        HRME_SpouseOccupation: string;
        HRME_SpouseMobileNo: number;
        HRME_SpouseEmailId: string;
        HRME_SpouseAddress: string;
        HRME_DOB: string;
        HRME_DOJ: string;
        HRME_ExpectedRetirementDate: string;
        HRME_PFDate: string;
        HRME_ESIDate: string;
        HRME_MobileNo: number;
        HRME_EmailId: string;
        HRME_BloodGroup: string;
        HRME_PaymentType: string;
        HRME_BankAccountNo: string;
        HRME_PFApplicableFlag: boolean;
        HRME_PFMaxFlag: boolean;
        HRME_PFFixedFlag: boolean;
        HRME_PFAccNo: string;
        HRME_ESIAccNo: string;
        HRME_GratuityAccNo: string;
        HRME_ESIApplicableFlag: boolean;
        HRME_Photo: string;
        HRME_LeftFlag: boolean;
        HRME_DOC: string;
        HRME_DOL: string;
        HRME_LeavingReason: string;
        HRME_Height: string;
        HRME_HeightUOM: string;
        HRME_Weight: number;
        HRME_WeightUOM: string;
        HRME_IdentificationMark: string;
        HRME_ApprovalNo: string;
        HRME_PANCardNo: string;
        HRME_AadharCardNo: number;
        HRME_SubstituteFlag: boolean;
        HRME_NationalSSN: string;
        HRME_SalaryType: string;
        HRME_EmployeeOrder: number;
        HRME_ActiveFlag: boolean;
        HRME_SubjectsTaught: string;
        HRME_UINumber: string;
        HRME_AnyHealthIssue: string;
        HRME_EyeSightIssue: string;
        HRME_TransfferedTo: number;
        HRME_RecordTransferredFlg: boolean;
        HRME_PHDResearchGuideFlg: boolean;
        HRME_TechNonTeachingFlg: string;
        HRME_RGRecognitionYear: number;
        HRME_ExcPunch: boolean;
        HRME_RetiredFlg: boolean;
        HRME_PensionStoppedDate: string;
        HRME_FPFNotApplicableFlg: boolean;
        HRME_EPFNotApplicableFlg: boolean;
        HRME_AllowSoftwareAccessFlg: boolean;
        employeedetailList: any[];
        experienceDetails: any[];
        qualificationDetails: any[];
        documentList: any[];
        [key: string]: any; // For additional properties
    };
    mobile_list_dto: any[];
    email_list_dto: any[];
    employeebankDTO: any[];
}

export interface EmployeeAddressDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

export interface EmployeeQualificationDetailsRequest {
    MI_Id: number;
    Employeedto: any; // Same structure as EmployeePersonalDetailsRequest.Employeedto
    EmployeeQulaificationDTO?: Array<{
        CreatedDate?: string;
        UpdatedDate?: string;
        HRMEQ_Id?: number;
        MI_Id?: number;
        HRMC_Id?: number;
        HRME_Id?: number;
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
        HRMEQ_MedicalCouncil?: string;
        HRMEQ_Date?: string;
        HRMEQ_Hardcopy?: string;
        retrunMsg?: string;
        HRMEQ_PHDFlg?: boolean;
        HRMEQ_StateId?: number;
        HRMEQ_CountryId?: number;
        HRMEQ_ThesisTitle?: string;
        HRMEQ_RegistrationYear?: number;
        HRMEQ_GuideName?: string;
    }>;
}

export interface EmployeeQualificationDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

export interface EmployeeExperienceDetailsRequest {
    MI_Id: number;
    Employeedto: any; // Same structure as EmployeePersonalDetailsRequest.Employeedto
    EmployeeExperienceDTO?: Array<{
        CreatedDate?: string;
        UpdatedDate?: string;
        HRMEE_Id?: number;
        MI_Id?: number;
        HRME_Id?: number;
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
        retrunMsg?: string;
    }>;
}

export interface EmployeeExperienceDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

// Save Experience Details Request - Updated to match API structure
export interface SaveExperienceDetailsRequest {
    CreatedDate: string;
    UpdatedDate: string;
    HRMEE_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HRMEE_OrganisationName?: string;
    HRMEE_OrganisationAddress?: string;
    HRMEE_Department?: string;
    HRMEE_Designation?: string;
    HRMEE_JoinDate?: string;
    HRMEE_ExitDate?: string;
    HRMEE_NoOfYears: number;
    HRMEE_NoOfMonths: number;
    HRMEE_AnnualSalary: number;
    HRMEE_ReasonForLeaving?: string;
    retrunMsg?: string;
}

// Save Experience Details Response
export interface SaveExperienceDetailsResponse {
    HRMEE_Id?: number;
    retrunMsg?: string;
    success?: boolean;
    message?: string;
    [key: string]: any;
}

export interface EmployeeDocumentDetailsRequest {
    MI_Id: number;
    Employeedto: any; // Same structure as EmployeePersonalDetailsRequest.Employeedto
    EmployeeDocumentDTO?: Array<{
        CreatedDate?: string;
        UpdatedDate?: string;
        HRMEDS_Id?: number;
        MI_Id?: number;
        HRME_Id?: number;
        HRMEDS_DocumentName?: string;
        HRMEDS_DocumentImageName?: string;
        HRMEDS_DucumentDescription?: string;
        retrunMsg?: string;
    }>;
}

export interface EmployeeDocumentDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

// Save Document Details Request - Updated to match API structure
export interface SaveDocumentDetailsRequest {
    CreatedDate: string;
    UpdatedDate: string;
    HRMEDS_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HRMEDS_DocumentName?: string;
    HRMEDS_DocumentImageName?: string;
    HRMEDS_DucumentDescription?: string;
    retrunMsg?: string;
}

// Save Document Details Response
export interface SaveDocumentDetailsResponse {
    HRMEDS_Id?: number;
    retrunMsg?: string;
    success?: boolean;
    message?: string;
    [key: string]: any;
}

export interface EmployeeMedicalDetailsRequest {
    MI_Id: number;
    Employeedto: any; // Same structure as EmployeePersonalDetailsRequest.Employeedto
    HRME_Height?: number;
    HRME_HeightUOM?: string;
    HRME_Weight?: number;
    HRME_WeightUOM?: string;
    HRME_IdentificationMark?: string;
    HRME_EyeSightIssue?: boolean;
    HRME_AnyHealthIssue?: boolean;
}

export interface EmployeeMedicalDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

// Save Medical Details Request - Updated to match API structure
// Note: Optional string fields should be null (not empty string) when not provided
export interface SaveMedicalDetailsRequest {
    CreatedDate: string;
    UpdatedDate: string;
    HRME_Id: number;
    MI_Id: number;
    HRMET_Id: number;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRMG_Id: number;
    HRME_EmployeeFirstName?: string | null;
    HRME_EmployeeMiddleName?: string | null;
    HRME_EmployeeLastName?: string | null;
    HRME_EmployeeCode?: string | null;
    HRME_BiometricCode?: string | null;
    HRME_RFCardId?: string | null;
    HRME_PerStreet?: string | null;
    HRME_PerArea?: string | null;
    HRME_PerCity?: string | null;
    HRME_PerAdd4?: string | null;
    HRME_PerStateId: number;
    HRME_PerCountryId: number;
    HRME_PerPincode: number;
    HRME_LocStreet?: string | null;
    HRME_LocArea?: string | null;
    HRME_LocCity?: string | null;
    HRME_LocAdd4?: string | null;
    HRME_LocStateId: number;
    HRME_LocCountryId: number;
    HRME_LocPincode: number;
    IVRMMMS_Id: number;
    IVRMMG_Id: number;
    CasteCategoryId: number;
    CasteId: number;
    ReligionId: number;
    HRME_FatherName?: string | null;
    HRME_MotherName?: string | null;
    HRME_SpouseName?: string | null;
    HRME_SpouseOccupation?: string | null;
    HRME_SpouseMobileNo: number;
    HRME_SpouseEmailId?: string | null;
    HRME_SpouseAddress?: string | null;
    HRME_DOB?: string | null;
    HRME_DOJ?: string | null;
    HRME_ExpectedRetirementDate?: string | null;
    HRME_PFDate?: string | null;
    HRME_ESIDate?: string | null;
    HRME_MobileNo: number;
    HRME_EmailId?: string | null;
    HRME_BloodGroup?: string | null;
    HRME_PaymentType?: string | null;
    HRME_BankAccountNo?: string | null;
    HRME_PFApplicableFlag: boolean;
    HRME_PFMaxFlag: boolean;
    HRME_PFFixedFlag: boolean;
    HRME_PFAccNo?: string | null;
    HRME_ESIAccNo?: string | null;
    HRME_GratuityAccNo?: string | null;
    HRME_ESIApplicableFlag: boolean;
    HRME_Photo?: string | null;
    HRME_LeftFlag: boolean;
    HRME_DOL?: string | null;
    HRME_LeavingReason?: string | null;
    HRME_Height?: string | null;
    HRME_HeightUOM?: string | null;
    HRME_Weight: number;
    HRME_WeightUOM?: string | null;
    HRME_IdentificationMark?: string | null;
    HRME_ApprovalNo?: string | null;
    HRME_PANCardNo?: string | null;
    HRME_AadharCardNo: number;
    HRME_SubstituteFlag: boolean;
    HRME_NationalSSN?: string | null;
    HRME_SalaryType?: string | null;
    HRME_EmployeeOrder: number;
    HRME_ActiveFlag: boolean;
    HRME_UINumber?: string | null;
    HRME_DOC?: string | null;
    HRME_SubjectsTaught?: string | null;
    HRME_AppDownloadedDeviceId?: string | null;
    HRME_PHDResearchGuideFlg: boolean;
    HRME_TechNonTeachingFlg?: string | null;
    HRME_RGRecognitionYear: number;
    HRME_AnyHealthIssue?: string | null;
    HRME_EyeSightIssue?: string | null;
    HRME_TransfferedTo: number;
    HRME_RecordTransferredFlg: boolean;
    HRME_MSTeamsUserId?: string | null;
    HRME_MSTeamsEmailId?: string | null;
    HRME_MSTeamsPassword?: string | null;
    HRME_ExcPunch: boolean;
    HRME_RetiredFlg: boolean;
    HRME_PensionStoppedDate?: string | null;
    HRME_FPFNotApplicableFlg: boolean;
    HRME_EPFNotApplicableFlg: boolean;
    HRME_AllowSoftwareAccessFlg: boolean;
}

// Save Medical Details Response
export interface SaveMedicalDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    success?: boolean;
    message?: string;
    [key: string]: any;
}

export interface EmployeeOtherDetailsRequest {
    MI_Id: number;
    Employeedto: any; // Same structure as EmployeePersonalDetailsRequest.Employeedto
    HRME_DOC?: string;
    HRME_RetiredFlg?: boolean;
}

export interface EmployeeOtherDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

// Save Other Details Request - Uses same structure as SaveMedicalDetailsRequest
export type SaveOtherDetailsRequest = SaveMedicalDetailsRequest;

// Save Other Details Response
export interface SaveOtherDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    success?: boolean;
    message?: string;
    [key: string]: any;
}

// Employee Earning Details Request (for Payroll - Earning tab)
export interface EmployeeEarningDetailsRequest {
    MI_Id: number;
    Employeedto: any; // Large employee object with all details
    EarningDTO?: Array<{
        HREED_Id?: number;
        MI_Id?: number;
        HRME_Id?: number;
        HRMED_Id?: number;
        HREED_Amount?: number;
        HREED_Percentage?: string;
        HREED_ActiveFlag?: boolean;
        HRMED_Name?: string;
        HRMED_EarnDedFlag?: string;
        HRMED_AmountPercentFlag?: string;
        HREED_ApplicableMaxValue?: number;
        HREED_MaxApplicableFlg?: boolean;
        roleId?: number;
        [key: string]: any;
    }>;
}

export interface EmployeeEarningDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

// Employee Deduction Details Request (for Payroll - Deduction tab)
export interface EmployeeDeductionDetailsRequest {
    MI_Id: number;
    Employeedto: any; // Large employee object with all details
    DeductionDTO?: Array<{
        HREED_Id?: number;
        MI_Id?: number;
        HRME_Id?: number;
        HRMED_Id?: number;
        HREED_Amount?: number;
        HREED_Percentage?: string;
        HREED_ActiveFlag?: boolean;
        HRMED_Name?: string;
        HRMED_EarnDedFlag?: string;
        HRMED_AmountPercentFlag?: string;
        HREED_ApplicableMaxValue?: number;
        HREED_MaxApplicableFlg?: boolean;
        roleId?: number;
        [key: string]: any;
    }>;
}

export interface EmployeeDeductionDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

// Employee Arrear Details Request (for Payroll - Arrear tab)
export interface EmployeeArrearDetailsRequest {
    MI_Id: number;
    Employeedto: any; // Large employee object with all details
    ArrearDTO?: Array<{
        HREED_Id?: number;
        MI_Id?: number;
        HRME_Id?: number;
        HRMED_Id?: number;
        HREED_Amount?: number;
        HREED_Percentage?: string;
        HREED_ActiveFlag?: boolean;
        HRMED_Name?: string;
        HRMED_EarnDedFlag?: string;
        HRMED_AmountPercentFlag?: string;
        HREED_ApplicableMaxValue?: number;
        HREED_MaxApplicableFlg?: boolean;
        roleId?: number;
        [key: string]: any;
    }>;
}

export interface EmployeeArrearDetailsResponse {
    HRME_Id?: number;
    retrunMsg?: string;
    roleId?: number;
}

// Get Employee by ID Request
export interface GetEmployeeByIdRequest {
    id: number;
}

// Get Employee by ID Response
export interface GetEmployeeByIdResponse {
    HRME_Id: number;
    MI_Id: number;
    HRMET_Id: number | null;
    HRMGT_Id: number | null;
    HRMD_Id: number | null;
    HRMDES_Id: number | null;
    HRMG_Id: number | null;
    HRME_EmployeeFirstName: string | null;
    HRME_EmployeeMiddleName: string | null;
    HRME_EmployeeLastName: string | null;
    HRME_EmployeeCode: string | null;
    HRME_BiometricCode: string | null;
    HRME_RFCardId: string | null;
    HRME_PerStreet: string | null;
    HRME_PerArea: string | null;
    HRME_PerCity: string | null;
    HRME_PerAdd4: string | null;
    HRME_PerStateId: number | null;
    HRME_PerCountryId: number | null;
    HRME_PerPincode: number | null;
    HRME_LocStreet: string | null;
    HRME_LocArea: string | null;
    HRME_LocCity: string | null;
    HRME_LocAdd4: string | null;
    HRME_LocStateId: number | null;
    HRME_LocCountryId: number | null;
    HRME_LocPincode: number | null;
    IVRMMMS_Id: number | null;
    IVRMMG_Id: number | null;
    CasteCategoryId: number | null;
    CasteId: number | null;
    ReligionId: number | null;
    HRME_FatherName: string | null;
    HRME_MotherName: string | null;
    HRME_SpouseName: string | null;
    HRME_SpouseOccupation: string | null;
    HRME_SpouseMobileNo: number | null;
    HRME_SpouseEmailId: string | null;
    HRME_SpouseAddress: string | null;
    HRME_DOB: string | null;
    HRME_DOJ: string | null;
    HRME_ExpectedRetirementDate: string | null;
    HRME_PFDate: string | null;
    HRME_ESIDate: string | null;
    HRME_MobileNo: number | null;
    HRME_EmailId: string | null;
    HRME_BloodGroup: string | null;
    HRME_PaymentType: string | null;
    HRME_BankAccountNo: string | null;
    HRME_PFApplicableFlag: boolean | null;
    HRME_PFMaxFlag: boolean | null;
    HRME_PFFixedFlag: boolean | null;
    HRME_PFAccNo: string | null;
    HRME_ESIAccNo: string | null;
    HRME_GratuityAccNo: string | null;
    HRME_ESIApplicableFlag: boolean | null;
    HRME_Photo: string | null;
    HRME_LeftFlag: boolean | null;
    HRME_DOC: string | null;
    HRME_DOL: string | null;
    HRME_LeavingReason: string | null;
    HRME_Height: string | null;
    HRME_HeightUOM: string | null;
    HRME_Weight: number | null;
    HRME_WeightUOM: string | null;
    HRME_IdentificationMark: string | null;
    HRME_ApprovalNo: string | null;
    HRME_PANCardNo: string | null;
    HRME_AadharCardNo: number | null;
    HRME_SubstituteFlag: boolean | null;
    HRME_NationalSSN: string | null;
    HRME_SalaryType: string | null;
    HRME_EmployeeOrder: number | null;
    HRME_ActiveFlag: boolean | null;
    HRME_SubjectsTaught: string | null;
    HRME_UINumber: string | null;
    HRME_AnyHealthIssue: string | null;
    HRME_EyeSightIssue: string | null;
    HRME_TransfferedTo: number | null;
    HRME_RecordTransferredFlg: boolean | null;
    HRME_PHDResearchGuideFlg: boolean | null;
    HRME_TechNonTeachingFlg: string | null;
    HRME_RGRecognitionYear: number | null;
    HRME_ExcPunch: boolean | null;
    HRME_RetiredFlg: boolean | null;
    HRME_PensionStoppedDate: string | null;
    HRME_FPFNotApplicableFlg: boolean | null;
    HRME_EPFNotApplicableFlg: boolean | null;
    HRME_AllowSoftwareAccessFlg: boolean | null;
    employeedetailList: Array<{
        HRME_Id: number;
        MI_Id: number;
        HRMET_Id: number;
        HRMGT_Id: number;
        HRMD_Id: number;
        HRMDES_Id: number;
        HRMG_Id: number;
        HRME_EmployeeFirstName: string;
        HRME_EmployeeMiddleName: string | null;
        HRME_EmployeeLastName: string;
        HRME_EmployeeCode: string;
        HRME_BiometricCode: string | null;
        HRME_RFCardId: string | null;
        HRME_PerStreet: string | null;
        HRME_PerArea: string | null;
        HRME_PerCity: string | null;
        HRME_PerAdd4: string | null;
        HRME_PerStateId: number;
        HRME_PerCountryId: number;
        HRME_PerPincode: number;
        HRME_LocStreet: string | null;
        HRME_LocArea: string | null;
        HRME_LocCity: string | null;
        HRME_LocAdd4: string | null;
        HRME_LocStateId: number;
        HRME_LocCountryId: number;
        HRME_LocPincode: number;
        IVRMMMS_Id: number;
        IVRMMG_Id: number;
        CasteCategoryId: number;
        CasteId: number;
        ReligionId: number;
        HRME_FatherName: string | null;
        HRME_MotherName: string | null;
        HRME_SpouseName: string | null;
        HRME_SpouseOccupation: string | null;
        HRME_SpouseMobileNo: number;
        HRME_SpouseEmailId: string | null;
        HRME_SpouseAddress: string | null;
        HRME_DOB: string;
        HRME_DOJ: string;
        HRME_ExpectedRetirementDate: string | null;
        HRME_PFDate: string | null;
        HRME_ESIDate: string | null;
        HRME_MobileNo: number;
        HRME_EmailId: string | null;
        HRME_BloodGroup: string | null;
        HRME_PaymentType: string | null;
        HRME_BankAccountNo: string | null;
        HRME_PFApplicableFlag: boolean;
        HRME_PFMaxFlag: boolean;
        HRME_PFFixedFlag: boolean;
        HRME_PFAccNo: string | null;
        HRME_ESIAccNo: string | null;
        HRME_GratuityAccNo: string | null;
        HRME_ESIApplicableFlag: boolean | null;
        HRME_Photo: string | null;
        HRME_LeftFlag: boolean;
        HRME_DOL: string | null;
        HRME_LeavingReason: string | null;
        HRME_Height: string | null;
        HRME_HeightUOM: string | null;
        HRME_Weight: number | null;
        HRME_WeightUOM: string | null;
        HRME_IdentificationMark: string | null;
        HRME_ApprovalNo: string | null;
        HRME_PANCardNo: string | null;
        HRME_AadharCardNo: number | null;
        HRME_SubstituteFlag: boolean;
        HRME_NationalSSN: string | null;
        HRME_SalaryType: string | null;
        HRME_EmployeeOrder: number | null;
        HRME_ActiveFlag: boolean;
        HRME_UINumber: string | null;
        HRME_DOC: string | null;
        HRME_SubjectsTaught: string | null;
        HRME_AppDownloadedDeviceId: string | null;
        HRME_PHDResearchGuideFlg: boolean | null;
        HRME_TechNonTeachingFlg: string | null;
        HRME_RGRecognitionYear: number | null;
        HRME_AnyHealthIssue: string | null;
        HRME_EyeSightIssue: string | null;
        HRME_TransfferedTo: number | null;
        HRME_RecordTransferredFlg: boolean | null;
        HRME_MSTeamsUserId: string | null;
        HRME_MSTeamsEmailId: string | null;
        HRME_MSTeamsPassword: string | null;
        HRME_ExcPunch: boolean;
        HRME_RetiredFlg: boolean;
        HRME_PensionStoppedDate: string | null;
        HRME_FPFNotApplicableFlg: boolean | null;
        HRME_EPFNotApplicableFlg: boolean | null;
        HRME_AllowSoftwareAccessFlg: boolean | null;
        CreatedDate: string | null;
        UpdatedDate: string | null;
        [key: string]: any;
    }>;
    experienceDetails: any[];
    qualificationDetails: any[];
    documentList: Array<{
        HRMEDS_Id: number;
        MI_Id: number;
        HRME_Id: number;
        HRMEDS_DocumentName: string;
        HRMEDS_DocumentImageName: string;
        HRMEDS_DucumentDescription: string;
        CreatedDate: string;
        UpdatedDate: string;
        [key: string]: any;
    }>;
    employeeEarningsDeductionsDetails: any[];
    selectedmobile_list_dto: Array<{
        HRMEMNO_Id: number;
        HRME_Id: number;
        HRMEMNO_MobileNo: number;
        HRMEMNO_DeFaultFlag: string;
        CreatedDate: string | null;
        UpdatedDate: string | null;
        [key: string]: any;
    }>;
    selectedemail_list_dto: Array<{
        HRMEEM_Id: number;
        HRME_Id: number;
        HRMEM_EmailId: string;
        HRMEM_DeFaultFlag: string;
        CreatedDate: string | null;
        UpdatedDate: string | null;
        [key: string]: any;
    }>;
    employeebankDetails: Array<{
        HRMEB_Id: number;
        HRME_Id: number;
        HRMBD_Id: number;
        HRMEB_AccountNo: string;
        HRMEB_ActiveFlag: string;
        CreatedDate: string;
        UpdatedDate: string;
        [key: string]: any;
    }>;
    LeavingReasonList: any[] | null;
    institutiondropdownlist: any[] | null;
    retrunMsg: string;
    roleId: number | null;
    [key: string]: any;
}

// Save Qualification Request - Updated to match API structure
export interface SaveQualificationRequest {
    CreatedDate: string;
    UpdatedDate: string;
    HRMEQ_Id: number;
    MI_Id: number;
    HRMC_Id: number;
    HRME_Id: number;
    HRME_QualificationName?: string;
    HRMEQ_CollegeName?: string;
    HRMEQ_UniversityName?: string;
    HRMEQ_YearOfPassing: number;
    HRMEQ_RegistrationNo?: string;
    HRMEQ_Result?: string;
    HRMEQ_CGPAOrPerFlag?: string;
    HRMEQ_CGPA?: string;
    HRMEQ_Percentage?: string;
    HRMEQ_AreaOfSpecialisation?: string;
    HRMEQ_MedicalCouncil?: string;
    HRMEQ_Date?: string;
    HRMEQ_Hardcopy?: string;
    retrunMsg?: string;
    HRMEQ_PHDFlg: boolean;
    HRMEQ_StateId: number;
    HRMEQ_CountryId: number;
    HRMEQ_ThesisTitle?: string;
    HRMEQ_RegistrationYear: number;
    HRMEQ_GuideName?: string;
}

// Save Qualification Response
export interface SaveQualificationResponse {
    HRMEQ_Id?: number;
    retrunMsg?: string;
    success?: boolean;
    message?: string;
    [key: string]: any;
}

// Payroll APIs

// Get Employee Salary Details Request
export interface GetEmployeeSalaryDetailsRequest {
    MI_Id: number;
    HRME_Id: number;
    HRMED_Id: number;
    HRME_EmployeeCode: string;
}

export interface SalaryDetailItem {
    HREED_Id: number;
    HRME_Id: number;
    HRMED_Id: number;
    HRMED_Name: string;
    HREED_Amount: number;
    HREED_Percentage: string;
    HRMED_AmountPercentFlag: string;
    HREED_ApplicableMaxValue: number;
    HREED_MaxApplicableFlg: boolean;
    HREED_ActiveFlag: boolean;
    HRMED_EarnDedFlag: string;
    [key: string]: any;
}

// Comprehensive Salary Detail Response Item (each item in the array response)
export interface EmployeeSalaryDetailItem {
    HREED_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HRMED_Id: number;
    HREED_Amount: number;
    HREED_Percentage: string;
    HREED_ApplicablePercentage?: string; // % Applicable (separate from Actual %)
    HREED_ActiveFlag: boolean;
    HRMED_Name: string;
    HRMED_EarnDedFlag: string; // "Earning" or "Deduction"
    HRMED_AmountPercentFlag: string;
    HREED_ApplicableMaxValue: number;
    HREED_MaxApplicableFlg: boolean;
    roleId: number;
    employeedetailList?: any[];
    employeeTypedropdownlist?: any[];
    groupTypedropdownlist?: any[];
    departmentdropdownlist?: any[];
    designationdropdownlist?: any[];
    gradedropdownlist?: any[];
    Type?: string;
    earningList?: any[];
    detectionList?: any[];
    EarningDTO?: string[];
    DeductionDTO?: string[];
    ArrearDTO?: string[];
    incrementDetails?: any[];
    employeeEarningsDeductionsDetails?: string[];
    configurationDetails?: any;
    employeedropdowndetails?: any[];
    arrearList?: any[];
    grossList?: any[];
    retrunMsg?: string;
    TabName?: string;
    hrmgT_IdList?: number[];
    employeeTypeIdList?: number[];
    hrmD_IdList?: number[];
    hrmdeS_IdList?: number[];
    groupTypeIdList?: number[];
    LogInUserId?: number;
    departmentdropdown?: any[];
    designationdropdown?: any[];
    HRESD_Amount?: number;
    HRESD_Id?: number;
    hrmE_EmployeeFirstName?: string;
    HRMG_GradeName?: string;
    HRMDES_DesignationName?: string;
    HRMD_DepartmentName?: string;
    HRMET_EmployeeType?: string;
    HRMGT_EmployeeGroupType?: string;
    HRMG_Id?: number;
    HRMET_Id?: number;
    HRMD_Id?: number;
    HRMGT_Id?: number;
    HRMDES_Id?: number;
    employeegrade?: any[];
    employeedropdown?: any[];
    employeedesig?: any[];
    employeedept?: any[];
    employeeemptype?: any[];
    employeeempgrouptype?: any[];
    HRME_PHOTO?: string;
    dropdownvalus?: Array<{ Id: number; DisplayText: string }>;
    HRME_DOB?: string;
    HRME_DOJ?: string;
    HRME_DOC?: string;
    HRME_EmployeeCode?: string;
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
    CreatedDate?: string;
    UpdatedDate?: string;
    HREICED_Id?: number;
    HREICED_Percentage?: number;
    HREICED_Amount?: number;
    HREICED_ActiveFlag?: boolean;
    [key: string]: any;
}

// Response is an array of EmployeeSalaryDetailItem
export type GetEmployeeSalaryDetailsResponse = EmployeeSalaryDetailItem[];

// Get Employee Salary Details By Head Request (for calculation) - uses the same structure as EmployeeSalaryDetailItem
export type GetEmployeeSalaryDetailsByHeadRequest = EmployeeSalaryDetailItem;

// Response is an array of EmployeeSalaryDetailItem (same as getEmployeeSalaryDetails)
export type GetEmployeeSalaryDetailsByHeadResponse = EmployeeSalaryDetailItem[];

// Salary Calculation Request
export interface SalaryCalculationRequest {
    MI_Id: number;
    HRMEID_Amount: number;
}

export interface SalaryCalculationResponse {
    success?: boolean;
    message?: string;
    totalEarning?: number;
    totalDeduction?: number;
    totalArrear?: number;
    netSalary?: number;
    [key: string]: any;
}

// Save Increment Details Request
export interface SaveIncrementDetailsRequest {
    HRMEID_Id: number;
    MI_Id: number;
    HRME_Id: number;
    HRMEID_Date: string;
    HRMEID_Amount: number;
    HRMEID_PayScaleRange: string;
    HRMEID_IncrementAmount: number;
    HRMEID_AfterYear: number;
    HRMEID_AfterMonth: number;
    HRMEID_AfterDays: number;
}

export interface SaveIncrementDetailsResponse {
    success?: boolean;
    message?: string;
    retrunMsg?: string;
    [key: string]: any;
}

// Save Earning Details Request
export interface SaveEarningDetailsRequest {
    employee: {
        hrmE_Id: number;
    };
    employeeEarningDeductionArrear: Array<{
        hreeD_Id: number;
        hrmeD_Id: number;
        hreeD_Amount: number;
        hreeD_Percentage: string; // Should be "0" if zero, not empty string
        hreeD_ApplicableMaxValue?: number;
        hreeD_ActiveFlag: boolean;
    }>;
}

export interface SaveEarningDetailsResponse {
    success?: boolean;
    message?: string;
    retrunMsg?: string;
    [key: string]: any;
}

// Save Arrear Details Request
export interface SaveArrearDetailsRequest {
    employee: {
        hrmE_Id: number;
    };
    employeeEarningDeductionArrear: Array<{
        hreeD_Id: number;
        hrmeD_Id: number;
        hreeD_Amount: number;
        hreeD_Percentage: string; // Should be "0" if zero, not empty string
        hreeD_ApplicableMaxValue?: number;
        hreeD_ActiveFlag: boolean;
    }>;
}

export interface SaveArrearDetailsResponse {
    success?: boolean;
    message?: string;
    retrunMsg?: string;
    [key: string]: any;
}

// Save Deduction Details Request
export interface SaveDeductionDetailsRequest {
    employee: {
        hrmE_Id: number;
    };
    employeeEarningDeductionArrear: Array<{
        hreeD_Id: number;
        hrmeD_Id: number;
        hreeD_Amount: number;
        hreeD_Percentage: string; // Should be "0" if zero, not empty string
        hreeD_ApplicableMaxValue?: number;
        hreeD_ActiveFlag: boolean;
    }>;
}

export interface SaveDeductionDetailsResponse {
    success?: boolean;
    message?: string;
    retrunMsg?: string;
    [key: string]: any;
}

// Save Bank Details Request
export interface BankDetailItem {
    CreatedDate: string;
    UpdatedDate: string;
    HRMEB_Id: number;
    HRME_Id: number;
    HRMBD_Id: number;
    HRMEB_AccountNo: string;
    HRMEB_ActiveFlag: string;
}

export interface SaveBankDetailsRequest {
    MI_Id: number;
    HRME_Id: number;
    BankDetails: BankDetailItem[];
}

export interface SaveBankDetailsResponse {
    success?: boolean;
    message?: string;
    retrunMsg?: string;
    [key: string]: any;
}
// Update Employee Salary Details By Head Request
export interface UpdateEmployeeSalaryDetailsByHeadRequest {
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
}
