'use server';

import { api } from '@/lib/apiService';
import type {
    ApiResponse,
    SalaryAdvanceGridItem,
    SalaryAdvanceEmployeeDropdownItem,
    SalaryAdvanceSaveRequest,
    SalaryAdvanceDetailsRequest,
    EmployeeSalaryAdvanceDetails
} from '@/types/hrms/salary-advance';

/**
 * Get salary advance grid data
 * GET /api/TransHREmpSalaryAdvance/get_salary_advance_grid
 */
export async function getSalaryAdvanceGrid(pageSize: number = 100) {
    const url = `/api/TransHREmpSalaryAdvance/get_salary_advance_grid?page_size=${pageSize}`;
    try {
        return await api.get<ApiResponse<SalaryAdvanceGridItem[]>>('hrms', url);
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to fetch salary advance grid',
            data: []
        };
    }
}

/**
 * Get employee dropdown for salary advance
 * GET /api/TransHREmpSalaryAdvance/get_salary_advance_employee_dropdown
 */
export async function getSalaryAdvanceEmployeeDropdown() {
    const url = '/api/TransHREmpSalaryAdvance/get_salary_advance_employee_dropdown';
    try {
        return await api.get<ApiResponse<SalaryAdvanceEmployeeDropdownItem[]>>('hrms', url);
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to fetch employee dropdown',
            data: []
        };
    }
}

/**
 * Add or update salary advance
 * POST /api/TransHREmpSalaryAdvance/add_or_update_salary_advance
 */
export async function addOrUpdateSalaryAdvance(data: SalaryAdvanceSaveRequest) {
    const url = '/api/TransHREmpSalaryAdvance/add_or_update_salary_advance';
    try {
        return await api.post<ApiResponse<any>>('hrms', url, data);
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to save salary advance',
            data: null
        };
    }
}

/**
 * Toggle salary advance status (Active/Deactive)
 * PUT /api/TransHREmpSalaryAdvance/toggle_salary_advance/{hresa_id}
 */
export async function toggleSalaryAdvance(hresa_id: number) {
    const url = `/api/TransHREmpSalaryAdvance/toggle_salary_advance/${hresa_id}`;
    try {
        return await api.put<ApiResponse<any>>('hrms', url, {});
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to toggle salary advance status',
            data: null
        };
    }
}

/**
 * Get employee salary advance details
 * GET /api/TransHREmpSalaryAdvance/get_employee_salary_advance_details
 * Note: User provided a body for this GET request.
 */
export async function getEmployeeSalaryAdvanceDetails(params: SalaryAdvanceDetailsRequest) {
    const url = '/api/TransHREmpSalaryAdvance/get_employee_salary_advance_details';
    try {
        // Many APIs use query params for GET even if user provided JSON example
        // But if it truly requires a body, api.get might handle it or we might need to convert to query params
        // Checking if we should use GET with body or query params
        const queryParams = new URLSearchParams();
        queryParams.append('HRME_Id', params.HRME_Id.toString());
        queryParams.append('HRESA_Id', params.HRESA_Id.toString());
        queryParams.append('HRESA_EntryDate', params.HRESA_EntryDate);

        const finalUrl = `${url}?${queryParams.toString()}`;
        return await api.get<ApiResponse<EmployeeSalaryAdvanceDetails>>('hrms', finalUrl);
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to fetch employee salary details',
            data: null
        };
    }
}

// Backward Compatibility / Legacy support if needed
export async function getSalaryAdvanceList() {
    return await getSalaryAdvanceGrid();
}

export async function saveSalaryAdvance(data: any) {
    return await addOrUpdateSalaryAdvance(data);
}

export async function toggleSalaryAdvanceStatus(id: number) {
    return await toggleSalaryAdvance(id);
}
