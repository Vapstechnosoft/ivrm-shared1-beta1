export interface AcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface Category {
    ttmC_Id: number;
    ttmC_CategoryName: string;
}

export interface Class {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface Section {
    asms_Id: number;
    asms_SectionName: string;
}

export interface Staff {
    hrmE_Id: number;
    staffName: string;
}

export interface Subject {
    ismS_Id: number;
    ismS_SubjectName: string;
}

export interface ManualPeriodInsertionMasters {
    years: AcademicYear[];
    categories: Category[];
    classes: Class[];
    staff: Staff[];
    subjects: Subject[];
}
