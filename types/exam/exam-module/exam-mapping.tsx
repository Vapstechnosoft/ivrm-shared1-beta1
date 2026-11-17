import type { ReactNode } from 'react';

// EXAM MAPPING
export interface IYearlyCategorySubjectMapping {
    eyC_Id: number;
    eyC_BasedOnPaperTypeFlg: boolean;
    asmaY_Id: number;
    asmaY_Year: string;
    emcA_CategoryName: string;
    emcA_Id: number;
    eycG_Id: number;
    emG_Id: number;
    emG_GroupName: string;
    emG_ElectiveFlg: boolean;
    eyC_ActiveFlg: boolean;
    eycG_ActiveFlg: boolean;
    asmaY_Order: number;
}

export interface IYearlyCategorySubjectMappingViewDetails {
    eycgS_Id: number;
    eycG_Id: number;
    ismS_Id: number;
    asmaY_Id: number;
    asmaY_Year: string;
    emcA_CategoryName: string;
    emG_GroupName: string;
    ismS_SubjectName: string;
    ismS_SubjectCode: string;
}

// interface.ts
// -----------------------------------------------------------------------------
// Defines all type structures used in the Exam Login Privileges master module
// -----------------------------------------------------------------------------

export interface IExamLoginPrivileges {
    elP_Id: number;
    asmaY_Year: string;
    ivrmstauL_Id: number;
    hrmE_EmployeeName: string;
    elP_ActiveFlg: boolean;
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmS_Id: number;
    asmC_SectionName: string;
    asmaY_Order: number;
}

export interface IExamLoginPrivilegesForm {
    asmaY_Id: number;
    ivrmulF_Id: number;
    hrmE_Id: number;
    entryType: 'ct' | 'st' | 'others';
    classIds: number[];
    sectionIds: number[];
    subjectIds: number[];
    subSubjectIds?: number[];
}
export interface ILoginPrivilegeDetails {
    ismS_SubjectName: string;
    emsS_SubSubjectName: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmS_Id: number;
    asmC_SectionName: string;
    activeFlg: boolean;
    elpS_Id: number;
    elpsS_Id: number;
    elP_Id: number;
}

export interface IExamLoginPrivilegesEditDetails {
    asmaY_Id: number;
    login_Id: number;
    elP_Flg: string;
    ivrmulF_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    ismS_Id: number;
    emp_Code: number;
    hrmE_Id: number;
    emsS_Id: number;
}

export interface IYearlyCategorySubjectMappingView {
    slno?: number;
    asmaY_Year: string;
    emcA_CategoryName: string;
    emG_GroupName: string;
    emG_ElectiveFlg: boolean;
    eycG_ActiveFlg: boolean;
    eycG_Id: number;
}

export interface IYearlyCategoryDatesMapping {
    asmaY_Id: number;
    eyC_Id: number;
    emcA_Id: number;
    asmaY_Year: string;
    emcA_CategoryName: string;
    eyC_ExamStartDate: string;
    eyC_ExamEndDate: string;
    eyC_MarksEntryLastDate: string;
    eyC_MarksProcessLastDate: string;
    eyC_MarksPublishDate: string;
}

export interface IExamSubjectGroupMapping {
    esG_Id: number;
    asmaY_Id: number;
    asmaY_Year: string;
    emcA_CategoryName: string;
    esG_SubjectGroupName: string;
    esG_ExamPromotionFlag: 'IE' | 'PE';
    esG_GroupMinMarks: number;
    esG_GroupMaxMarks: number;
    emE_ExamName?: string | null;
    esgE_Id: number;
    esG_CompulsoryFlag: 'Y' | 'N';
    asmaY_Order: number;
}

export interface IExamSubjectGroupingDetails {
    emcA_CategoryName: string;
    esG_SubjectGroupName: string;
    esG_GroupMinMarks: number;
    esG_GroupMaxMarks: number;
    emE_ExamName: string;
    esG_Id: number;
    esgE_Id: number;
    esG_CompulsoryFlag: 'Y' | 'N';
    ismS_SubjectName: string;
    esgS_Id: number;
    asmaY_Id: number;
    emcA_Id: number;
    emE_Id: number;
    ismS_Id: number;
    esgS_ActiveFlag: boolean;
}

export interface IESubject {
    ismS_Id: number;
    ismS_SubjectName: string;
    ismS_OrderFlag: number;
    eyceS_AplResultFlg?: boolean;
}

export interface IExamTermAndExamMapping {
    ecT_Id?: number | null;
    asmaY_Id: number;
    emcA_Id: number;
    ecT_TermName: string;
    ecT_TermStartDate: string;
    ecT_TermEndDate: string;
    ecT_Marks: number;
    ecT_MinMarks: number;
    ecT_ActiveFlag: boolean;
    ecT_PublishDate: string;
    asmaY_Year: string;
    emcA_CategoryName: string;
    emgR_GradeName?: string;
    emgR_Id?: number;
    saveddetails: IExamTermAndExamMappingDetails[];
}

export interface IExamTermAndExamMappingDetails {
    ecteX_Id: number;
    emE_Id: number;
    emE_ExamName: string;
    ecteX_MarksPercentValue: number;
    ecteX_MarksPerFlag: 'M' | 'P';
    ecteX_NotApplToTotalFlg: boolean;
    ecteX_ActiveFlag: boolean;
    emE_ExamOrder: number;
    ecT_Id: number;
    ecteX_RoundOffReqFlg: boolean;
    ecteX_ConversionReqFlg: boolean;
}

export interface IExamSubjectWizard {
    eycE_Id: number;
    eyC_Id: number;
    emcA_Id: number;
    asmaY_Id: number;
    emE_Id: number;
    emgR_Id: number;
    asmaY_Year: string;
    emcA_CategoryName: string;
    emE_ExamName: string;
    emE_ExamCode: string;
    emgR_GradeName: string;

    eycE_AttendanceFromDate: string;
    eycE_AttendanceToDate: string;

    eycE_SubExamFlg: boolean;
    eycE_SubSubjectFlg: boolean;
    eycE_ActiveFlg: boolean;

    asmaY_Order: number;
    eycE_BestOf: number;
    eycE_BestOfApplicableFlg: boolean;

    createdBy?: string;
    createdDate?: string;
    modifiedBy?: string;
    modifiedDate?: string;

    slno?: number;
    selected?: boolean;

    subExamList?: {
        emsE_Id: number;
        emsE_SubExamName: string;
        eycE_SubExamFlg?: boolean;
        eycE_MaxMarks?: string;
        eycE_MinMarks?: string;
        emgR_Id?: number;
        emgR_GradeName?: string;
        exemptedFlg?: boolean;
        exemptedPer?: string;
    }[];

    subSubjectList?: {
        emsS_Id: number;
        emsS_SubSubjectName: string;
        eycE_SubSubjectFlg?: boolean;
        eycE_MaxMarks?: string;
        eycE_MinMarks?: string;
        emgR_Id?: number;
        emgR_GradeName?: string;
        exemptedFlg?: boolean;
        exemptedPer?: string;
    }[];
}

export interface IExamSubjectOrder {
    eyceS_Id: number;
    eycE_Id: number;
    ismS_Id: number;
    ismS_SubjectName: string;
    ismS_SubjectCode: string;
    eyceS_SubjectOrder: number;
}

export interface IExamSubjectWizardDetails {
    eyceS_Id: number;
    eycE_Id: number;
    ismS_Id: number;
    emcA_CategoryName: string;
    emE_ExamName: string;
    emgR_GradeName: string;
    ismS_SubjectName: string;
    ismS_SubjectCode: string;
    eyceS_MaxMarks: number;
    eyceS_MinMarks: number;
    eyceS_MarksEntryMax: number;
    eyceS_SubExamFlg: boolean;
    eyceS_SubSubjectFlg: boolean;
    eyceS_MarksGradeEntryFlg: string;
    eyceS_MarksDisplayFlg: boolean;
    eyceS_GradeDisplayFlg: boolean;
    eyceS_AplResultFlg: boolean;
    eyceS_SubjectOrder: number;
    eyceS_ActiveFlg: boolean;
    pT_Count: number;
}

export interface ICoScholasticActivityAreaMapping {
    ecacT_SkillName?: string; // "ACTIVITY"
    ecactA_SkillArea?: string; // "ART EDUCATION"
    emgR_GradeName?: string; // "100 Marks Percentage"
    ecactaM_Id?: number; // 19
    emgR_Id?: number; // 133
    ecactaM_ActiveFlag: boolean; // true
    ecactaM_IndicatorDescription?: string | null; // "string" (or null)
    asmaY_Year?: string; // "2024-2025"
    asmaY_Order?: number;
    ecacT_Id?: number;
    ecactA_Id?: number;
    asmaY_Id?: number; // 26
}

export interface ISubSubjectSubExamMapped {
    eycessS_Id: number;
    eyceS_Id: number;
    ismS_Id: number;
    emsS_Id: number;
    emgR_GradeName: string;
    ismS_SubjectName: string;
    ismS_SubjectCode: string;
    emsS_SubSubjectName?: string;
    emsS_SubSubjectCode?: string;
    emsE_SubExamName?: string;
    emsE_SubExamCode?: string;
    eycessS_MaxMarks: number;
    eycessS_MinMarks: number;
    eycessS_ExemptedFlg: boolean;
    eycessS_ExemptedPer: number;
    eycessS_SubSubjectOrder: number;
    eycessS_ActiveFlg: boolean;
    eycessS_GradesFlg: boolean;
    eycessS_MarksFlg: boolean;
    eycessS_AplResultFlg?: boolean;
    eycessS_MarksEntryMax?: number;
}

export interface ILifeSkillAreaMapping {
    ecsaM_Id: number;
    ecsA_Id: number;
    ecS_Id: number;
    mI_Id: number;
    asmaY_Id: number;
    emgR_Id: number;
    ecS_SkillName: string;
    ecsA_SkillArea: string;
    ecsaM_IndicatorDescription: string;
    emgR_NAME: string;
    asmaY_Year: string;
    asmaY_Order?: number;
    ecsaM_ActiveFlag: boolean;
    createdDate?: string;
    updatedDate?: string;
}
export interface CategoryDetail {
    eycE_Id: number;
    eycE_CategoryFlg: boolean;
    mycL_CategoryName: string;
    mycL_Id: number;
}
export interface ExamDetail {
    eycE_Id: number;
    eycE_ExamFlg: boolean;
    emE_Id: number;
    emE_ExamName: string;
}

export interface IExamMarksProcessCondition {
    eycE_Id: number;
    eyC_Id: number;

    asmaY_Id: number;
    asmaY_Year: string;

    emcA_Id: number;
    emcA_CategoryName: string;

    emE_Id: number;
    emE_ExamName: string;
    emE_ExamCode: string;

    emgR_GradeName?: string;

    eycE_AttendanceFromDate?: string | null;
    eycE_AttendanceToDate?: string | null;

    eycE_SubExamFlg: boolean;
    eycE_SubSubjectFlg: boolean;
    eycE_ActiveFlg: boolean;

    eycE_ExamStartDate?: string | null;
    eycE_ExamEndDate?: string | null;
    eycE_MarksEntryLastDate?: string | null;
    eycE_MarksProcessLastDate?: string | null;
    eycE_MarksPublishDate?: string | null;
}

export interface IExamWiseRemarksGrid {
    asmS_Id: number;
    asmC_SectionName: string;
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_Order: number;
    emE_Id: number;
    emE_ExamName: string;
    emE_ExamOrder: number;
}

export interface IExamWiseStudentRemarksStudent {
    amsT_FirstName: string;
    amsT_Id: number;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;
    amsT_AdmNo: string;
    emeR_Remarks: string | null;
    estmP_TotalObtMarks: number;
    estmP_TotalMaxMarks: number;
    estmP_Percentage: number;
}

export interface IHallTicketGeneratedItem {
    asmaY_Year: string;
    emE_ExamName: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    asmaY_Order: number;
    asmcL_Id: number;
    asmS_Id: number;
    asmaY_Id: number;
    emE_Id: number;
}

// Student List Response
export interface IHallTicketStudentItem {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    ehT_HallTicketNo: string;
    amaY_Rollno: number;
    ehT_Id: number;
    ehT_PublishFlg: boolean | null;
    asmcL_ClassName: string;
    asmC_SectionName: string;
}

export interface IPromotionRemarksGrid {
    slNo: number;
    admNo: string;
    studentName: string;
    studentId: number;
    remarks: string; // Changed from string?
    estmP_Id?: number;
    ecT_Id?: number;
}

export interface IPromotionSetting {
    emP_Id: number;
    eyC_Id: number;
    emcA_Id: number;
    asmaY_Id: number;
    emgR_Id: number;

    asmaY_Year: string;
    asmaY_Order: number;

    emcA_CategoryName: string;
    emgR_GradeName: string;

    emP_PassToIndSubjectFlg: boolean;
    emP_PassToOverallFlag: boolean;

    emP_MarksPerFlg: 'M' | 'P'; // M = Marks, P = Percentage

    emP_ActiveFlag: boolean;

    emP_BestOf: number | null;
    emP_BestOfApplicableFlg: boolean;
}

export interface IPromotionCategory {
    eyC_Id: number;
    emcA_CategoryName: string;
}

export interface IExamPromotionalSettingDetails {
    eycsE_Id: number; // Subject Mapping ID  (Row ID)
    eycE_Id: number; // Parent ExamId (FK)
    emS_Id: number; // Subject Id
    subjectName: string;
    maxMarks: number;
    minMarks: number;
    passPercentage?: number;
    isActive: boolean;
}

export interface IExamSubjectGroupDetails {
    emcA_Id: number;
    emcA_CategoryName: string;
    emE_Id: number;
    emE_ExamName: string;
}

// types/exam/student-transaction.ts

export interface IStudentTransactionGrid {
    slNo: number;
    amsT_Id: number;
    studentName: string;
    regNumber: string;
    rollNumber: number;
    score: number;
    checked?: boolean;
}

export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface IExamTerm {
    ect_Id: number;
    ect_TermName: string;
}

export interface ISkillActivity {
    id: number;
    name: string;
    type: 'skill' | 'activity';
}

export interface ISkillName {
    ecactA_Id: number;
    ecactA_SkillArea: string;
}

export interface ISkillArea {
    id: number;
    name: string;
    skillNameId: number;
}

export interface IActivityName {
    ecactA_SkillArea: ReactNode;
    id: number;
    name: string;
}

export interface IActivityArea {
    ecactA_SkillArea: ReactNode;
    id: number;
    name: string;
    activityNameId: number;
}

export interface IPromotionalSubjectDetails {
    empS_Id: number;
    emP_Id: number;
    ismS_Id: number;

    emcA_CategoryName: string;
    emgR_GradeName: string;
    emgR_Id: number;

    ismS_SubjectName: string;
    ismS_SubjectCode: string;

    empS_MaxMarks: number;
    empS_MinMarks: number;
    empS_ConvertForMarks: number;

    empS_AppToResultFlg: boolean;
    empS_ActiveFlag: boolean;

    empS_SubjOrder: number;
}

export interface IPromotionalGroupDetails {
    empsG_Id: number;
    emps_Id: number;

    isms_Id: number;
    isms_SubjectName: string;
    isms_SubjectCode: string;

    empsG_GroupName: string;
    empsG_DisplayName: string;

    empsG_PercentValue: number;
    empsG_MarksValue: number;
    empsG_MaxOff: number;
    empsG_BestOff: number | null;

    empsG_ActiveFlag: boolean;
    empsG_RoundOffFlag: boolean;

    empsG_Order: number;
}


export interface IPromotionalGroupMappedExamDetails {
    empsgE_Id: number;

    emE_Id: number;
    emE_ExamName: string;
    emE_ExamCode: string;

    empsG_Id: number;
    empsG_GroupName: string;
    empsG_DisplayName: string;

    empsgE_ForMaxMarkrs: number;
    empsgE_ConvertionReqOrNot: boolean;
    empsgE_ActiveFlg: boolean;
}

export interface ISearchMarksEntryParams {
    ASMS_Id: number;
    ASMCL_Id: number;
    ASMAY_Id: number;
    EME_Id: number;
    ISMS_Id: number;
}

export interface IBackendSubjectDetail {
    eyceS_Id: number;
    eycE_Id: number;
    ismS_Id: number;
    emgR_Id: number;
    eyceS_MarksEntryMax: number;
    eyceS_MaxMarks: number;
    eyceS_MinMarks: number;
    eyceS_SubExamFlg: boolean;
    eyceS_SubSubjectFlg: boolean;
    eyceS_MarksGradeEntryFlg: 'M' | 'G';
    eyceS_MarksDisplayFlg: boolean;
    eyceS_GradeDisplayFlg: boolean;
    eyceS_AplResultFlg: boolean;
    eyceS_ActiveFlg: boolean;
    eyceS_SubjectOrder: number;
    createdDate: string;
    updatedDate: string;
}

export interface IBackendStudent {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;
    ismS_Id: number;
    ismS_SubjectName: string;
    eyceS_MaxMarks: number;
    eyceS_MinMarks: number;
    eyceS_MarksEntryMax: number;
    estM_Marks: number | null;
    estM_Grade: string | null;
    estM_Flg: string | null;
    estM_Id: number;
    param: any;
    amsT_Sex: string | null;
    estmanssH_Id: number;
    estmanssH_AnswerSheet: string | null;
    estmanssH_FileLocation: string | null;
    papertype?: string;
    papertypeid?: number;
}

export interface IBackendSubSubject {
    emsS_Id: number;
    emsS_Name: string;
    emsS_SubSubjectCode?: string;
    eycessS_MaxMarks: number;
    eycessS_MinMarks: number;
    eycessS_MarksEntryMax: number;
}

export interface IBackendSubExam {
    emsE_Id: number;
    emsE_Name: string;
    eycessE_MaxMarks: number;
    eycessE_MinMarks: number;
    eycessE_MarksEntryMax: number;
}

export interface IBackendGradeDetail {
    emgD_Id: number;
    emgD_Name: string;
    emgD_MinMarks?: number;
    emgD_MaxMarks?: number;
    emgD_AddFlg?: boolean;
}

export interface IBackendSearchResponse {
    saved_sub_subject_list: any;
    saved_sub_subject_exam_list: any;
    emsS_Id: number;
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    emE_Id: number;
    ismS_Id: number;
    subject_details: IBackendSubjectDetail[];
    eyceS_MarksGradeEntryFlg: 'M' | 'G';
    eyceS_SubSubjectFlg: boolean;
    subject_subsubjects: IBackendSubSubject[];
    eyceS_SubExamFlg: boolean;
    subject_subexams: IBackendSubExam[];
    emgR_Id: number;
    grade_details: IBackendGradeDetail[];
    studentList: IBackendStudent[];
    get_student_wise_papertype_list: any[];
    subsubject_gradedetails: IBackendGradeDetail[];
    subexam_gradedetails: IBackendGradeDetail[];
    saved_studentList: IBackendStudent[] | null;
    marksdeleteflag: boolean;
    configuration: Array<{
        exmConfig_RegnoColumnDisplay: boolean;
        exmConfig_AdmnoColumnDisplay: boolean;
        exmConfig_RollnoColumnDisplay: boolean;
        exmConfig_Recordsearchtype: 'Name' | 'AdmNo' | 'RollNo' | 'RegNo';
    }>;
    subsubjectlist: any[];
    subexamlist: any[];
    savedMarksCount: number;
    lastDateEntry: number;
    lastDateEntryFlag: boolean;
    lastDateExam: number;
    lastDateExamFlag: boolean;
    marksEntryStateDate: string | null;
    get_papertype_grade_details: any[];
    answer_sheet: any[];
}

// types/marks-entry.ts
export type SubSub = {
    subsubId: number;
    subsubName: string;
    maxMarks: number;
    minMarks?: number;
    marksEntryMax: number;
    gradeDetails?: IBackendGradeDetail[];
};

export type SubExam = {
    subexamId: number;
    subexamName: string;
    maxMarks: number;
    minMarks?: number;
    marksEntryMax: number;
    gradeDetails?: IBackendGradeDetail[];
};

export type ISubjectMeta = {
    subjectId: number;
    subjectName: string;
    subsubFlag: boolean;
    subexamFlag: boolean;
    maxMarks: number;
    minMarks?: number;
    marksEntryMax: number;
    marksGradeEntryFlg: 'M' | 'G';
    gradeDetails: IBackendGradeDetail[];
    subsubData: SubSub[];
    subexamData: SubExam[];
    paperTypeGrades?: any[];
    allowPattern: string;
    placeholder: string;
    config: {
        showRegNo: boolean;
        showAdmNo: boolean;
        showRollNo: boolean;
        sortKey: 'studentName' | 'amaY_RollNo' | 'amsT_AdmNo' | 'amsT_RegistrationNo';
    };
};

export type IStudentMarksRow = {
    studentID: number;
    studentName: string;
    RegNo: string;
    AdmissionNo: string;
    RollNo: number;
    ismS_Id: number;
    marksEntryMax: number;
    maxMarks: number;
    minMarks?: number;
    // simple subject marks
    marks?: number | '' | string;
    marksFlag?: string; // 'AB', 'L', 'M', 'OD'
    grade?: string;
    // arrays for sub-subject and sub-exam marks
    subSubMarks?: Array<{
        subsubId: number;
        marks: number | '' | string;
        flag?: string;
        grade?: string;
    }>;
    subExamMarks?: Array<{
        subexamId: number;
        marks: number | '' | string;
        flag?: string;
        grade?: string;
    }>;
    // file upload
    answerSheet?: string;
    fileLocation?: string;
    // paper type
    papertype?: string;
    papertypeid?: number;
    // selection
    selected?: boolean;
};

// types/exam/exam-module/exam-mapping.ts
export interface IStudentTransaction {
    amsT_Id: number;
    studentName: string;
    regNumber: string;
    rollNumber: string;
    emgR_Id: number;
    ecsactT_Score?: string;
    ecsT_Id?: number;
    ecsactT_Id?: number;
    checked?: boolean;
    areaName?: string;
}

export interface IExamTerm {
    ecT_Id: number;
    ecT_TermName: string;
    Selected?: boolean;
}

export interface IExamMaster {
    emE_Id: number;
    emE_ExamName: string;
    Selected?: boolean;
    TotalMarksCount?: number;
}

export interface ITerm {
    ecT_Id: number;
    ecT_TermName: string;
    Selected?: boolean;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
    Selected?: boolean;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
    Selected?: boolean;
}

export interface ISkillName {
    ecS_Id: number;
    ecS_SkillName: string;
    Selected?: boolean;
}

export interface IActivityName {
    ecacT_Id: number;
    ecacT_SkillName: string;
    Selected?: boolean;
}

export interface ISkillArea {
    ecsA_Id: number;
    areaName: string;
    Selected?: boolean;
}

export interface IActivityArea {
    ecactA_Id: number;
    areaName: string;
    Selected?: boolean;
}

export interface ISavedScore {
    amsT_Id: number;
    ecsT_Score?: string;
    ecsactT_Score?: string;
    ecsT_Id?: number;
    ecsactT_Id?: number;
    ecsA_Id?: number;
    ecactA_Id?: number;
}

export interface GetStudentDetailsParams {
    MI_Id: number;
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    Skills: string;
    exam_termwise_flag: string;
    ECACT_Id?: number;
    ECACTA_Id?: number;
    ECS_Id?: number;
    ECSA_Id?: number;
    EME_Id?: number;
    ECT_Id?: number;
}

export interface SaveCCEMarksParams {
    skills: string;
    selectedStudentScore: {
        amsT_Id: number;
        ecsT_Id?: number;
        ecsactT_Score: string;
        areaName: string;
        emgR_Id: number;
        ecsactT_Id?: number;
    }[];
    asmcL_Id: number;
    asmS_Id: number;
    ecS_Id?: number;
    ecsA_Id?: number;
    exam_termwise_flag: string;
    emE_Id?: number;
    ecT_Id?: number;
    asmaY_Id: number;
    ecacT_Id?: number;
    ecactA_Id?: number;
    admno: string;
}

export interface IPromotionalSubGroupDetails {
    empsG_Id: number;
    empS_Id: number;
    empsG_GroupName: string;
    empsG_DisplayName: string;
    empsG_PercentValue: number;
    empsG_MarksValue: number;
    empsG_MaxOff: number;
    empsG_BestOff: number;
    empsG_Order: number;
    empsG_RoundOffFlag: boolean;
    empsG_ActiveFlag: boolean;
}

export interface IPromotionalSubGroupExamDetails {
    empsgE_Id: number;
    empsG_Id: number;
    emE_Id: number;
    emE_ExamName: string;
    empsgE_ForMaxMarkrs: number;
    empsgE_ConvertionReqOrNot: boolean;
    empsgE_ActiveFlag: boolean;
}

export interface IPromotionDetailsByIdResponse {
    categoryDetails: IPromotionSetting;
    promotionSubjects: {
        promotion_Subject_List: IPromotionalSubjectDetails[];
        promotion_SubGroup_List: IPromotionalSubGroupDetails[];
        group_Exam_List: IPromotionalSubGroupExamDetails[];
    };
}
