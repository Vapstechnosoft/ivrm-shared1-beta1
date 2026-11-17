'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import type {
    GetLeaveOBRequest,
    GetLeaveOBResponseData,
    GetLeaveOpeningBalanceDepartmentsRequest,
    GetLeaveOpeningBalanceDepartmentsResponseData,
    GetLeaveOpeningBalanceDesignationRequest,
    GetLeaveOpeningBalanceDesignationResponseData,
    GetOBDetailsRequest,
    GetOBDetailsResponseData,
    GetEmployeOBRequest,
    GetEmployeOBResponseData,
    SaveLeaveOpeningBalanceRequest,
    SaveLeaveOpeningBalanceResponseData,
    DeleteLeaveOpeningBalanceRequest,
    DeleteLeaveOpeningBalanceResponseData,
    GetLeaveOpeningBalancePageDetailsRequest,
    GetLeaveOpeningBalancePageDetailsResponseData
} from '@/types/hrms/leave-management/leave-opening-balance';
/**
 * Get leave opening balance data
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetLeaveOB
 * 
 * @param request - Request payload with MI_Id
 * @returns Leave opening balance data
 */
export async function getLeaveOB(request: GetLeaveOBRequest): Promise<ApiResponse<GetLeaveOBResponseData>> {
    const url = '/api/LeaveOpeningBalanceWrapperFacade/GetLeaveOB';
    const requestBody: GetLeaveOBRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID
    };
    try {
        const response = await api.post<GetLeaveOBResponseData>('hmslms', url, requestBody);
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveOBResponseData>;
        }
        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetLeaveOBResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch leave opening balance';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get departments for leave opening balance
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetDepartments
 * 
 * @param request - Request payload with MI_Id
 * @returns Departments data
 */
export async function getLeaveOpeningBalanceDepartments(request: GetLeaveOpeningBalanceDepartmentsRequest): Promise<ApiResponse<GetLeaveOpeningBalanceDepartmentsResponseData>> {
    const url = '/api/LeaveOpeningBalanceWrapperFacade/GetDepartments';
    const requestBody: GetLeaveOpeningBalanceDepartmentsRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID
    };
    try {
        const response = await api.post<GetLeaveOpeningBalanceDepartmentsResponseData>('hmslms', url, requestBody);
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveOpeningBalanceDepartmentsResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveOpeningBalanceDepartmentsResponseData
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
 * Get designations for leave opening balance
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetDesignation
 * 
 * @param request - Request payload with MI_Id
 * @returns Designations data
 */
export async function getLeaveOpeningBalanceDesignation(request: GetLeaveOpeningBalanceDesignationRequest): Promise<ApiResponse<GetLeaveOpeningBalanceDesignationResponseData>> {
    const url = '/api/LeaveOpeningBalanceWrapperFacade/GetDesignation';
    const requestBody: GetLeaveOpeningBalanceDesignationRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID
    };
    try {
        const response = await api.post<GetLeaveOpeningBalanceDesignationResponseData>('hmslms', url, requestBody);
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveOpeningBalanceDesignationResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveOpeningBalanceDesignationResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch designations';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get OB details for leave opening balance
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetOBDetails
 * 
 * @param request - Request payload with MI_Id
 * @returns OB details data
 */
export async function getOBDetails(request: GetOBDetailsRequest): Promise<ApiResponse<GetOBDetailsResponseData>> {
    const url = '/api/LeaveOpeningBalanceWrapperFacade/GetOBDetails';
    const requestBody: GetOBDetailsRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID
    };
    try {
        const response = await api.post<GetOBDetailsResponseData>('hmslms', url, requestBody);
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetOBDetailsResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetOBDetailsResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch OB details';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get employee OB data for leave opening balance
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetEmployeOB
 * 
 * @param request - Request payload with MI_Id and optional filter arrays (emptypes, empdept, empdesg)
 * @returns Employee OB data
 */
export async function getEmployeOB(request: GetEmployeOBRequest): Promise<ApiResponse<GetEmployeOBResponseData>> {
    const url = '/api/LeaveOpeningBalanceWrapperFacade/GetEmployeOB';
    const requestBody: GetEmployeOBRequest = {
        ...request, // Include any additional fields first
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || [],
        empdept: request.empdept || [],
        empdesg: request.empdesg || []
    };
    try {
        const response = await api.post<GetEmployeOBResponseData>('hmslms', url, requestBody);
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetEmployeOBResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetEmployeOBResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch employee OB data';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Save leave opening balance data
 * POST /api/LeaveOpeningBalanceWrapperFacade/Save
 * 
 * @param data - Request payload with MI_Id, HRME_Id, HRMLY_Id, and temp_table_data
 * @returns Save response data
 */
export async function saveLeaveOpeningBalance(data: SaveLeaveOpeningBalanceRequest): Promise<ApiResponse<SaveLeaveOpeningBalanceResponseData>> {
    const url = '/api/LeaveOpeningBalanceWrapperFacade/Save';
    const requestBody: SaveLeaveOpeningBalanceRequest = {
        ...data, // Include any additional fields first
        MI_Id: data.MI_Id || HRMS_MI_ID,
        HRME_Id: data.HRME_Id || 0,
        HRMLY_Id: data.HRMLY_Id || 0,
        temp_table_data: data.temp_table_data || []
    };
    try {
        const response = await api.post<SaveLeaveOpeningBalanceResponseData>('hmslms', url, requestBody);
        let responseData: SaveLeaveOpeningBalanceResponseData;
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            responseData = (response as any).data;
        } else {
            responseData = response as unknown as SaveLeaveOpeningBalanceResponseData;
        }
        const successMessage = responseData?.retrunMsg || 
                              responseData?.message || 
                              (response as any)?.message || 
                              (responseData?.returnval_add ? 'Leave opening balance created successfully' : 
                               responseData?.returnval_Update ? 'Leave opening balance updated successfully' : 
                               'Leave opening balance saved successfully');
        if (responseData?.dupr || responseData?.returnduplicatestatus) {
            const duplicateMessage = responseData?.returnduplicatestatus || 'Duplicate record found';
            return {
                success: false,
                message: duplicateMessage,
                data: responseData
            };
        }
        return {
            success: responseData?.returnval ?? (response as any)?.success ?? true,
            message: successMessage,
            data: responseData
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to save leave opening balance';
        throw new Error(errorMessage);
    }
}
/**
 * Delete leave opening balance record
 * POST /api/LeaveOpeningBalanceWrapperFacade/DeletePages
 * 
 * @param request - Request payload with HREOBL_Id
 * @returns Delete response data
 */
export async function deleteLeaveOpeningBalance(request: DeleteLeaveOpeningBalanceRequest): Promise<ApiResponse<DeleteLeaveOpeningBalanceResponseData>> {
    const url = '/api/LeaveOpeningBalanceWrapperFacade/DeletePages';
    const requestBody: DeleteLeaveOpeningBalanceRequest = {
        HREOBL_Id: request.HREOBL_Id || 0
    };
    try {
        const response = await api.post<DeleteLeaveOpeningBalanceResponseData>('hmslms', url, requestBody);
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<DeleteLeaveOpeningBalanceResponseData>;
        }
        // Wrap raw response data
        const responseData = response as unknown as DeleteLeaveOpeningBalanceResponseData;
        return {
            success: responseData?.returnval ?? (response as any)?.success ?? true,
            message: responseData?.retrunMsg || responseData?.message || (response as any)?.message || 'Leave opening balance deleted successfully',
            data: responseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to delete leave opening balance';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get page details for leave opening balance
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetPageDetails
 * 
 * @param request - Request payload with Id
 * @returns Page details data
 */
export async function getLeaveOpeningBalancePageDetails(request: GetLeaveOpeningBalancePageDetailsRequest): Promise<ApiResponse<GetLeaveOpeningBalancePageDetailsResponseData>> {
    const url = '/api/LeaveOpeningBalanceWrapperFacade/GetPageDetails';
    const requestBody: GetLeaveOpeningBalancePageDetailsRequest = {
        Id: request.Id || 0
    };
    try {
        const response = await api.post<GetLeaveOpeningBalancePageDetailsResponseData>('hmslms', url, requestBody);
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveOpeningBalancePageDetailsResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveOpeningBalancePageDetailsResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch page details';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
