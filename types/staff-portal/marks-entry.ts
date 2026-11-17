
export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
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

export interface IExam {
    emE_Id: number;
    emE_ExamName: string;
    Selected?: boolean;
}

export interface ISubject {
    ismS_Id: number;
    ismS_SubjectName: string;
    Selected?: boolean;
}

export interface IMarksEntryInitialData {
    yearlist: IAcademicYear[];
    classlist: IClass[];
    asmaY_Id: number;
}

export interface IMarksEntrySearchRequest {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number;
    ISMS_Id: number;
}

export interface ISubjectDetail {
    ismS_Id: number;
    ismS_SubjectName?: string;
    eyceS_MaxMarks: number;
    eyceS_MarksEntryMax: number;
    eyceS_MinMarks: number;
    eyceS_SubSubjectFlg?: boolean;
    eyceS_SubExamFlg?: boolean;
}

export interface ISubSubject {
    emsS_Id: number;
    emsS_SubSubjectName: string;
    eycessS_MaxMarks?: number;
    eycessS_MarksEntryMax?: number;
}

export interface ISubExam {
    emsE_Id: number;
    emsE_SubExamName: string;
    emsS_Id?: number; // Related sub-subject
    eycessE_MaxMarks?: number;
    eycessS_MarksEntryMax?: number; // Note the typo in Angular code: eycessS_MarksEntryMax used for exam too?
}

export interface IStudentMark {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    amaY_RollNo: string;
    amsT_RegistrationNo?: string;
    papertype?: string;
    papertypeid?: number;
    ESTM_Marks?: string; // For Case S
    ESTM_Grade?: string;
    ESTM_Flg?: string;
    selected_s?: boolean;
    selected_ssse?: boolean;
    selected_ss?: boolean;
    selected_se?: boolean;
    ESTMSS_Marks?: any; // Complex nested object for Case SSSE, SS, SE
    estmanssH_AnswerSheet?: string;
    estmanssH_FileLocation?: string;
    ismS_Id?: number;
}

export interface IMarksEntrySearchResponse {
    studentList: IStudentMark[];
    subject_details: ISubjectDetail[];
    eyceS_SubSubjectFlg: boolean;
    eyceS_SubExamFlg: boolean;
    eyceS_MarksGradeEntryFlg: 'M' | 'G';
    subject_subsubjects?: ISubSubject[];
    subject_subexams?: ISubExam[];
    subsubjectlist?: ISubSubject[];
    subexamlist?: ISubExam[];
    saveupdatecount: number;
    lastdateentryflag: boolean;
    hidebutton?: { updatedcount: number }[];
    get_student_wise_papertype_list?: any[];
    get_papertype_grade_details?: any[];
    configuration?: any[];
    saved_studentList?: any[];
    saved_ssse_list?: any[];
    saved_ss_list?: any[];
    saved_se_list?: any[];
}

export interface IMarksEntrySaveRequest {
    main_save_list: any[];
    ASMS_Id: number;
    ASMCL_Id: number;
    ASMAY_Id: number;
    EME_Id: number;
    ISMS_Id: number;
    EYCES_MarksGradeEntryFlg: 'M' | 'G';
    EYCES_SubSubjectFlg: boolean;
    EYCES_SubExamFlg: boolean;
    IVRMMAP_AddFlg: boolean; // MarkCalculation
    Pagename: string;
    orderflag: 'S' | 'V'; // Save or Verify
}
