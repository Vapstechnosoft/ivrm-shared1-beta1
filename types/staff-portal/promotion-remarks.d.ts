export interface IPromotionRemarksInitialData {
    year_list: IAcademicYear[];
    // classlist, sectionlist might be loaded dynamically
    hrmE_Id?: number;
}

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

export interface IStudentPromotion {
    amsT_Id: number;
    studentname: string;
    amsT_Admno: string;
    amaY_RollNo: number;
    checkedvalue?: boolean;

    // Marks data (populated from getstudentmarks logic in legacy)
    obtainedmarks?: number | string;
    totalmaxmarks?: number | string;
    percentage?: number | string;

    // Input fields
    eprD_PromotionName?: string; // Conduct
    eprD_Remarks?: string;
    eprD_ClassPromoted?: string;
    eprD_Id?: number;

    // Helper for dropdown
    model?: string;
}

export interface IStudentMarks {
    amsT_Id: number;
    estmpP_TotalObtMarks?: number; // for examtype 1
    estmpP_TotalMaxMarks?: number; // for examtype 1
    estmpP_Percentage?: number; // for examtype 1

    estmP_TotalObtMarks?: number; // for examtype 0
    estmP_TotalMaxMarks?: number; // for examtype 0
    estmP_Percentage?: number; // for examtype 0
}

export interface ISavedDetail {
    amsT_Id: number;
    eprD_PromotionName: string;
    eprD_Remarks: string;
    eprD_ClassPromoted: string;
    eprD_Id: number;
}

export interface IPromotionRemarksSave {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number;
    examtype: number;
    examtype_temp: {
        amsT_Id: number;
        eprD_PromotionName?: string;
        eprD_Remarks?: string;
        eprD_ClassPromoted?: string;
        eprD_Id?: number;
    }[];
}
