'use server';

import { api } from '@/lib/apiService';

const ACADEMIC_YEARS = [{ asmaY_Id: 2023, asmaY_Year: '2023-2024' }];

const CLASSES = [
    { asmcL_Id: 10, asmcL_ClassName: 'I' },
    { asmcL_Id: 11, asmcL_ClassName: 'II' }
];

const SECTIONS = [
    { asmS_Id: 0, asmC_SectionName: 'All' },
    { asmS_Id: 100, asmC_SectionName: 'A' },
    { asmS_Id: 101, asmC_SectionName: 'B' }
];

const EXAMS = [
    { emE_Id: 50, emE_ExamName: 'Mid Term' },
    { emE_Id: 51, emE_ExamName: 'Annual' }
];

export async function getDetails() {
    return {
        acdlist: ACADEMIC_YEARS
    };
}

export async function getClasses(yearId: any) {
    return {
        ctlist: CLASSES
    };
}

export async function getSections(classId: any) {
    return {
        seclist: SECTIONS
    };
}

export async function getExams(sectionId: any) {
    return {
        examlist: EXAMS
    };
}

export async function getReportDetails(data: any) {
    const url = '/Marks_Entry_Report_/report';
    return await api.post<any>('exam', url, data);
}
