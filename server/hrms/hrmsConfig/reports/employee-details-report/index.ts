'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    EmployeeDetailsReportFilterRequest,
    EmployeeDetailsReportFilterResponse,
    EmployeeDetailsReportOnloadRequest,
    EmployeeDetailsReportOnloadResponse,
    EmployeeDetailsReportSearchRequest,
    EmployeeDetailsReportSearchResponse
} from '@/types/hrms/reports/employee-details-report';
/**
 * Get onload data for employee details report
 * POST /api/EmployeeDetailsReportFacade/onloadgetdetails
 * Returns dropdown data (months, leave years, departments, designations, employee types, group types)
 */
export async function getEmployeeDetailsReportOnload(
    MI_Id = 30,
    LogInUserId = 0
): Promise<ApiResponse<EmployeeDetailsReportOnloadResponse>> {
    const requestBody: EmployeeDetailsReportOnloadRequest = {
        MI_Id,
        LogInUserId
    };
    const response = await api.post<EmployeeDetailsReportOnloadResponse>(
        'hrms',
        '/api/EmployeeDetailsReportFacade/onloadgetdetails',
        requestBody
    );
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<EmployeeDetailsReportOnloadResponse>;
    }
    // Wrap raw response data
    return {
        success: true,
        message: 'Data loaded successfully',
        data: response as unknown as EmployeeDetailsReportOnloadResponse
    };
}
export async function filterEmployeeDetailsReport(
    requestBody: EmployeeDetailsReportFilterRequest
): Promise<ApiResponse<EmployeeDetailsReportFilterResponse>> {
    console.log('📥 [EMPLOYEE DETAILS REPORT - BACKEND] Request payload:', JSON.stringify(requestBody, null, 2));
    const url = '/api/EmployeeDetailsReportFacade/FilterEmployeeData';
    // Prepare request body based on FormatType
    let apiRequestBody: any;
    if (requestBody.FormatType === 'Format1' || requestBody.FormatType === 'Format 1') {
        // Format 1: Simple format
        apiRequestBody = {
            MI_Id: requestBody.MI_Id || 30,
            FormatType: 'Format1',
            DOBJL: requestBody.DOBJL || 'DOB',
            FromDate: requestBody.FromDate || new Date().toISOString().split('T')[0],
            ToDate: requestBody.ToDate || new Date().toISOString().split('T')[0],
            Left: requestBody.Left ?? false,
            Working: requestBody.Working ?? false
        };
    } else {
        // Format 2: Extended format with additional fields
        apiRequestBody = {
            MI_Id: requestBody.MI_Id || 30,
            FormatType: 'Format2',
            DOBJL: requestBody.DOBJL || 'string',
            FromDate: requestBody.FromDate || new Date().toISOString(),
            ToDate: requestBody.ToDate || new Date().toISOString(),
            AllOrIndividual: requestBody.AllOrIndividual || 'string',
            TypeOrEmployee: requestBody.TypeOrEmployee || 'string',
            HRMET_Id: requestBody.HRMET_Id || 0,
            HRME_Id: requestBody.HRME_Id || 0,
            Left: requestBody.Left ?? false,
            Working: requestBody.Working ?? false
        };
    }
    console.log('📤 [EMPLOYEE DETAILS REPORT - BACKEND] Request body prepared:', JSON.stringify(apiRequestBody, null, 2));
    try {
        const response = await api.post<EmployeeDetailsReportFilterResponse>(
            'hrms',
            url,
            apiRequestBody
        );
        // The backend returns raw data, not wrapped in ApiResponse format
        // Wrap it to match the expected ApiResponse structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            const responseData = response.data as unknown as EmployeeDetailsReportFilterResponse;
            console.log('📊 [EMPLOYEE DETAILS REPORT - BACKEND] Response data summary:', {
                hasEmployeedropdown: !!responseData?.employeedropdown,
                employeedropdownCount: Array.isArray(responseData?.employeedropdown) ? responseData.employeedropdown.length : 0,
                retrunMsg: responseData?.retrunMsg
            });
            return response as ApiResponse<EmployeeDetailsReportFilterResponse>;
        }
        // Wrap raw response data
        const rawResponse = response as unknown as EmployeeDetailsReportFilterResponse;
        return {
            success: true,
            message: rawResponse?.retrunMsg || 'Filter completed successfully',
            data: rawResponse
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to filter employee details',
            data: null
        };
    }
}
export async function searchEmployeeDetailsReport(
    requestBody: EmployeeDetailsReportSearchRequest
): Promise<ApiResponse<EmployeeDetailsReportSearchResponse>> {
    const response = await api.post<EmployeeDetailsReportSearchResponse>(
        'hrms',
        '/api/EmployeeDetailsReportFacade/getEmployeedetailsBySelectionNew',
        requestBody
    );
    // The backend returns raw data, not wrapped in ApiResponse format
    // Wrap it to match the expected ApiResponse structure
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        // Already wrapped
        return response as ApiResponse<EmployeeDetailsReportSearchResponse>;
    }
    // Wrap raw response data
    const rawResponse = response as unknown as EmployeeDetailsReportSearchResponse;
    return {
        success: true,
        message: rawResponse?.retrunMsg || 'Search completed successfully',
        data: rawResponse
    };
}
