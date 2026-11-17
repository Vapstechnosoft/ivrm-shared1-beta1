'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import type {
    GetLeaveReportRequest,
    GetLeaveReportResponseData,
    GetLeaveReportDepartmentsRequest,
    GetLeaveReportDepartmentsResponseData,
    GetLeaveReportDesignationRequest,
    GetLeaveReportDesignationResponseData,
    GetLeaveReportEmployeesRequest,
    GetLeaveReportEmployeesResponseData,
    GetLeaveReportDataRequest,
    GetLeaveReportDataResponseData,
    GetPeriodLeaveReportRequest,
    GetPeriodLeaveReportResponseData,
    GetPeriodLeaveReportDepartmentsRequest,
    GetPeriodLeaveReportDepartmentsResponseData,
    GetPeriodLeaveReportDesignationRequest,
    GetPeriodLeaveReportDesignationResponseData,
    GetPeriodLeaveReportEmployeesRequest,
    GetPeriodLeaveReportEmployeesResponseData,
    GetPeriodLeaveReportDataRequest,
    GetPeriodLeaveReportDataResponseData,
    GetLeaveReportYearwiseRequest,
    GetLeaveReportYearwiseResponseData
} from '@/types/hrms/leave-management/leave-report';
/**
 * Get leave report data
 * POST /api/LeaveReportWrapperFacade/GetLeaveReport
 * 
 * @param request - Request payload with MI_Id
 * @returns Leave report data
 */
export async function getLeaveReport(request: GetLeaveReportRequest): Promise<ApiResponse<GetLeaveReportResponseData>> {
    const url = '/api/LeaveReportWrapperFacade/GetLeaveReport';
    const requestBody: GetLeaveReportRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID
    };
    console.log('📊 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveReportResponseData>('hmslms', url, requestBody);
        console.log('📊 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveReportResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetLeaveReportResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch leave report';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get departments for leave report
 * POST /api/LeaveReportWrapperFacade/GetDepartments
 * 
 * @param request - Request payload with MI_Id and optional emptypes array
 * @returns Departments data
 */
export async function getLeaveReportDepartments(request: GetLeaveReportDepartmentsRequest): Promise<ApiResponse<GetLeaveReportDepartmentsResponseData>> {
    const url = '/api/LeaveReportWrapperFacade/GetDepartments';
    const requestBody: GetLeaveReportDepartmentsRequest = {
        ...request, // Include any additional fields first
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || []
    };
    console.log('🏢 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveReportDepartmentsResponseData>('hmslms', url, requestBody);
        console.log('🏢 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveReportDepartmentsResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetLeaveReportDepartmentsResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch departments';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get leave report data with filters
 * POST /api/LeaveReportWrapperFacade/GetReport
 * 
 * @param request - Request payload with filters
 * @returns Leave report data
 */
export async function getLeaveReportData(request: GetLeaveReportDataRequest): Promise<ApiResponse<GetLeaveReportDataResponseData>> {
    const url = '/api/LeaveReportWrapperFacade/GetReport';
    const requestBody: GetLeaveReportDataRequest = {
        ...request, // Include any additional fields first
        MI_Id: request.MI_Id || HRMS_MI_ID,
        selectedLeave: request.selectedLeave || '',
        selectedEmployee: request.selectedEmployee || '',
        HRELTD_FromDate: request.HRELTD_FromDate || '',
        HRELT_ToDate: request.HRELT_ToDate || '',
        Edit_flag: request.Edit_flag ?? true,
        selectedreport: request.selectedreport || [],
        UserId: request.UserId || 0
    };
    console.log('📊 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveReportDataResponseData>('hmslms', url, requestBody);
        console.log('📊 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveReportDataResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetLeaveReportDataResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch leave report data';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get period leave report data
 * POST /api/LeaveReportWrapperFacade/PeriodGetLeaveReport
 * 
 * @param request - Request payload with MI_Id
 * @returns Period leave report data
 */
export async function getPeriodLeaveReport(request: GetPeriodLeaveReportRequest): Promise<ApiResponse<GetPeriodLeaveReportResponseData>> {
    const url = '/api/LeaveReportWrapperFacade/PeriodGetLeaveReport';
    const requestBody: GetPeriodLeaveReportRequest = {
        ...request, // Include any additional fields first
        MI_Id: request.MI_Id || HRMS_MI_ID
    };
    console.log('📅 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetPeriodLeaveReportResponseData>('hmslms', url, requestBody);
        console.log('📅 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetPeriodLeaveReportResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetPeriodLeaveReportResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch period leave report';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get departments for period leave report
 * POST /api/LeaveReportWrapperFacade/PeriodGetDepartments
 * 
 * @param request - Request payload with MI_Id and optional emptypes array
 * @returns Departments data
 */
export async function getPeriodLeaveReportDepartments(request: GetPeriodLeaveReportDepartmentsRequest): Promise<ApiResponse<GetPeriodLeaveReportDepartmentsResponseData>> {
    const url = '/api/LeaveReportWrapperFacade/PeriodGetDepartments';
    const requestBody: GetPeriodLeaveReportDepartmentsRequest = {
        ...request, // Include any additional fields first
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || []
    };
    console.log('🏢 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetPeriodLeaveReportDepartmentsResponseData>('hmslms', url, requestBody);
        console.log('🏢 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetPeriodLeaveReportDepartmentsResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetPeriodLeaveReportDepartmentsResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch departments for period leave report';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get designations for period leave report
 * POST /api/LeaveReportWrapperFacade/PeriodGetDesignation
 * 
 * @param request - Request payload with MI_Id and optional emptypes array
 * @returns Designations data
 */
export async function getPeriodLeaveReportDesignation(request: GetPeriodLeaveReportDesignationRequest): Promise<ApiResponse<GetPeriodLeaveReportDesignationResponseData>> {
    const url = '/api/LeaveReportWrapperFacade/PeriodGetDesignation';
    const requestBody: GetPeriodLeaveReportDesignationRequest = {
        ...request, // Include any additional fields first
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || []
    };
    console.log('💼 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetPeriodLeaveReportDesignationResponseData>('hmslms', url, requestBody);
        console.log('💼 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetPeriodLeaveReportDesignationResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetPeriodLeaveReportDesignationResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch designations for period leave report';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get employees for period leave report
 * POST /api/LeaveReportWrapperFacade/PeriodGetEmployees
 * 
 * @param request - Request payload with MI_Id and optional emptypes and empdept arrays
 * @returns Employees data
 */
export async function getPeriodLeaveReportEmployees(request: GetPeriodLeaveReportEmployeesRequest): Promise<ApiResponse<GetPeriodLeaveReportEmployeesResponseData>> {
    const url = '/api/LeaveReportWrapperFacade/PeriodGetEmployees';
    const requestBody: GetPeriodLeaveReportEmployeesRequest = {
        ...request, // Include any additional fields first
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || [],
        empdept: request.empdept || []
    };
    console.log('👤 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetPeriodLeaveReportEmployeesResponseData>('hmslms', url, requestBody);
        console.log('👤 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetPeriodLeaveReportEmployeesResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetPeriodLeaveReportEmployeesResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch employees for period leave report';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get period leave report data with filters
 * POST /api/LeaveReportWrapperFacade/PeriodGetReport
 * 
 * @param request - Request payload with filters
 * @returns Period leave report data
 */
export async function getPeriodLeaveReportData(request: GetPeriodLeaveReportDataRequest): Promise<ApiResponse<GetPeriodLeaveReportDataResponseData>> {
    const url = '/api/LeaveReportWrapperFacade/PeriodGetReport';
    const requestBody: GetPeriodLeaveReportDataRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        selectedLeave: request.selectedLeave || '',
        selectedEmployee: request.selectedEmployee || '',
        HRELTD_FromDate: request.HRELTD_FromDate || '',
        HRELT_ToDate: request.HRELT_ToDate || '',
        Edit_flag: request.Edit_flag ?? true,
        selectedreport: request.selectedreport || [],
        UserId: request.UserId || 0
    };
    console.log('📅 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetPeriodLeaveReportDataResponseData>('hmslms', url, requestBody);
        console.log('📅 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetPeriodLeaveReportDataResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetPeriodLeaveReportDataResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch period leave report data';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get yearwise leave report data with filters
 * POST /api/LeaveReportWrapperFacade/GetReportYearwise
 * 
 * @param request - Request payload with filters
 * @returns Yearwise leave report data
 */
export async function getLeaveReportYearwise(request: GetLeaveReportYearwiseRequest): Promise<ApiResponse<GetLeaveReportYearwiseResponseData>> {
    const url = '/api/LeaveReportWrapperFacade/GetReportYearwise';
    const requestBody: GetLeaveReportYearwiseRequest = {
        ...request, // Include any additional fields first
        MI_Id: request.MI_Id || HRMS_MI_ID,
        selectedLeave: request.selectedLeave || '',
        selectedEmployee: request.selectedEmployee || '',
        HRELTD_FromDate: request.HRELTD_FromDate || '',
        HRELT_ToDate: request.HRELT_ToDate || '',
        Edit_flag: request.Edit_flag ?? true,
        selectedreport: request.selectedreport || [],
        UserId: request.UserId || 0,
        valreturn: request.valreturn || ''
    };
    console.log('📅 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveReportYearwiseResponseData>('hmslms', url, requestBody);
        console.log('📅 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveReportYearwiseResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetLeaveReportYearwiseResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch yearwise leave report data';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
