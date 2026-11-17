export interface ICumulativeReportInitialData {
    asmaY_Id: number;
    yearlist: IYear[];
    classlist: IClass[];
    seclist: ISection[];
    amstlist: IStudent[];
    exmstdlist: IExam[];
}

export interface IYear {
    asmaY_Id: number;
    asmaY_Year: string;
    Selected: boolean;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
    Selected: boolean;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
    Selected: boolean;
}

export interface IExam {
    emE_Id: number;
    emE_ExamName: string;
    Selected: boolean;
}

export interface IStudent {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;
    checkedsub: boolean;
}

export interface ISearchRequest {
    EME_ID: number;
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    applicableflag: boolean;
    nonapplicableflag: boolean;
    AMST_Ids: number[];
}

export interface IReportResponse {
    configuration: IConfiguration[];
    examsubjectwise_details: ISubjectDetail[];
    instname: IInstitute[];
    savelist: IReportData[];
    subjlist: IColumnSubject[];
    savenonsubjlist: IReportData[];
    nonsubjlist: IColumnSubject[];
}

export interface IConfiguration {
    exmConfig_RegnoColumnDisplay: boolean;
    exmConfig_AdmnoColumnDisplay: boolean;
    exmConfig_RollnoColumnDisplay: boolean;
    exmConfig_FailBoldFlg: boolean;
    exmConfig_FailItalicFlg: boolean;
    exmConfig_FailUnderscoreFlg: boolean;
    exmConfig_FailColorFlg: string;
}

export interface ISubjectDetail {
    ismS_Id: number;
    eyceS_MarksDisplayFlg: boolean;
    eyceS_GradeDisplayFlg: boolean;
}

export interface IInstitute {
    mI_Name: string;
}

export interface IReportData {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_LastName: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;
    classheld: number;
    classatt: number;
    estmP_TotalObtMarks: number;
    estmP_TotalMaxMarks: number;
    estmP_Percentage: number;
    estmP_TotalGrade: string;
    estmP_SectionRank: number | string;
    estmP_ClassRank: number | string;
    estmP_Result: string;
    ismS_Id: number;
    estmpS_MaxMarks: number;
    estmpS_ObtainedMarks: number;
    estmpS_ObtainedGrade: string;
    estmpS_PassFailFlg: string;
    empatY_PaperTypeName: string;
    empatY_Color: string;
    // Client-side helper properties
    sub_list?: IStudentSubject[];
    sub_list_e?: IStudentSubject[];
}

export interface IColumnSubject {
    ismS_Id: number;
    ismS_SubjectName: string;
}

export interface IStudentSubject {
    amsT_Id: number;
    ismS_Id: number;
    ismS_SubjectName?: string;
    estmpS_MaxMarks: number;
    estmpS_ObtainedMarks: number;
    estmpS_ObtainedGrade: string;
    estmpS_PassFailFlg: string;
    empatY_PaperTypeName: string;
    empatY_Color: string;
    // Styling properties
    styleweigh?: string;
    styleitalic?: string;
    styleunderline?: string;
    stylecolor?: string;
    eyceS_MarksDisplayFlg?: boolean;
    eyceS_GradeDisplayFlg?: boolean;
    hema_estmpS_ObtainedMarks?: number | string;
    hema_estmpS_ObtainedGrade?: string;
}
