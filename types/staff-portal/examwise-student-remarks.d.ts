export interface IExamwiseRemarksInitialData {
    yearlist: IAcademicYear[];
    // classlist, sectionlist, examlist populated dynamically
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

export interface IExam {
    emE_Id: number;
    emE_ExamName: string;
}

export interface IStudentExamRemarks {
    amsT_Id: number;
    studentname: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;

    // Marks populated from getstudentmarks
    obtainedmarks?: number | string;
    totalmaxmarks?: number | string;
    percentage?: number | string;

    // Remarks
    remarks?: string; // Mapped from emeR_Remarks
    ESPCR_Id?: number; // Mapped from espcR_Id

    checked?: boolean;
    flag?: number; // To show "View Subject Wise Remarks" link
}

export interface ISubjectWiseRemark {
    amsT_Id: number;
    ismS_SubjectName: string;
    espcsR_Remarks: string;
}

export interface ISavedExammkDetail {
    amsT_Id: number;
    emeR_Remarks: string;
    espcR_Id: number;
}

export interface IStudentMarkExammk {
    amsT_Id: number;
    estmP_TotalObtMarks: number;
    estmP_TotalMaxMarks: number;
    estmP_Percentage: number;
}

export interface IExamwiseRemarksSave {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number;
    Temp_studentdata_Remarks: {
        AMST_Id: number;
        EMER_Remarks: string;
    }[];
}

export interface IExamConfig {
    exmConfig_Recordsearchtype: string;
    exmConfig_RegnoColumnDisplay: boolean;
    exmConfig_AdmnoColumnDisplay: boolean;
    exmConfig_RollnoColumnDisplay: boolean;
}
