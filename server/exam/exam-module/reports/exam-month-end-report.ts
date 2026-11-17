'use server';

import { type ApiResponse, api } from '@/lib/apiService';

export const getInitialData = async () => {
    // Mock data for initial dropdowns
    const acdlist = [
        { asmaY_Id: 1, asmaY_Year: '2023-2024', Selected: true },
        { asmaY_Id: 2, asmaY_Year: '2024-2025', Selected: false }
    ];

    const monthlist = [
        { ivrM_Month_Id: 1, ivrM_Month_Name: 'January', Selected: false },
        { ivrM_Month_Id: 2, ivrM_Month_Name: 'February', Selected: false },
        { ivrM_Month_Id: 3, ivrM_Month_Name: 'March', Selected: false },
        { ivrM_Month_Id: 4, ivrM_Month_Name: 'April', Selected: false },
        { ivrM_Month_Id: 5, ivrM_Month_Name: 'May', Selected: false },
        { ivrM_Month_Id: 6, ivrM_Month_Name: 'June', Selected: false },
        { ivrM_Month_Id: 7, ivrM_Month_Name: 'July', Selected: false },
        { ivrM_Month_Id: 8, ivrM_Month_Name: 'August', Selected: false },
        { ivrM_Month_Id: 9, ivrM_Month_Name: 'September', Selected: false },
        { ivrM_Month_Id: 10, ivrM_Month_Name: 'October', Selected: true },
        { ivrM_Month_Id: 11, ivrM_Month_Name: 'November', Selected: false },
        { ivrM_Month_Id: 12, ivrM_Month_Name: 'December', Selected: false }
    ];

    const examlist = [
        { emE_Id: 1, emE_ExamName: 'Mid Term Exam', Selected: false },
        { emE_Id: 2, emE_ExamName: 'Annual Exam', Selected: false },
        { emE_Id: 3, emE_ExamName: 'Monthly Test', Selected: true }
    ];

    return {
        acdlist,
        monthlist,
        examlist
    };
};

export const getReportData = async (_data: any): Promise<ApiResponse<any>> => {
    try {
        const url = '/exam_month_end_report';

        const res = await api.post<ApiResponse<any>>('exam', url, {
            asmaY_Id: _data.ASMAY_Id,
            emE_Id: _data.EME_Id
        });

        return res;
    } catch (e) {
        console.error('API failed, returning mock data', e);

        return {
            success: true,
            message: 'Mock data returned due to API failure',
            data: {
                datareport: [
                    { asmcL_ClassName: 'Class 1 A', pass: 25, fail: 5 },
                    { asmcL_ClassName: 'Class 2 A', pass: 28, fail: 2 },
                    { asmcL_ClassName: 'Class 3 A', pass: 30, fail: 0 },
                    { asmcL_ClassName: 'Class 4 A', pass: 20, fail: 10 },
                    { asmcL_ClassName: 'Class 5 A', pass: 22, fail: 8 }
                ]
            }
        };
    }
};
