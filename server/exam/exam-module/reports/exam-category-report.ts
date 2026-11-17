'use server';

import { api } from '@/lib/apiService';

export const getInitialData = async () => {
    const url = 'ExamCategoryReport/getdetails/';
    try {
        const response = await api.get<any>('exam', url);
        // Ensure we return the data object similar to fallback structure
        if (response.success && response.data) {
            return response.data;
        }
        // If API call success=false but no error thrown, or data missing, return fallback or empty
        console.warn('API returned success=false or no data, using fallback');
        throw new Error('API Data missing');
    } catch (error) {
        console.error('API Failed → Returning static fallback data', error);

        // Mock data for dropdowns
        const yearlist = [
            { asmaY_Id: 1, asmaY_Year: '2023-2024', Selected: true },
            { asmaY_Id: 2, asmaY_Year: '2024-2025', Selected: false }
        ];

        const grlist = [
            { emcA_Id: 10, emcA_CategoryName: 'Primary' },
            { emcA_Id: 11, emcA_CategoryName: 'High School' },
            { emcA_Id: 12, emcA_CategoryName: 'Higher Primary' }
        ];

        return {
            yearlist,
            grlist
        };
    }
};

export const getReportData = async (data: any) => {
    const url = `/exam_category_report/exam_category_report/${data.asmaY_Id}/${data.emcA_Id}/${data.type}`;
    console.log('url', url);
    return await api.get<any>('exam', url);
};

export async function getMasterCategoryDropdown() {
    const url = 'exam_category_report/exam_category';
    return await api.get<any>('exam', url);
}
