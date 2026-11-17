import type { Key } from 'react';

export interface AcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface Staff {
    hrmE_Id: number;
    staffName: string;
}

export interface Class {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface Section {
    ismS_Id: Key | null | undefined;
    asms_Id: number;
    asms_SectionName: string;
}

export interface Subject {
    ismS_Id: number;
    ismS_SubjectName: string;
}

export interface StaffPeriodTransferMasters {
    years: AcademicYear[];
    classes: Class[];
    sections: Section[];
    staff: Staff[];
    subjects: Subject[];
}
