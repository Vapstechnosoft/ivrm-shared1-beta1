'use server';

import { api } from '@/lib/apiService';

export interface CumulativeSalaryReportRequest {
    hreS_Year: string;
    hreS_Month: string;
    hrmdeS_IdList: number[];
}

export async function getCumulativeSalaryReport(data: CumulativeSalaryReportRequest) {
    const url = '/api/ReportCumulativeSalary/get_cumulative_salary_report';
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
            message: response.message || 'Failed to fetch report',
            data: null
        };
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            success: false,
            message: error?.message || 'Available to fetch report',
            data: null
        };
    }
}

// Dropdowns (Reusing logic patterns from mass-updation but kept independent)

export async function getGroupTypes() {
    const url = '/api/MasterDropDown/GroupType';
    try {
        const response = await api.get<any>('hrms', url);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, data: [] };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function getDepartmentsByGroupType(groupTypeIds: string) {
    // API expects comma separated IDs
    const url = `/api/MasterDropDown/department_drop_down_by_group_Type/${groupTypeIds}`;
    try {
        const response = await api.get<any>('hrms', url);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, data: [] };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function getDesignationsByGroupAndDept(groupTypeIds: string, deptIds: string) {
    const url = `/api/MasterDropDown/designations_drop_down_by_group_Type_and_Dept/${groupTypeIds}/${deptIds}`;
    try {
        const response = await api.get<any>('hrms', url);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, data: [] };
    } catch (error) {
        return { success: false, data: [] };
    }
}
