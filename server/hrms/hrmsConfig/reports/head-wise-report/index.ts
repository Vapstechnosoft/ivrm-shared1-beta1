'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    HeadWiseReportOnloadRequest,
    HeadWiseReportOnloadResponse,
    HeadWiseReportSearchRequest,
    HeadWiseReportSearchResponse
} from '@/types/hrms/reports/head-wise-report';
/**
 * Get onload data for Head Wise Report
 * POST /api/HeadwiseReportsFacade/onloadgetdetails
 * Request: { MI_Id, LogInUserId }
 * Response: { MI_Id, retrunMsg, roleId, HRES_Year, HRES_Month, monthdropdown, leaveyeardropdown, departmentdropdown, designationdropdown, employeeTypedropdown, groupTypedropdown, ... }
 */
export async function getHeadWiseReportOnload(
    MI_Id = 30,
    LogInUserId = 0
): Promise<ApiResponse<HeadWiseReportOnloadResponse>> {
    const url = '/api/HeadwiseReportsFacade/onloadgetdetails';
    const requestBody: HeadWiseReportOnloadRequest = {
        MI_Id,
        LogInUserId
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<HeadWiseReportOnloadResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to load head wise report data',
            data: {
                MI_Id,
                retrunMsg: error?.message || 'Failed to load data',
                roleId: 0,
                HRES_Year: null,
                HRES_Month: null,
                monthdropdown: null,
                leaveyeardropdown: null,
                departmentdropdown: null,
                designationdropdown: null,
                employeeTypedropdown: null,
                groupTypedropdown: null,
                groupTypeselected: null,
                employeeTypeselected: null,
                departmentselected: null,
                designationselected: null,
                employeeDetails: null,
                EmployeeCode: null,
                EmployeeName: null,
                DesignationName: null,
                TotalEarning: null,
                TotalDeduction: null,
                NetSalary: null,
                institutionDetails: null,
                LogInUserId,
                hrmgT_IdList: null,
                employeeTypeIdList: null,
                hrmD_IdList: null,
                hrmdeS_IdList: null,
                groupTypeIdList: null
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<HeadWiseReportOnloadResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as HeadWiseReportOnloadResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Data loaded successfully',
        data: rawResponse
    };
}
/**
 * Search Head Wise report by selection criteria
 * POST /api/HeadwiseReportsFacade/getEmployeedetailsBySelection
 * Request: { MI_Id, groupTypeselected, departmentselected, designationselected, HRES_Year, HRES_Month }
 * Note: Arrays should be empty [] when no selection is made
 */
export async function searchHeadWiseReport(
    request: HeadWiseReportSearchRequest
): Promise<ApiResponse<HeadWiseReportSearchResponse>> {
    const url = '/api/HeadwiseReportsFacade/getEmployeedetailsBySelection';
    const requestBody: HeadWiseReportSearchRequest = {
        MI_Id: request.MI_Id || 30,
        groupTypeselected: request.groupTypeselected || [],
        departmentselected: request.departmentselected || [],
        designationselected: request.designationselected || [],
        HRES_Year: request.HRES_Year || '',
        HRES_Month: request.HRES_Month || ''
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<HeadWiseReportSearchResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to search head wise report',
            data: {
                MI_Id: request.MI_Id || 30,
                retrunMsg: error?.message || 'Failed to search',
                roleId: 0
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<HeadWiseReportSearchResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as HeadWiseReportSearchResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Search completed successfully',
        data: rawResponse
    };
}
