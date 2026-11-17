'use server';
import { api } from '@/lib/apiService';

// 🔹 Generate Report
export async function getReportDetails(data: any) {
    const url = '/percentage_wise_details_report/percentage_wise_report';
    return await api.post<any>('exam', url, data);
}
