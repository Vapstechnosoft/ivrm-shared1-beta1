'use server';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    GetLeaveTransferBasicDataRequest,
    GetLeaveTransferBasicDataResponseData,
    GetLeaveOBRequest,
    GetLeaveOBResponseData,
    GetDepartmentsRequest,
    GetDepartmentsResponseData,
    GetDesignationRequest,
    GetDesignationResponseData,
    SaveLeaveTransferDetailsRequest,
    SaveLeaveTransferDetailsResponseData,
    LeaveCarryForwardRequest,
    LeaveCarryForwardResponseData,
    DeleteLeaveTransferRequest,
    DeleteLeaveTransferResponseData
} from '@/types/hrms/leave-management/leave-transfer';
/**
 * Get basic data for leave transfer page
 * POST /api/LeaveTransferWrapperFacade/GetBasicData
 * 
 * @param request - Request payload with MI_Id
 * @returns Basic data including dropdown options
 */
export async function getLeaveTransferBasicData(request: GetLeaveTransferBasicDataRequest): Promise<ApiResponse<GetLeaveTransferBasicDataResponseData>> {
    const url = '/api/LeaveTransferWrapperFacade/GetBasicData';
    const requestBody: GetLeaveTransferBasicDataRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID
    };
    try {
        const response = await api.post<GetLeaveTransferBasicDataResponseData>('hmslms', url, requestBody);
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveTransferBasicDataResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveTransferBasicDataResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch leave transfer basic data';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get leave OB (Outstanding Balance) data
 * POST /api/LeaveTransferWrapperFacade/GetLeaveOB
 * 
 * @param request - Request payload with MI_Id
 * @returns Leave OB data including employee leave balances
 */
export async function getLeaveOB(request: GetLeaveOBRequest): Promise<ApiResponse<GetLeaveOBResponseData>> {
    const url = '/api/LeaveTransferWrapperFacade/GetLeaveOB';
    const requestBody: GetLeaveOBRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetLeaveOBResponseData>('hmslms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetLeaveOBResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetLeaveOBResponseData
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to fetch leave OB data';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Get departments based on selected employee types
 * POST /api/LeaveTransferWrapperFacade/GetDepartments
 * 
 * @param request - Request payload with MI_Id and emptypes array
 * @returns Department data filtered by employee types
 */
export async function getDepartments(request: GetDepartmentsRequest): Promise<ApiResponse<GetDepartmentsResponseData>> {
    const url = '/api/LeaveTransferWrapperFacade/GetDepartments';
    const requestBody: GetDepartmentsRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || []
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetDepartmentsResponseData>('hmslms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetDepartmentsResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetDepartmentsResponseData
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
 * Get designations based on selected employee types
 * POST /api/LeaveTransferWrapperFacade/GetDesignation
 * 
 * @param request - Request payload with MI_Id and emptypes array
 * @returns Designation data filtered by employee types
 */
export async function getDesignation(request: GetDesignationRequest): Promise<ApiResponse<GetDesignationResponseData>> {
    const url = '/api/LeaveTransferWrapperFacade/GetDesignation';
    const requestBody: GetDesignationRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emptypes: request.emptypes || []
    };
    console.log('🔵 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<GetDesignationResponseData>('hmslms', url, requestBody);
        console.log('🔵 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetDesignationResponseData>;
        }
        // Wrap raw response data
        return {
            success: (response as any)?.success ?? true,
            message: (response as any)?.message || (response as any)?.retrunMsg || (response as any)?.message || 'Data fetched successfully',
            data: response as unknown as GetDesignationResponseData
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
 * Save leave transfer details
 * POST /api/LeaveTransferWrapperFacade/SaveDetails
 * 
 * @param data - Leave transfer details data to save
 * @returns Save response
 */
export async function saveLeaveTransferDetails(data: SaveLeaveTransferDetailsRequest): Promise<ApiResponse<SaveLeaveTransferDetailsResponseData>> {
    const url = '/api/LeaveTransferWrapperFacade/SaveDetails';
    const requestBody: SaveLeaveTransferDetailsRequest = {
        MI_Id: data.MI_Id || HRMS_MI_ID,
        HRME_SubstituteFlag: data.HRME_SubstituteFlag || '',
        HRELAP_Id: data.HRELAP_Id || 0,
        HRML_Id: data.HRML_Id || 0,
        monthid: data.monthid || 0,
        yearid: data.yearid || 0,
        emplist: data.emplist || [],
        UserId: data.UserId || '',
        HRELS_Id: data.HRELS_Id || 0,
        HRME_Id: data.HRME_Id || 0,
        HRELS_OBLeaves: data.HRELS_OBLeaves || 0,
        HRELS_CreditedLeaves: data.HRELS_CreditedLeaves || 0,
        HRELS_TotalLeaves: data.HRELS_TotalLeaves || 0,
        HRELS_TransLeaves: data.HRELS_TransLeaves || 0,
        HRMLY_Id: data.HRMLY_Id || 0,
        HRELS_EncashedLeaves: data.HRELS_EncashedLeaves || 0,
        HRELS_CBLeaves: data.HRELS_CBLeaves || 0
    };
    console.log('🟠 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<SaveLeaveTransferDetailsResponseData>('hmslms', url, requestBody);
        console.log('🟢 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Extract return message from response
        const responseData = response as any;
        const retrunMsg = responseData?.retrunMsg || 
                         responseData?.data?.retrunMsg || 
                         responseData?.message || 
                         '';
        // Check for duplicate
        const isDuplicate = retrunMsg === 'Duplicate' || 
                           (retrunMsg?.toLowerCase().includes('duplicate') ?? false);
        if (isDuplicate) {
            return {
                success: false,
                message: retrunMsg || 'Leave transfer details already exist',
                data: responseData?.data || null
            };
        }
        // Check for success indicators
        const isUpdateSuccess = retrunMsg === 'Update' || 
                               retrunMsg === 'Saved' || 
                               retrunMsg === 'Add' ||
                               retrunMsg === 'Success' ||
                               responseData?.returnval_Update === true ||
                               responseData?.returnval_add === true ||
                               responseData?.returnval === true;
        const isSuccess = isUpdateSuccess || 
                         (response?.success === true);
        let message = retrunMsg || 'Failed to save leave transfer details';
        if (isSuccess) {
            message = retrunMsg || 'Leave transfer details saved successfully';
        }
        return {
            success: isSuccess,
            message: message,
            data: responseData?.data || null
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to save leave transfer details';
        throw new Error(errorMessage);
    }
}
/**
 * Process leave carry forward
 * POST /api/LeaveTransferWrapperFacade/LeaveCarryForward
 * 
 * @param request - Request payload with MI_Id and emplist array
 * @returns Leave carry forward response
 */
export async function leaveCarryForward(request: LeaveCarryForwardRequest): Promise<ApiResponse<LeaveCarryForwardResponseData>> {
    const url = '/api/LeaveTransferWrapperFacade/LeaveCarryForward';
    const requestBody: LeaveCarryForwardRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        emplist: request.emplist || []
    };
    console.log('🟠 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<LeaveCarryForwardResponseData>('hmslms', url, requestBody);
        console.log('🟢 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Extract return message from response
        const responseData = response as any;
        const retrunMsg = responseData?.retrunMsg || 
                         responseData?.data?.retrunMsg || 
                         responseData?.message || 
                         '';
        // Check for duplicate
        const isDuplicate = retrunMsg === 'Duplicate' || 
                           (retrunMsg?.toLowerCase().includes('duplicate') ?? false);
        if (isDuplicate) {
            return {
                success: false,
                message: retrunMsg || 'Leave carry forward already exists',
                data: responseData?.data || null
            };
        }
        // Check for success indicators
        const isUpdateSuccess = retrunMsg === 'Update' || 
                               retrunMsg === 'Saved' || 
                               retrunMsg === 'Add' ||
                               retrunMsg === 'Success' ||
                               retrunMsg === 'CarryForward' ||
                               retrunMsg === 'Carry Forward' ||
                               responseData?.returnval_Update === true ||
                               responseData?.returnval_add === true ||
                               responseData?.returnval === true;
        const isSuccess = isUpdateSuccess || 
                         (response?.success === true);
        let message = retrunMsg || 'Failed to process leave carry forward';
        if (isSuccess) {
            message = retrunMsg || 'Leave carry forward processed successfully';
        }
        return {
            success: isSuccess,
            message: message,
            data: responseData?.data || null
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to process leave carry forward';
        throw new Error(errorMessage);
    }
}
/**
 * Delete leave transfer record
 * POST /api/LeaveTransferWrapperFacade/DeletePages
 * 
 * @param request - Request payload with HRELS_Id
 * @returns Delete response
 */
export async function deleteLeaveTransfer(request: DeleteLeaveTransferRequest): Promise<ApiResponse<DeleteLeaveTransferResponseData>> {
    const url = '/api/LeaveTransferWrapperFacade/DeletePages';
    const requestBody: DeleteLeaveTransferRequest = {
        HRELS_Id: request.HRELS_Id || 0
    };
    console.log('🔴 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await api.post<DeleteLeaveTransferResponseData>('hmslms', url, requestBody);
        console.log('🔴 [SERVER] Response:', JSON.stringify(response, null, 2));
        // Extract return message from response
        const responseData = response as any;
        const retrunMsg = responseData?.retrunMsg || 
                         responseData?.data?.retrunMsg || 
                         responseData?.message || 
                         '';
        // Check for success indicators
        const isSuccess = retrunMsg === 'Delete' || 
                         retrunMsg === 'Deleted' ||
                         retrunMsg === 'Success' ||
                         responseData?.returnval === true ||
                         response?.success === true;
        let message = retrunMsg || 'Failed to delete leave transfer';
        if (isSuccess) {
            message = retrunMsg || 'Leave transfer deleted successfully';
        }
        return {
            success: isSuccess,
            message: message,
            data: responseData?.data || null
        };
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message || 
                           error?.response?.data?.retrunMsg || 
                           error?.message || 
                           'Failed to delete leave transfer';
        throw new Error(errorMessage);
    }
}
