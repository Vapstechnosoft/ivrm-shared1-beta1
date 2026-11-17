
export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
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

export interface ISkill {
    ecS_Id: number;
    ecS_SkillName: string;
    Selected?: boolean;
}

export interface IActivity {
    ecacT_Id: number;
    ecacT_SkillName: string;
    Selected?: boolean;
}

export interface IArea {
    ecactA_Id?: number;
    ecsA_Id?: number;
    areaName: string;
}

export interface IStudentTransactionInitialData {
    academicYear: IAcademicYear[];
}

export interface IStudentTransactionSearchRequest {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    ECACT_Id: number;
    ECS_Id: number;
    ECACTA_Id: number;
    ECSA_Id: number;
    Skills: 'Skills' | 'Activities';
    exam_termwise_flag: 'TermWise' | 'ExamWise';
    EME_Id?: number;
    ECT_Id?: number;
}

export interface IStudentInfo {
    amsT_Id: number;
    studentName: string;
    regNumber: string;
    rollNumber: string;
    checked?: boolean;
    areaName?: any;
    ECSACTT_Score?: string;
    ECST_Id?: number;
    ECSACTT_Id?: number;
    emgR_Id?: number;
}

export interface IStudentTransactionSearchResponse {
    studentList: IStudentInfo[];
    getsaveddata: any[];
    exammaster: IExamMaster[];
}

export interface ISaveScore {
    AMST_Id: number;
    ECSACTT_Score: string;
    ECSA_Id?: number;
    ECACTA_Id?: number;
    areaName: number;
    EMGR_Id?: number;
    ECST_Id?: number;
    ECSACTT_Id?: number;
}

export interface IStudentTransactionSaveRequest {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    Skills: 'Skills' | 'Activities';
    ECACT_Id: number;
    ECS_Id: number;
    ECACTA_Id: number;
    ECSA_Id: number;
    SelectedStudentScore: ISaveScore[];
    exam_termwise_flag: 'TermWise' | 'ExamWise';
    admno: 'S' | 'V'; // Save or Verify flag
    EME_Id?: number;
    ECT_Id?: number;
}
