'use server';

import { api } from '@/lib/apiService';

export interface YearWiseSalaryResponse {
    month: string;
    netamount: number;
}

export interface MonthWiseSalaryResponse {
    hrmD_Id: number;
    dept: string;
    netamount: number;
}

/**
 * Get year-wise employee salary details
 * GET /api/ReportEmployeeSalaryDetails/year_wise_employees_salary_details/{year}
 */
export async function getYearWiseSalaryDetails(year: string) {
    const url = `/api/ReportEmployeeSalaryDetails/year_wise_employees_salary_details/${year}`;
    try {
        const response = await api.get<YearWiseSalaryResponse[]>('hrms', url);
        return response;
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to fetch year-wise salary details',
            data: []
        };
    }
}

/**
 * Get month-wise employee salary details (department breakdown)
 * GET /api/ReportEmployeeSalaryDetails/month_wise_employees_salary_details/{year}/{month}
 */
export async function getMonthWiseSalaryDetails(year: string, month: string) {
    const url = `/api/ReportEmployeeSalaryDetails/month_wise_employees_salary_details/${year}/${month}`;
    try {
        const response = await api.get<MonthWiseSalaryResponse[]>('hrms', url);
        return response;
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to fetch month-wise salary details',
            data: []
        };
    }
}
