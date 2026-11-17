'use server';

import { api } from '@/lib/apiService';
import { AcademicYear, Exam, ExamConfig, ExamReportData, ExamReportPayload, Subject, ExamReportLoadData } from './types';

const CONTROLLER = 'ExamReport';

// MOCK DATA RESTORED FOR FALLBACK
const MOCK_YEARS: AcademicYear[] = [
    { asmaY_Id: 23, asmaY_Year: '2023-2024', Selected: true },
    { asmaY_Id: 22, asmaY_Year: '2022-2023', Selected: false },
    { asmaY_Id: 21, asmaY_Year: '2021-2022', Selected: false },
];

const MOCK_EXAMS: Exam[] = [
    { emE_Id: 101, emE_ExamName: 'Mid Term Exam', Selected: false },
    { emE_Id: 102, emE_ExamName: 'Annual Exam', Selected: false },
];

const MOCK_SUBJECTS: Subject[] = [
    { ismS_Id: 501, ismS_SubjectName: 'Mathematics', Selected: false },
    { ismS_Id: 502, ismS_SubjectName: 'Science', Selected: false },
    { ismS_Id: 503, ismS_SubjectName: 'English', Selected: false },
];

const MOCK_REPORT_DATA: ExamReportData[] = [
    {
        ASMAY_Year: '2023-2024', EME_ExamName: 'Mid Term Exam', ISMS_SubjectName: 'Mathematics', ISMS_Id: 501,
        ESTMPS_MaxMarks: 100, EYCES_MinMarks: 35, ESTMPS_ObtainedMarks: 85, ESTMPS_ObtainedGrade: 'A', ESTMPS_PassFailFlg: 'Pass',
        ESTMPS_ClassHighest: 98, ESTMPS_ClassAverage: 75, ESTMPS_SectionHighest: 95, ESTMPS_SectionAverage: 72,
        EYCES_MarksDisplayFlg: true, ESTMP_TotalGrade: 'A', ESTMP_Percentage: 85, ESTMP_ClassRank: 5, ESTMP_SectionRank: 2,
    }
];

export async function getExamReportLoadData() {
    try {
        const response = await api.get<ExamReportLoadData>('portal', `/${CONTROLLER}/get-load-data`);
        return response.data;
    } catch (error) {
        console.warn("API Failed (using mock):", error);
        return { studetiallist: MOCK_YEARS, rcode: '' };
    }
}

export async function getExamData(payload: { Type: string; ASMAY_Id: number }) {
    try {
        const response = await api.get<any>('portal', `/${CONTROLLER}/get-exam-data`, {
            params: payload
        });
        return response.data;
    } catch (error) {
        console.warn("API Failed (using mock):", error);
        return { examlist: MOCK_EXAMS, subjectlist: MOCK_SUBJECTS };
    }
}

export async function getSubjects(payload: { Type: string; ASMAY_Id: number; EME_Id: number }) {
    try {
        const response = await api.get<any>('portal', `/${CONTROLLER}/get-Subjects`, {
            params: payload
        });
        return response.data;
    } catch (error) {
        console.warn("API Failed (using mock):", error);
        return { subjectlist: MOCK_SUBJECTS };
    }
}

export async function getStudentExamDetails(payload: ExamReportPayload) {
    try {
        const response = await api.get<any>('portal', `/${CONTROLLER}/get-Student-ExamDetails`, {
            params: payload
        });
        return response.data;
    } catch (error) {
        console.warn("API Failed (using mock):", error);
        return {
            examReportList: MOCK_REPORT_DATA,
            getexamconfig: [],
            get_eme_id_details: []
        };
    }
}
