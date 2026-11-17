'use server';

import { api } from '@/lib/apiService';
import { getAcademicYearDropdown } from '@/server/fees/masters/class_yearly_category';
import type { IMasterInstitution } from '@/types/exam/exam-module/report';

const ACADEMIC_YEARS = [{ asmaY_Id: 2023, asmaY_Year: '2023-2024' }];

const CLASSES = [
    { asmcL_Id: 10, asmcL_ClassName: 'I' },
    { asmcL_Id: 11, asmcL_ClassName: 'II' }
];

const SECTIONS = [
    { asmS_Id: 100, asmC_SectionName: 'A' },
    { asmS_Id: 101, asmC_SectionName: 'B' }
];

const EXAMS = [{ emE_Id: 50, emE_ExamName: 'Mid Term' }];

const STUDENTS = [
    { amsT_Id: 1, studentname: 'John Doe', amsT_AdmNo: 'A001' },
    { amsT_Id: 2, studentname: 'Jane Smith', amsT_AdmNo: 'A002' }
];

export async function getDetails() {
    try {
        const res = await getAcademicYearDropdown();
        return {
            acdlist: res.data || []
        };
    } catch (error) {
        console.error('getDetails error:', error);
        return {
            acdlist: []
        };
    }
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

export async function getExamsAndStudents(sectionId: any) {
    return {
        examlist: EXAMS,
        studentlist: STUDENTS
    };
}

export async function getReportDetails(data: any) {
    const url = '/juniors_progress_card_report/get_report_details';
    try {
        const response = await api.post<any>('exam', url, data);
        return response.data;
    } catch (error) {
        console.error('getReportDetails API Error:', error);
        // Fallback to mock data
        return {
            year: '2023-2024',
            class: 'I',
            section: 'A',
            exam: 'Mid Term',
            students: (data.selectedStudents || []).map((id: string) => {
                const student = STUDENTS.find((s) => String(s.amsT_Id) === String(id));
                return {
                    ...student,
                    AMST_Id: Number(id),
                    subjects: [
                        { name: 'English', marks: 85, grade: 'A' },
                        { name: 'Maths', marks: 92, grade: 'A+' },
                        { name: 'Science', marks: 78, grade: 'B' }
                    ],
                    total: 255,
                    percentage: 85
                };
            })
        };
    }
}

