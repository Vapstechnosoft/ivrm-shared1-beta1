'use server';

import { api } from '@/lib/apiService';
import { CumulativeSubjectLoadData, SubjectListResponse, ExamDetailsResponse } from './types';

// Mock data as fallback
const mockLoadData: CumulativeSubjectLoadData = {
    stuyearlist: [
        { asmaY_Id: 2024, asmaY_Year: '2024-2025', asmcL_Id: 10, asmcL_ClassName: 'X', asmS_Id: 1, asmC_SectionName: 'A' },
        { asmaY_Id: 2023, asmaY_Year: '2023-2024', asmcL_Id: 9, asmcL_ClassName: 'IX', asmS_Id: 1, asmC_SectionName: 'A' }
    ]
};

const mockSubjectData: SubjectListResponse = {
    subjectlist: [
        { ismS_Id: 101, ismS_SubjectName: 'Mathematics' },
        { ismS_Id: 102, ismS_SubjectName: 'Science' },
        { ismS_Id: 103, ismS_SubjectName: 'English' },
        { ismS_Id: 104, ismS_SubjectName: 'Social Studies' }
    ],
    stuyearlist: mockLoadData.stuyearlist
};

const mockExamDetails: ExamDetailsResponse = {
    examgradelist: [
        { emE_Id: 1, emE_ExamName: 'Mid Term', estmpS_MaxMarks: 100, estmpS_ObtainedMarks: 85, estmpS_ObtainedGrade: 'A' },
        { emE_Id: 2, emE_ExamName: 'Quarterly', estmpS_MaxMarks: 50, estmpS_ObtainedMarks: 42, estmpS_ObtainedGrade: 'A+' },
        { emE_Id: 3, emE_ExamName: 'Annual', estmpS_MaxMarks: 100, estmpS_ObtainedMarks: 92, estmpS_ObtainedGrade: 'O' }
    ]
};


export async function getCumulativeSubjectLoadData() {
    const url = `/CumulativeSubject/getloaddata`;
    try {
        const response = await api.post<CumulativeSubjectLoadData>('default', url, {});
        // Ensure we always return a flat object if the API returns wrapped data
        if (response && response.data) return response.data;
        return response as unknown as CumulativeSubjectLoadData;
    } catch (e) {
        console.warn("API Failed, using mock data for getCumulativeSubjectLoadData", e);
        return mockLoadData;
    }
}

export async function getSubjectsData(data: any) {
    const url = `/CumulativeSubject/getSubjectsdata`;
    try {
        const response = await api.post<SubjectListResponse>('default', url, data);
        if (response && response.data) return response.data;
        return response as unknown as SubjectListResponse;
    } catch (e) {
        console.warn("API Failed, using mock data for getSubjectsData", e);
        return mockSubjectData;
    }
}

export async function getExamDetails(data: any) {
    const url = `/CumulativeSubject/getexamdetails`;
    try {
        const response = await api.post<ExamDetailsResponse>('default', url, data);
        if (response && response.data) return response.data;
        return response as unknown as ExamDetailsResponse;
    } catch (e) {
        console.warn("API Failed, using mock data for getExamDetails", e);
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockExamDetails;
    }
}
