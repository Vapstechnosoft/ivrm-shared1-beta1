'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    EmployeeDropdown,
    EmployeeProfileReportFilterRequest,
    EmployeeProfileReportFilterResponse,
    EmployeeProfileReportOnloadRequest,
    EmployeeProfileReportOnloadResponse,
    EmployeeProfileReportResponse,
    EmployeeProfileReportSearchRequest,
    EmployeeProfileReportSearchResponse
} from '@/types/hrms/reports/employee-profile-report';
/**
 * Get onload details for employee profile report
 * POST /api/EmployeeProfileReportFacade/onloadgetdetailsNew
 * Request: { MI_Id: number, LogInUserId: number }
 * Response: Returns dropdown data in groupTypedropdown, departmentdropdown, designationdropdown, employeedropdown fields
 */
export async function getEmployeeProfileReportOnload(
    MI_Id = 30,
    LogInUserId = 0
): Promise<ApiResponse<EmployeeProfileReportResponse>> {
    const requestBody = {
        MI_Id,
        LogInUserId
    };
    const response = await api.post<EmployeeProfileReportResponse>('hrms', '/api/EmployeeProfileReportFacade/onloadgetdetailsNew', requestBody);
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<EmployeeProfileReportResponse>;
    }
    // Wrap raw response data
    return {
        success: true,
        message: 'Data loaded successfully',
        data: response as unknown as EmployeeProfileReportResponse
    };
}
/**
 * Filter employees by selection criteria
 * POST /api/EmployeeProfileReportFacade/FilterEmployeedetailsBySelectionNew
 * Request: { MI_Id: number, LogInUserId: number, hrmgT_IdList: number[], hrmD_IdList: number[], hrmdeS_IdList: number[] }
 * Note: Arrays should be [0] when empty, not []
 */
export async function filterEmployeesBySelection(request: EmployeeProfileReportFilterRequest): Promise<ApiResponse<{ employeedropdown?: EmployeeDropdown[] }>> {
    const requestBody = {
        MI_Id: request.MI_Id,
        LogInUserId: request.LogInUserId,
        hrmgT_IdList: request.hrmgT_IdList && request.hrmgT_IdList.length > 0 ? request.hrmgT_IdList : [0],
        hrmD_IdList: request.hrmD_IdList && request.hrmD_IdList.length > 0 ? request.hrmD_IdList : [0],
        hrmdeS_IdList: request.hrmdeS_IdList && request.hrmdeS_IdList.length > 0 ? request.hrmdeS_IdList : [0]
    };
    const response = await api.post<any>('hrms', '/api/EmployeeProfileReportFacade/FilterEmployeedetailsBySelectionNew', requestBody);
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<{ employeedropdown?: EmployeeDropdown[] }>;
    }
    // Wrap raw response data
    // Backend might return { employeedropdown: [...] } or similar structure
    const rawResponse = response as any;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Filter completed successfully',
        data: {
            employeedropdown: rawResponse?.employeedropdown || []
        }
    };
}
/**
 * Search employee profile details
 * POST /api/EmployeeProfileReportFacade/getEmployeedetailsBySelectionNew
 * Request: { MI_Id: number, hrmE_multiId: number[] }
 * Note: hrmE_multiId should be [0] when empty, not []
 */
export async function searchEmployeeProfileDetails(request: EmployeeProfileReportSearchRequest): Promise<ApiResponse<EmployeeProfileReportSearchResponse>> {
    const requestBody = {
        MI_Id: request.MI_Id,
        hrmE_multiId: request.employeeIds.length > 0 ? request.employeeIds : [0]
    };
    const response = await api.post<any>('hrms', '/api/EmployeeProfileReportFacade/getEmployeedetailsBySelectionNew', requestBody);
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<EmployeeProfileReportSearchResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as EmployeeProfileReportSearchResponse;
    // The API response may contain retrunMsg (with typo) at the root level
    const apiResponse = response as any;
    return {
        success: true,
        message: apiResponse?.retrunMsg || rawResponse?.message || 'Search completed successfully',
        data: rawResponse
    };
}
