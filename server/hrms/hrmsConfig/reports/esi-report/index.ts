'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    ESIReportOnloadRequest,
    ESIReportOnloadResponse,
    ESIReportSearchRequest,
    ESIReportSearchResponse
} from '@/types/hrms/reports/esi-report';
/**
 * Get onload data for ESI Report
 * POST /api/ESIReportFacade/onloadgetdetails
 * Request: { MI_Id, LogInUserId }
 * Response: { MI_Id, retrunMsg, roleId, HRES_Year, HRES_Month, monthdropdown, leaveyeardropdown, departmentdropdown, designationdropdown, employeeTypedropdown, groupTypedropdown, ... }
 */
export async function getESIReportOnload(
    MI_Id = 30,
    LogInUserId = 0
): Promise<ApiResponse<ESIReportOnloadResponse>> {
    const url = '/api/ESIReportFacade/onloadgetdetails';
    const requestBody: ESIReportOnloadRequest = {
        MI_Id,
        LogInUserId
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<ESIReportOnloadResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to load ESI report data',
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
                HRME_EmployeeCode: null,
                groupTypeselected: null,
                employeeTypeselected: null,
                departmentselected: null,
                designationselected: null,
                employeeDetails: null,
                HRME_ESIAccNo: null,
                EmployeeName: null,
                HRES_WorkingDays: null,
                EmployeeContibution: null,
                EmployerContibution: null,
                totalAmount: null,
                HRME_DOL: null,
                basicAmount: null,
                institutionDetails: null,
                LogInUserId,
                hrmgT_IdList: null,
                employeeTypeIdList: null,
                hrmD_IdList: null,
                hrmdeS_IdList: null,
                groupTypeIdList: null,
                HRC_ECodePrefix: null,
                configurationDetails: null
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<ESIReportOnloadResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as ESIReportOnloadResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Data loaded successfully',
        data: rawResponse
    };
}
/**
 * Search ESI report by selection criteria
 * POST /api/ESIReportFacade/getEmployeedetailsBySelection
 * Request: { MI_Id, groupTypeselected, departmentselected, designationselected, HRES_Year, HRES_Month }
 * Note: Arrays should be empty [] when no selection is made
 */
export async function searchESIReport(
    request: ESIReportSearchRequest
): Promise<ApiResponse<ESIReportSearchResponse>> {
    const url = '/api/ESIReportFacade/getEmployeedetailsBySelection';
    const requestBody: ESIReportSearchRequest = {
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
        response = await api.post<ESIReportSearchResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to search ESI report',
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
        return response as ApiResponse<ESIReportSearchResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as ESIReportSearchResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Search completed successfully',
        data: rawResponse
    };
}
