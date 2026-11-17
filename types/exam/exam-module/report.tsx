// src/types/exam/exam-module/report.ts
export interface ISubject {
    ismS_Id: number;
    ismS_SubjectName: string;
    eyceS_AplResultFlg: boolean;
    type: 'Marks' | 'Grade';
    eyceS_MarksDisplayFlg?: boolean;
    eyceS_GradeDisplayFlg?: boolean;
    eyceS_SubjectOrder?: number;
    estmpS_MaxMarks?: number | null;
}
export interface ICumulativeReport {
    amsT_FirstName: string;
    amaY_RollNo?: number | null;
    amsT_AdmNo?: string | null;
    amsT_RegistrationNo?: string | null;
    sub_list: Array<{
        ismS_Id: number;
        estmpS_ObtainedMarks?: number | null;
        estmpS_ObtainedGrade?: string | null;
        estmpS_PassFailFlg?: string | null;
    }>;
    estmP_TotalMaxMarks?: number | null;
    estmP_TotalObtMarks?: number | null;
    estmP_Percentage?: number | null;
    estmP_TotalGrade?: string | null;
    estmP_Result?: string | null;
    estmP_ClassRank?: string | number | null;
    estmP_SectionRank?: string | number | null;
    classheld?: number | null;
    classatt?: number | null;
}

export interface IReportHeader {
    mI_name?: string;
    yr?: string;
    cla?: string;
    sec?: string;
    exmmid?: string;
    mI_Name?: string;
}
export interface IAcademicYearandClass {
    mI_Id?: number;
    asmaY_Id: number;
    asmaY_Year: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface IAcademicYearandClassandsection {
    mI_Id?: number;
    asmaY_Id: number;
    asmaY_Year: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmS_Id: number;
    asmC_SectionName: string;
    emE_Id: number;
    emE_ExamName: string;
    amsT_Id: number;
    amsT_FirstName: string;
    emcA_Id: number;
    emcA_CategoryName: string;
}

export interface IExamReportCard {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_FatherName?: string;
    amsT_DOB?: string;
    amaY_RollNo?: number | null;
    amsT_AdmNo?: string | null;
    amsT_RegistrationNo?: string | null;
    sub_list: Array<{
        ismS_Id: number;
        estmpS_ObtainedMarks?: number | null;
        estmpS_ObtainedGrade?: string | null;
        estmpS_PassFailFlg?: string | null;
        estmpS_MaxMarks?: number | null;
    }>;
    estmP_TotalMaxMarks?: number | null;
    estmP_TotalObtMarks?: number | null;
    estmP_Percentage?: number | null;
    estmP_TotalGrade?: string | null;
    estmP_Result?: string | null;
    estmP_ClassRank?: string | number | null;
    estmP_SectionRank?: string | number | null;
    classheld?: number | null;
    classatt?: number | null;
    estmP_TotalGradeRemark?: string;
}

export interface IExamElectivesReport {
    asmaY_Id: number;
    asmaY_Year: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmS_Id: number;
    asmC_SectionName: string;
    emE_Id: number;
    emE_ExamName: string;
    amsT_Id: number;
    amsT_FirstName: string;
    emcA_Id: number;
    emcA_CategoryName: string;
    emG_Id: number;
    emG_GroupName: string;
    ismS_Id: number;
    ismS_SubjectName: string;
}

export interface ElectiveGroup {
    emG_Id: number;
    emG_GroupName: string;
}

export interface StudentSubject {
    ismS_Id: number;
    ismS_SubjectName: string;
    emG_GroupName?: string;
}

export interface StudentRow {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo?: string;
    amsT_MobileNo?: string;
    amsT_emailId?: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    sub_list: StudentSubject[];
}

// Add these interfaces at the top of your types file
export interface CategoryItem {
    emcA_Id: number;
    emcA_CategoryName: string;
    mI_Id?: number;
    eyC_Id?: number;
}

export interface SubjectGroupItem {
    emG_Id: number;
    emG_GroupName: string;
}

export interface SubjectItem {
    ismS_Id: number;
    ismS_SubjectName: string;
}

export interface ClassItem {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface SectionItem {
    asmS_Id: number;
    asmC_SectionName: string;
}

// Add this interface
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

export interface IMasterInstitution {
    mI_Id: number;
    mI_Name: string;
    mI_Logo: string;
}

// types/institution.ts

export interface Institution {
    mI_Id: number;
    mO_Id: number;
    mI_Name: string;
    mI_Type: string;
    mI_Address1: string;
    mI_Address2: string;
    mI_Address3: string;
    mI_AddressArea: string | null;
    ivrmmcT_Name: string;
    ivrmmS_Id: number;
    ivrmmC_Id: number;
    mI_Pincode: number;
    mI_FaxNo: string | null;
    mI_BackgroundImage: string | null;
    mI_FormColor: string;
    mI_FontColor: string;
    mI_FontSize: number;
    mI_WeekStartDay: string | null;
    mI_DateFormat: string | null;
    mI_DateSeparator: string | null;
    mI_Logo: string;
    mI_Precision: number | null;
    mI_GradingSystem: string | null;
    mI_PasswordFlag: string | null;
    mI_ActiveFlag: number;
    mI_FranchiseFlag: number;
    mI_Affiliation: string;
    organisation: string | null;
    mI_Subdomain: string;
    mI_AboutInstitute: string;
    mI_ContactDetails: string;
    mI_HelpFile: string;
    mI_SchoolCollegeFlag: string;
    mI_PAN: string | null;
    mI_TAN: string | null;
    mI_GPSUserName: string | null;
    mI_IVRSVirtualNo: string | null;
    mI_IVRSOutboundNo: string | null;
    mI_NAAC_InstitutionTypeFlg: string;
    mI_NAAC_SubInstitutionTypeFlg: string;
    mI_VCStudentFlag: string;
    mI_VCOthersFlag: string;
    mI_80GRegNo: string | null;
    mI_PaymentReminderAPI: string | null;
    mI_Code: string | null;
    mI_MSTeamsClientId: string | null;
    mI_MSTeamsTenentId: string | null;
    mI_MSTemasClinetSecretCode: string | null;
    mI_MSTeamsAppAccessTockenURL: string | null;
    mI_MSTeamsUserAceessTockenURL: string | null;
    mI_MSTeamsMeetingScheduleURL: string | null;
    mI_MSTeamsAdminUsername: string | null;
    mI_MSTeamsAdminPassword: string | null;
    mI_MSTeamsScope: string | null;
    mI_MSTeamsGrantType: string | null;
    mI_SMSAlertToemailids: string | null;
    mI_SMSCountAlert: number | null;
    mI_WhatsAppTextUrl: string | null;
    mI_WhatsAppImageUrl: string | null;
    mI_WhatsAppPdfUrl: string | null;
    mI_WhatsAppVideoUrl: string | null;
    mI_WhatsAppAudioUrl: string | null;
    mI_EntityId: string;
    mI_PGRegisteredEmailId: string | null;
    mI_WhatsAppto: string | null;
    mI_WhatsAppName: string | null;
    mI_WhatsApptype: string | null;
    mI_WhatsAppToken: string | null;
    createdDate: string;
    updatedDate: string;
}

export interface InstitutionResponse {
    success: boolean;
    message: string;
    data: Institution;
    total: number | null;
    page: number | null;
    page_size: number | null;
}

