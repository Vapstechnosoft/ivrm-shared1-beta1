'use server';

import { api } from '@/lib/apiService';

export interface DepartmentSalaryReportRequest {
    hreS_Year: string;
    hreS_Month: string;
    hrmd_ids: string;      // Comma separated IDs
    hrmdes_ids: string;    // Comma separated IDs
    hrmgt_ids: string;     // Comma separated IDs
}

export async function getDepartmentSalaryReport(data: DepartmentSalaryReportRequest) {
    const url = '/api/ReportDepartmentSalary/get_department_salary_details';
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
            message: error?.message || 'Failed to fetch report',
            data: null
        };
    }
}

// Dropdowns (Reusing logic where possible, but exposed for this report)

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
    // Reuse logic from mass-updation/cumulative logic
    if (!groupTypeIds) return { success: false, data: [] };

    // Check if the API supports comma separated. 
    // Based on mass-updation: `/api/MasterDropDown/department_drop_down_by_group_Type/${ids}`
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
    if (!groupTypeIds || !deptIds) return { success: false, data: [] };

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
