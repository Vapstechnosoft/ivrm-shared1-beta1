'use server';
import { api } from '@/lib/apiService';
import type { ApiResponse } from '@/lib/apiService';
import type {
    SalaryApprovalOnloadRequest,
    SalaryApprovalOnloadResponse,
    SalaryApprovalRequest,
    SalaryApprovalResponse,
    SalaryApprovalSearchRequest,
    SalaryApprovalSearchResponse
} from '@/types/hrms/salary-approval';
/**
 * Get salary approval process onload data
 * GET /api/HRMS_Trans_SalaryApprovalProcess/onloadgetdetails/{mid}
 */
export async function getSalaryApprovalOnload(payload: SalaryApprovalOnloadRequest) {
    console.log('📥 [SALARY APPROVAL - BACKEND] Request payload:', JSON.stringify(payload, null, 2));
    const mid = payload.MI_Id || 30;
    const url = `/api/HRMS_Trans_SalaryApprovalProcess/onloadgetdetails/${mid}`;
    try {
        const response = await api.get<SalaryApprovalOnloadResponse>('hrms', url        );
        // The backend returns raw data, not wrapped in ApiResponse format
        // Wrap it to match the expected ApiResponse structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            console.log('📊 [SALARY APPROVAL - BACKEND] Response data summary:', {
                hasGroupTypes: !!(response.data?.groupTypedropdownlist?.length),
                groupTypesCount: response.data?.groupTypedropdownlist?.length || 0,
                hasDepartments: !!(response.data?.departmentdropdownlist?.length),
                departmentsCount: response.data?.departmentdropdownlist?.length || 0,
                hasDesignations: !!(response.data?.designationdropdownlist?.length),
                designationsCount: response.data?.designationdropdownlist?.length || 0,
                hasMonths: !!(response.data?.monthdropdown),
                hasLeaveYears: !!(response.data?.leaveyeardropdown?.length),
                leaveYearsCount: response.data?.leaveyeardropdown?.length || 0
            });
            console.log('🔵 [SALARY APPROVAL - BACKEND] getSalaryApprovalOnload - END (Success)');
            return response;
        }
        // Wrap raw response data
        const wrappedResponse = {
            success: true,
            message: 'Data loaded successfully',
            data: response as unknown as SalaryApprovalOnloadResponse
        };
        console.log('📊 [SALARY APPROVAL - BACKEND] Response data summary:', {
            hasGroupTypes: !!(wrappedResponse.data?.groupTypedropdownlist?.length),
            groupTypesCount: wrappedResponse.data?.groupTypedropdownlist?.length || 0,
            hasDepartments: !!(wrappedResponse.data?.departmentdropdownlist?.length),
            departmentsCount: wrappedResponse.data?.departmentdropdownlist?.length || 0,
            hasDesignations: !!(wrappedResponse.data?.designationdropdownlist?.length),
            designationsCount: wrappedResponse.data?.designationdropdownlist?.length || 0,
            hasMonths: !!(wrappedResponse.data?.monthdropdown),
            hasLeaveYears: !!(wrappedResponse.data?.leaveyeardropdown?.length),
            leaveYearsCount: wrappedResponse.data?.leaveyeardropdown?.length || 0
        });
        console.log('🔵 [SALARY APPROVAL - BACKEND] getSalaryApprovalOnload - END (Success)');
        return wrappedResponse;
    } catch (error: any) {
        console.error('💥 [SALARY APPROVAL - BACKEND] Error message:', error instanceof Error ? error.message : String(error));
        // Return error response instead of throwing to prevent UI crashes
        // This allows the frontend to handle the error gracefully
        return {
            success: false,
            message: error?.message || error?.response?.data?.message || 'Failed to load salary approval data. Please check if the API endpoint is available.',
            data: null
        } as ApiResponse<SalaryApprovalOnloadResponse>;
    }
}
/**
 * Search employees by selection for salary approval
 * POST /api/HRMS_Trans_SalaryApprovalProcess/getEmployeedetailsBySelection
 */
export async function searchSalaryApprovalEmployees(payload: SalaryApprovalSearchRequest) {
    console.log('📥 [SALARY APPROVAL - BACKEND] Request payload:', JSON.stringify(payload, null, 2));
    const url = '/api/HRMS_Trans_SalaryApprovalProcess/getEmployeedetailsBySelection';
    // Prepare request body - ensure arrays are [0] when empty, as API expects
    // Use empty strings for Year and Month when not provided
    const trimmedMonth = payload.HRES_Month ? payload.HRES_Month.trim() : '';
    const trimmedYear = payload.HRES_Year ? payload.HRES_Year.trim() : '';
    console.log('  - Original:', JSON.stringify(payload.HRES_Month));
    console.log('  - Trimmed:', JSON.stringify(trimmedMonth));
    console.log('  - Original:', JSON.stringify(payload.HRES_Year));
    console.log('  - Trimmed:', JSON.stringify(trimmedYear));
    const requestBody = {
        MI_Id: payload.MI_Id || 30,
        HRES_Year: trimmedYear,
        HRES_Month: trimmedMonth,
        hrmdeS_IdList: payload.hrmdeS_IdList && payload.hrmdeS_IdList.length > 0 ? payload.hrmdeS_IdList : [0],
        hrmD_IdList: payload.hrmD_IdList && payload.hrmD_IdList.length > 0 ? payload.hrmD_IdList : [0],
        groupTypeIdList: payload.groupTypeIdList && payload.groupTypeIdList.length > 0 ? payload.groupTypeIdList : [0],
        LogInUserId: payload.LogInUserId || 0
    };
    console.log('📤 [SALARY APPROVAL - BACKEND] Request body prepared:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<SalaryApprovalSearchResponse>('hrms', url, requestBody        );
        // The backend returns raw data, not wrapped in ApiResponse format
        // Wrap it to match the expected ApiResponse structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            const employeeCount = (response.data as SalaryApprovalSearchResponse)?.ReportData?.length || 0;
            console.log('🔍 [SALARY APPROVAL - BACKEND] ReportData type:', typeof (response.data as SalaryApprovalSearchResponse)?.ReportData);
            console.log('🔍 [SALARY APPROVAL - BACKEND] ReportData value:', JSON.stringify((response.data as SalaryApprovalSearchResponse)?.ReportData, null, 2));
            console.log('🔵 [SALARY APPROVAL - BACKEND] searchSalaryApprovalEmployees - END (Success)');
            return response;
        }
        // Wrap raw response data
        const wrappedResponse = {
            success: true,
            message: 'Data loaded successfully',
            data: response as unknown as SalaryApprovalSearchResponse
        };
        // Detailed inspection of ReportData
        const reportData = wrappedResponse.data?.ReportData;
        console.log('  - Is Array:', Array.isArray(reportData));
        console.log('  - Value:', JSON.stringify(reportData, null, 2));
        if (reportData && Array.isArray(reportData)) {
            if (reportData.length > 0) {
                console.log('  - First item keys:', Object.keys(reportData[0] || {}));
            }
        }
        const employeeCount = Array.isArray(reportData) ? reportData.length : 0;
        if (employeeCount > 0 && reportData) {
            console.log('📋 [SALARY APPROVAL - BACKEND] First employee sample:', JSON.stringify(reportData[0], null, 2));
        } else {
            console.log('  - Has employeeDetails:', 'employeeDetails' in (response as any));
            console.log('  - Has masterEmployeeList:', 'masterEmployeeList' in (response as any));
            console.log('  - Has currentemployeeDetails:', 'currentemployeeDetails' in (response as any));
            if ((response as any)?.employeeDetails) {
                console.log('  - employeeDetails type:', typeof (response as any).employeeDetails);
                console.log('  - employeeDetails is array:', Array.isArray((response as any).employeeDetails));
            }
        }
        console.log('🔵 [SALARY APPROVAL - BACKEND] searchSalaryApprovalEmployees - END (Success)');
        return wrappedResponse;
    } catch (error) {
        console.error('💥 [SALARY APPROVAL - BACKEND] Error message:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
/**
 * Approve or reject salaries for selected employees
 * POST /api/CumulativeSalaryReportFacade/approveSalary
 */
export async function approveSalaries(payload: SalaryApprovalRequest) {
    console.log('📥 [SALARY APPROVAL - BACKEND] Request payload:', JSON.stringify(payload, null, 2));
    const url = '/api/CumulativeSalaryReportFacade/approveSalary';
    try {
        const response = await api.post<SalaryApprovalResponse>('hrms', url, payload);
        console.log('📤 [SALARY APPROVAL - BACKEND] Response:', JSON.stringify(response, null, 2));
        console.log('🔵 [SALARY APPROVAL - BACKEND] approveSalaries - END (Success)');
        return response;
    } catch (error) {
        console.error('💥 [SALARY APPROVAL - BACKEND] Error message:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
/**
 * Test API connection for salary approval process
 */
export async function testSalaryApprovalProcessAPI(miId: number = 30) {
    const url = `/api/HRMS_Trans_SalaryApprovalProcess/onloadgetdetails/${miId}`;
    return await api.get<SalaryApprovalOnloadResponse>('hrms', url);
}
