'use server';

import { api } from '@/lib/apiService';

export async function getReportDetails(data: any) {
    const url = `grade_slab_report/grade_slab_report/${data.type}/${data.emgR_Id}`;
    const response = await api.get('exam', url);
    return response;
}

// Mock Data for Grades
const mockGradeList = [
    { emgR_Id: 1, emgR_GradeName: 'Grade - 100 M' },
    { emgR_Id: 2, emgR_GradeName: 'Grade - 100 P' },
    { emgR_Id: 3, emgR_GradeName: 'Grade - 80 M' },
    { emgR_Id: 4, emgR_GradeName: 'Grade - 50 M' }
];

export const getGradeDetails = async () => {
    // Simulate API call
    return {
        grlist: mockGradeList
    };
};
