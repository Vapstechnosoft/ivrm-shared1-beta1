export interface IYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface IMemberCategory {
    almmC_Id: number;
    almmC_MembershipCategory: string;
}

export interface ICountry {
    ivrmmC_Id: number;
    ivrmmC_CountryName: string;
}

export interface IState {
    ivrmmS_Id: number;
    ivrmmS_Name: string;
}

export interface IDistrict {
    ivrmmD_Id: number;
    ivrmmD_Name: string;
}

export interface IAlumniStudentDetail {
    mI_Id: number;
    almsT_Id: number;
    almsT_FirstName: string;
    almsT_MiddleName?: string;
    almsT_LastName?: string;
    amsT_FirstName?: string; // Sometimes returned as amsT_FirstName
    almsT_AdmNo: string;
    almsT_DOB: string;
    almsT_MobileNo: number;
    almsT_emailId: string;
    almsT_PerStreet?: string;
    almsT_PerArea?: string;
    almsT_PerCity?: string;
    almsT_PerState?: number;
    almsT_PerCountry?: number;
    almsT_PerPincode?: number;
    almsT_ConStreet?: string;
    almsT_ConArea?: string;
    almsT_ConCity?: string;
    almsT_ConState?: number;
    almsT_ConCountryId?: number;
    almsT_ConPincode?: number;
    almsT_BloodGroup?: string;
    almsT_FatherName?: string;
    almsT_MotherName?: string;
    almsT_StudentPhoto?: string;
    almsT_FamilyPhoto?: string;
    asmaY_Id_Left?: number;
    asmaY_Id_Join?: number;
    asmcL_Id_Left?: number;
    asmcL_Id_Join?: number;
    amsT_CLASS_LEFT?: string;
    amsT_CLASS_JOIN?: string;
    amsT_JOIN_YEAR?: string;
    amsT_JOIN_LEFT?: string;
    almsT_SpouseName?: string;
    almsT_SpouseEmailId?: string;
    almsT_SpouseContactNo?: string;
    almsT_SpouseQulaification?: string;
    almsT_SpouseProfession?: string;
    almsT_WeddingAnniversaryDate?: string;
    almsT_NickName?: string;
    almsT_Marital_Status?: string;

    // Additional fields from JSON
    almsT_Date?: string;
    almsT_MembershipId?: string;
    almsT_MembershipCategory?: string;
    almsT_AmountPaid?: number;
    almsT_PaymentDate?: string;
    almsT_PaymentType?: string;
    almsT_ReceiptNo?: string;
    almsT_ActiveFlag?: boolean;
    ALMST_ActiveFlag?: boolean;

    // Professional & Qualification (nested or flat? JSON flat mostly but page.ts uses array?)
    // JSON shows `qualification_array: null` and flat fields like `almsT_PG_QS_DETAILS`
    qualification_array?: IQualification[];
    professionaldetailslist?: IProfessionalDetail[];
    achivementALMSTDetails?: IAchievementDetail[];

    // Other fields
    ivrmmS_Name?: string;
    ivrmmC_CountryName?: string;

    // Check fields
    readmitted_student?: boolean;
    returnvals?: boolean;

    // Display fields accessing in Page
    asmaY_Year?: string;
    asmcL_ClassName?: string;

    // Legacy uppercase fields - technically shouldn't be needed if data is consistent,
    // but if we want to keep the fallbacks in page.tsx valid, we'd add them.
    // However, better to fix page.tsx.
    // Adding optional fields that might be in alumnilist
    asmaY_Year_Left?: string;
    asmaY_Year_Join?: string;
    asmcL_ClassName_Left?: string;
    asmcL_ClassName_Join?: string;

    // Fields from search student list
    membername?: string;
    alsreG_Id?: number;
    yeardmitted?: string;
    yearleft?: string;
    classnameadmitted?: string;
    classnameleft?: string;
    alsreG_MemberName?: string;
}

export interface IAlumnusInitialData {
    alumnilist: IAlumniStudentDetail[];
    alumnilistnew: IAlumniStudentDetail[];
    membercategory: IMemberCategory[];
    fillyear: IYear[];
    fillclass: IClass[];
    countryDrpDown: ICountry[];
    statedropdown: IState[];
    districtdropdown: IDistrict[];
    almdetails: IAlumniStudentDetail[];
    flag: string;
    alumnitrue: boolean;
    studentDetails: IAlumniStudentDetail[];
}

export interface IQualification {
    Qualification?: string;
    ALMST_PUC_INS_NAME?: string;
    ALMST_PUC_PASSED_OUT?: string;
    ALSQU_Percentage?: string;
    ALMST_PLACE?: string;
    ALMST_PerState?: number;
    ALSQU_University?: string;
    ALSQU_OtherDetails?: string;
    placess1?: boolean;
    // Keys from JSON
    alsqU_Qulification?: string;
    alsqU_University?: string;
    alsqU_OtherDetails?: string;
    alsqU_Percentage?: string;
    alsqU_Place?: string;
    alsqU_YearOfPassing?: string;
}

export interface IProfessionalDetail {
    ALSPR_CompanyName?: string;
    ALSPR_Designation?: string;
    ALSPR_WorkingSince?: number;
    ALSPR_CompanyAddress?: string;
    ALSPR_EmailId?: string;
    ALSPR_OtherDetails?: string;
    // JSON keys
    alspR_CompanyName?: string;
    alspR_Designation?: string;
    alspR_WorkingSince?: number;
    alspR_CompanyAddress?: string;
    alspR_EmailId?: string;
    alspR_OtherDetails?: string;
}

export interface IAchievementDetail {
    ALSAC_Achievement?: string;
    ALSAC_Remarks?: string;
    // JSON keys
    alsaC_Achievement?: string;
    alsaC_Remarks?: string;
}

export interface IReadmittedStudent {
    ALMSTRADM_YearJoined: number;
    ALMSTRADM_YearLeft: number;
    ALMSTRADM_ClassJoined: number;
    ALMSTRADM_ClassLeft: number;
}

export interface IAlumnusSavePayload {
    ALMST_Id: number;
    ALMST_AdmNo: string;
    ASMAY_Id_Join?: number;
    ASMAY_Id_Left?: number;
    ASMCL_Id_Join?: number;
    ASMCL_Id_Left?: number;
    ALMST_DOB: string;
    ALMST_MobileNo: string;
    ALMST_FatherName: string;
    ALMST_PhoneNo: string;
    ALMST_emailId: string;
    ALMST_Marital_Status: number | string;
    ALMST_PerCountry?: number;
    ALMST_PerState?: number;
    ALMST_PerDistrict?: number;
    ALMST_ConCity?: string;
    ALMST_ConArea?: string;
    ALMST_ConStreet?: string;
    ALMST_StudentPhoto?: string;
    ALMST_FamilyPhoto?: string;
    ALMST_BloodGroup: string;
    ALMST_ConPincode?: string;
    ALSAC_Achievement?: string;
    ALSAC_Remarks?: string;
    ALSPR_CompanyName?: string;
    ALSPR_Designation?: string;
    ALSPR_WorkingSince?: number;
    ALSPR_EmailId?: string;
    ALMST_MembershipId?: string;
    ALMST_FullAddess?: string;
    ALMST_AmountPaid?: string | number;
    ALMST_MembershipCategory?: number;
    ALSPR_CompanyAddress?: string;
    ALSPR_OtherDetails?: string;
    qualification_array: IQualification[];
    ALMST_NickName: string;
    ALMST_SpouseName?: string;
    ALMST_SpouseContactNo?: string;
    ALMST_SpouseEmailId?: string;
    ALMST_SpouseQulaification?: string;
    ALMST_SpouseProfession?: string;
    ALMST_WeddingAnniversaryDate?: string;
    AMST_ID?: number;
    Readmitted_student?: boolean;
    ReadmittedStudentDTO?: IReadmittedStudent[];
}
