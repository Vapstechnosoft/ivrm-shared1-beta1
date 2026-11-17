'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    EmployeeStrengthReportOnloadRequest,
    EmployeeStrengthReportOnloadResponse,
    EmployeeStrengthReportSearchRequest,
    EmployeeStrengthReportSearchResponse
} from '@/types/hrms/reports/employee-strength-report';
/**
 * Get onload data for Employee Strength Report
 * POST /api/EmployeeStrengthReportFacade/onloadgetdetails
 * Request: { MI_Id, LogInUserId }
 * Response: { MI_Id, retrunMsg, roleId, HRME_Id, FromDate, ToDate, FormatType, AllEmployee, Departmentwise, LeftEmployee, employeedropdown, departmentdropdown, designationdropdown, groupTypedropdown, ... }
 */
export async function getEmployeeStrengthReportOnload(
    MI_Id = 30,
    LogInUserId = 0
): Promise<ApiResponse<EmployeeStrengthReportOnloadResponse>> {
    const url = '/api/EmployeeStrengthReportFacade/onloadgetdetails';
    const requestBody: EmployeeStrengthReportOnloadRequest = {
        MI_Id,
        LogInUserId
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<EmployeeStrengthReportOnloadResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to load employee strength report data',
            data: {
                MI_Id,
                retrunMsg: error?.message || 'Failed to load data',
                roleId: 0,
                HRME_Id: null,
                FromDate: null,
                ToDate: null,
                FormatType: null,
                AllEmployee: false,
                Departmentwise: false,
                LeftEmployee: false,
                employeedropdown: null,
                departmentdropdown: null,
                designationdropdown: null,
                groupTypedropdown: null,
                groupTypeselected: null,
                departmentselected: null,
                designationselected: null,
                employeeDetails: null,
                grouptypeName: null,
                departmentName: null,
                designationName: null,
                totalEmployees: 0,
                totalLeftEmployees: 0,
                totalWorkingEmployees: 0,
                institutionDetails: null,
                LogInUserId,
                hrmgT_IdList: null,
                employeeTypeIdList: null,
                hrmD_IdList: null,
                hrmdeS_IdList: null,
                groupTypeIdList: null,
                HRMD_Id: null
            }
        };
    }
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<EmployeeStrengthReportOnloadResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as EmployeeStrengthReportOnloadResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Data loaded successfully',
        data: rawResponse
    };
}
/**
 * Search employee strength report by selection criteria
 * POST /api/ReportEmployeeStrength/employee_strength_report
 * Request: { MI_Id, designationSelected, departmentSelected, groupTypeSelected, allEmployee, departmentwise, leftEmployee, fromDate, toDate }
 * Note: Arrays should be empty [] when no selection is made
 */
export async function searchEmployeeStrengthReport(
    request: EmployeeStrengthReportSearchRequest
): Promise<ApiResponse<EmployeeStrengthReportSearchResponse>> {
    const url = '/api/ReportEmployeeStrength/employee_strength_report';
    const requestBody: EmployeeStrengthReportSearchRequest = {
        MI_Id: request.MI_Id || 30,
        designationSelected: request.designationSelected || [],
        departmentSelected: request.departmentSelected || [],
        groupTypeSelected: request.groupTypeSelected || [],
        allEmployee: request.allEmployee || false,
        departmentwise: request.departmentwise || false,
        leftEmployee: request.leftEmployee || false,
        fromDate: request.fromDate || '',
        toDate: request.toDate || ''
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    let response: any;
    try {
        response = await api.post<EmployeeStrengthReportSearchResponse>('hrms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to search employee strength report',
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
        return response as ApiResponse<EmployeeStrengthReportSearchResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as EmployeeStrengthReportSearchResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Search completed successfully',
        data: rawResponse
    };
}
