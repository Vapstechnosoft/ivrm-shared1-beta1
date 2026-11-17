export interface IMasterClassList {
    asmcL_Id: number;
    mI_Id: number;
    asmcL_ClassCode: string;
    asmcL_ClassName: string;
    asmcL_Order: number;
    asmcL_MinAgeYear: number;
    asmcL_MinAgeMonth: number;
    asmcL_MinAgeDays: number;
    asmcL_MaxAgeYear: number;
    asmcL_MaxAgeMonth: number;
    asmcL_MaxAgeDays: number;
    asmcL_MaxCapacity: number;
    asmcL_PreadmFlag: number;
    asmcL_ActiveFlag: boolean;
}
export interface IMasterCategoryList {
    amC_Id: number;
    mI_Id: number;
    amC_Name: string;
    amC_Address: string;
    amC_Type: string;
    amC_ActiveFlag: number;
    amC_PAApplicationName: string;
    amC_Logo: string;
    amC_FilePath: string;
    createdDate: string;
    updatedDate: string;
}
export interface IMasterSectionList {
    asmS_Id: number;
    mI_Id: number;
    asmC_SectionCode: string;
    asmC_SectionName: string;
    asmC_Order: number;
    asmC_MaxCapacity: number;
    asmC_ActiveFlag: number;
    createdDate: string;
    updatedDate: string;
}
export interface IMasterReligionList {
    ivrmmR_Id: number;
    ivrmmR_Name: string;
    is_Active: boolean;
    createdDate: string;
    updatedDate: string;
}
export interface IMasterClassCategoryList {
    asmcC_Id: number;
    asmaY_Year: string;
    amC_Name: string;
    asmcL_ClassName: string;
    is_Active: number;
}
export interface IAcademicYearDropDown {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order: number;
    asmaY_From_Date: string;
    asmaY_To_Date: string;
    asmaY_PreAdm_F_Date: string;
    asmaY_PreAdm_T_Date: string;
}
export interface IMasterCategoryDropDown {
    amC_Id: number;
    amC_Name: string;
}
export interface IMasterClassDropDown {
    asmcL_Id: number;
    asmcL_ClassCode: string;
    asmcL_ClassName: string;
    asmcL_Order: number;
}
export interface IMasterClassSectionDropDown {
    imcT_Id: number;
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmS_Id: number;
    asmC_SectionName: string;
}
export interface IMasterSectionDropDown {
    asmS_Id: number;
    asmC_SectionCode: string;
    asmC_SectionName: string;
    asmC_Order: number;
}
export interface IMasterCasteCategoryList {
    imcC_Id: number;
    imcC_CategoryName: string;
    imcC_CategoryDesc: string;
    imcC_CategoryCode: string;
    createdDate: string;
    updatedDate: string;
}
export interface IMasterCasteList {
    mI_Id: number;
    imC_Id: number;
    imcC_Id: number;
    imC_CasteName: string;
    imC_CasteDesc: string;
    createdDate: string;
    updatedDate: string;
}
export interface IMasterCasteCategoryDropDown {
    imcC_Id: number;
    imcC_CategoryName: string;
}

export interface IMasterDocumentList {
    amsmD_Id: number;
    mI_Id: number;
    amsmD_DocumentName: string;
    amsmD_Description: string;
    amsmD_FLAG: boolean;
    amsmD_ActiveFlag: boolean;
}
export interface IMasterReferenceList {
    pamR_Id: number;
    pamR_ReferenceName: string;
    pamR_ReferenceDesc: string;
    createdDate: string;
    updatedDate: string;
}
export interface IMasterSourceList {
    pamS_Id: number;
    pamS_SourceName: string;
    pamS_SourceDesc: string;
    createdDate: string;
    updatedDate: string;
}
export interface IMasterReligionCasteCategoryList {
    ircC_Id: number;
    ivrmmR_Name: string;
    imcC_CategoryName: string;
    ircC_ActiveFlg: boolean;
    ircC_CreatedDate: string;
}

export interface IMasterConfiguration {
    ispaC_Id: number;
    asmaY_Id: number;
    academic_year: string;
    trust_name: string;
    institution_name: string;
    ispaC_EnquiryApplFlag: 0 | 1;
    ispaC_ApplIssueFlag: 0 | 1;
    ispaC_EnqSMSFlag: 0 | 1;
    ispaC_EnqMailFlag: 0 | 1;
    ispaC_EnqMailBackground: 0 | 1;
    ispaC_ApplFeeFlag: 0 | 1;
    ispaC_ApplnDownladFlag: 0 | 1;
    ispaC_ApplSMSFlag: 0 | 1;
    ispaC_ApplMailFlag: 0 | 1;
    ispaC_ApplMailBackground: 0 | 1;
    ispaC_DOBMaxAgeFlag: 0 | 1;
    ispaC_DOBMinAgeFlag: 0 | 1;
    ispaC_ApplCutOffDateFlag: 0 | 1;
    ispaC_ApplNoGenFlag: 0 | 1;
    ispaC_DefaultStatusFlag: 0 | 1;
    ispaC_OralTestBy: 0 | 1;
    ispaC_EnquiryNoGenFlag: 0 | 1;
    ispaC_RgNoGenFlag: 0 | 1;
    ispaC_RegSMSFlag: 0 | 1;
    ispaC_RegMailFlag: 0 | 1;
    ispaC_RegMailBackground: 0 | 1;
    ispaC_AdmCategoryFlag: 0 | 1;
    ispaC_WrittenTestApplFlag: 0 | 1;
    ispaC_MarksEntry: 0 | 1;
    ispaC_OralTestApplFlag: 0 | 1;
    ispaC_SeatBlockFlag: 0 | 1;
    ispaC_FatherAliveFlag: 0 | 1;
    ispaC_MotherAliveFlag: 0 | 1;
    ispaC_MaritalStatusFlag: 0 | 1;
    ispaC_FeePaymentFlag: 0 | 1;
    ispaC_AdmissionTransfer: 0 | 1;
    ispaC_EnableSiblingsLink: 0 | 1;
    ispaC_SibblingConcessionFlag: 0 | 1;
    ispaC_ParentConcessionFlag: 0 | 1;
    ispaC_ECSFlag: 0 | 1;
    ispaC_HostelFlag: 0 | 1;
    ispaC_TransaportFlag: 0 | 1;
    ispaC_GymFlag: 0 | 1;
    ispaC_EnquiryNo_ApplNo_RegNo: 0 | 1;
    ispaC_OralByMax_Marks: number;
    ispaC_OralByMin_Marks: number;
    ispaC_ProspectusFlag: 0 | 1;
    ispaC_Transfer_Settings_Flag: 0 | 1;
    amC_Id: number;
    ispaC_Transfer_Settings_after_payment_Flag: 0 | 1;
    ispaC_ProsptFeeApp: 0 | 1;
    ispaC_OralTestSchApplFlag: 0 | 1;
    ispaC_OralMarksFlag: 0 | 1;
    ispaC_RegFeeFlag: 0 | 1;
    ispaC_WrittenTestSchApplFlag: 0 | 1;
    ispaC_CommonScheduleFlag: 0 | 1;
    ispaC_NoofApplications: number;
    ispaC_Healthapp: 0 | 1;
    ispaC_FullPaymentCompFlg: 0 | 1;
    ispaC_OfflineFee_Flag: 0 | 1;
    ispaC_ApplNoIncrementFlg: boolean;
    ispaC_ApplNoIncrementBy: number;
}

export interface IMasterClassTeacherList {
    imcT_Id: number;
    asmaY_Year: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    employee_code: string;
    employee_name: string;
    imcT_ActiveFlag: boolean;
}

export interface IAcademicYearMasterConfiguration {
    ispaC_Id: number;
    ispaC_NoofApplications: number;
    ispaC_ApplFeeFlag: 0 | 1;
    ispaC_RegMailFlag: 0 | 1;
    ispaC_RegSMSFlag: 0 | 1;
    ispaC_ApplMailFlag: 0 | 1;
    ispaC_ApplSMSFlag: 0 | 1;
    ispaC_ApplCutOffDateFlag: 0 | 1;
    ispaC_DOBMinAgeFlag: 0 | 1;
    ispaC_DOBMaxAgeFlag: 0 | 1;
    asmaY_Cut_Of_Date: string | null;
}

export interface IMasterClassSetOrderList {
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmcL_Order: number;
}
export interface IMasterSectionSetOrderList {
    asmS_Id: number;
    asmC_SectionName: string;
    asmC_Order: number;
}

export interface IMasterClassCategorySectionList {
    asmcC_Id: number;
    asmaY_Id: number;
    asmaY_Year: string;
    amC_Id: number;
    amC_Name: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
    // Flattened section properties (used when row data is from flattened array)
    asmccS_Id?: number;
    asmS_Id?: number;
    asmC_SectionName?: string;
    asmccS_ActiveFlg?: boolean;
    // Nested sections array (used when data is from API)
    sections?: {
        asmccS_Id: number;
        asmcC_Id: number;
        asmS_Id: number;
        asmC_SectionName: string;
        asmccS_ActiveFlg: boolean;
    }[];
}
export interface Student {
    amst_sol: string;
    amsT_SOL: number;
    student_id: number;
    student_name: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    amsT_AdmNo: string;
    amaY_RollNo: number;
    registration_no: string;
    admission_no: string;
}

export interface StudentData {
    student_id: number;
    reason: string;
    remark: string;
}
export interface IConcessionDropDown {
    fmcC_Id: number;
    fmcC_ConcessionName: string;
}
