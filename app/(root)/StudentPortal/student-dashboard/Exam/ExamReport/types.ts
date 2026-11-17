export interface AcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    Selected?: boolean;
}

export interface Exam {
    emE_Id: number;
    emE_ExamName: string;
    Selected?: boolean;
}

export interface Subject {
    ismS_Id: number;
    ismS_SubjectName: string;
    Selected?: boolean;
}

export interface ExamReportData {
    ASMAY_Year: string;
    EME_ExamName: string;
    ISMS_SubjectName: string;
    ISMS_Id?: number;
    ESTMPS_MaxMarks: number;
    EYCES_MinMarks: number;
    ESTMPS_ObtainedMarks: number;
    ESTMPS_ObtainedGrade: string;
    ESTMPS_PassFailFlg: string;
    ESTMPS_ClassHighest: number;
    ESTMPS_ClassAverage: number;
    ESTMPS_SectionHighest: number;
    ESTMPS_SectionAverage: number;
    ESTMP_TotalGrade?: string;
    ESTMP_Percentage?: number;
    ESTMP_ClassRank?: number;
    ESTMP_SectionRank?: number;
    EYCES_MarksDisplayFlg?: boolean;
    EYCES_GradeDisplayFlg?: boolean;
    ismclT_FilePath?: string;
}

export interface ExamConfig {
    exmConfig_ClassRankFlg: boolean;
    exmConfig_SecRankFlg: boolean;
    exmConfig_ClassPositionFlg: boolean;
    exmConfig_SectionPositionFlg: boolean;
    exmconfig_FeeDefaulterDisplayFlg: boolean;
}

export interface ExamReportPayload {
    Type: 'EWAS' | 'SWAE' | 'ESW' | 'OVERALL';
    ASMAY_Id?: number;
    EME_Id?: number;
    ISMS_Id?: number;
}

export interface ExamReportLoadData {
    studetiallist: AcademicYear[];
    rcode: string | number;
}
