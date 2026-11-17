'use server';

import { api } from '@/lib/apiService';

export interface EmployeeStrengthReportRequest {
    designationSelected: number[];
    departmentSelected: number[];
    groupTypeSelected: number[];
    fromDate: string;
    toDate: string;
    allEmployee: boolean;
    departmentwise: boolean;
    leftEmployee: boolean;
}

export async function getEmployeeStrengthReport(data: EmployeeStrengthReportRequest) {
    const url = '/api/ReportEmployeeStrength/employee_strength_report';
    try {
        const response = await api.post<any>('hrms', url, data);
        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: response.message
            };
        }
        return {
            success: false,
            message: response.message || 'Failed to fetch employee strength report',
            data: null
        };
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            message: error?.message || 'Available to fetch employee strength report',
            data: null
        };
    }
}
