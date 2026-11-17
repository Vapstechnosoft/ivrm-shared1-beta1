
import type { studentMarksPublishSchema } from '@/schemas/exam/exam-module/marks-entry';
// types/exam/exam-module/student-marks-publish.ts
import type { z } from 'zod';
export interface IStudentDetails {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    amaY_Rollno: number;
    obtainedmarks: number;
    totalmaxmarks: number;
    percentage: number;
    estmP_PublishToStudentFlg: boolean | number;
    estmP_Id?: number;
    checkedvalue?: boolean;
    studentClass?: string;
    studentSection?: string;
    examName?: string;
}

// If you need a more specific interface for the API response
export interface IStudentMarksAPIResponse {
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    amaY_Rollno: number;
    obtainedmarks: number;
    totalmaxmarks: number;
    percentage: number;
    estmP_PublishToStudentFlg: number; // Typically 0 or 1 from API
    estmP_Id?: number;

    // Optional: If the API returns additional student info
    asmaY_Id?: number;                 // Academic Year ID
    asmcL_Id?: number;                 // Class ID
    asmS_Id?: number;                  // Section ID
    emE_Id?: number;                   // Exam ID
}

// For the table display with frontend state
export interface IStudentDetailsWithState extends IStudentDetails {
    checkedvalue: boolean;            // Always present in frontend
    slNo: number;                     // Serial number for display
}


// Base types from schema
export type StudentMarksPublishSearchForm = z.infer<typeof studentMarksPublishSchema.search>;
export type StudentMarksPublishUpdateForm = z.infer<typeof studentMarksPublishSchema.update>;
export type StudentMarksPublishStudent = z.infer<typeof studentMarksPublishSchema.student>;

// Interface definitions
export interface IStudentMarksPublish {
    // Form fields
    radiotype: 'EXAM' | 'PROMOTION';
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    emE_Id?: number;
    feeinstallmentcheckbox: boolean;
    FMT_Id?: number;
    feeGroupIds: number[];
    SMSFLAG: boolean;
    EMAILFLAG: boolean;
    NOTIFYFLAG: boolean;

    // Additional display fields (optional)
    asmaY_Year?: string;
    asmcL_ClassName?: string;
    asmC_SectionName?: string;
    emE_ExamName?: string;
    fmT_Name?: string;
}

export interface IStudentDetails {
    // Required fields
    amsT_Id: number;
    amsT_FirstName: string;
    amsT_AdmNo: string;
    amaY_Rollno: number;
    obtainedmarks: number;
    totalmaxmarks: number;
    percentage: number;
    estmP_PublishToStudentFlg: boolean | number;

    // Optional fields
    estmP_Id?: number;
    studentClass?: string;
    studentSection?: string;
    examName?: string;

    // Frontend state
    checkedvalue?: boolean;
    isSelected?: boolean;
    slNo?: number;
}

// API Response interfaces
export interface ISearchStudentResponse {
    datareport: IStudentDetails[];
    success: boolean;
    message?: string;
}

export interface IUpdateStatusResponse {
    returnval: boolean;
    message: string;
    success: boolean;
}

export interface ICheckMarksResponse {
    exmstdlist?: any[]; // For EXAM type
    editlist?: any[];   // For PROMOTION type
    success: boolean;
    message?: string;
}

// Dropdown interfaces
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

export interface IExam {
    emE_Id: number;
    emE_ExamName: string;
    Selected?: boolean;
}

export interface IFeeTerm {
    fmT_Id: number;
    fmT_Name: string;
    Selected?: boolean;
}

export interface IFeeGroup {
    fmG_Id: number;
    fmG_GroupName: string;
    checkedsub?: boolean;
    isSelected?: boolean;
}

// Search parameters for API
export interface ISearchParams {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id?: number;
    radiotype: 'EXAM' | 'PROMOTION';
    FMT_Id?: number;
    TempGroupList?: number[];
    feeinstallmentcheckbox?: boolean;
}

// Update parameters for API
export interface IUpdateStatusParams {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number;
    radiotype: 'EXAM' | 'PROMOTION';
    SMSFLAG: boolean;
    EMAILFLAG: boolean;
    selectedstudents: Array<{
        AMST_Id: number;
        ESTMP_Id?: number;
        AMST_FirstName: string;
        ESTMP_PublishToStudentFlg: boolean;
    }>;
    ELP_ActiveFlg: boolean;
    EME_ExamName?: string;
    ISMS_SubjectName?: string;
}

// Table row interface (for the data table)
export interface IStudentTableRow extends IStudentDetails {
    id: string; // For React key
    isSelected: boolean;
    index: number;
}