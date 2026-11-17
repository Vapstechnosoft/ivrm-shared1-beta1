'use server';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    GetOnlineLeaveRequest,
    GetOnlineLeaveResponseData,
    SaveOnlineLeaveRequest,
    SaveOnlineLeaveResponse
} from '@/types/hrms/leave-management/apply-leave';
/**
 * Get online leave applications
 * POST /api/OnlineLeaveApplicationWrapperFacade/GetOnlineLeave
 * 
 * @param request - Request payload with MI_Id and UserId
 * @returns Online leave data
 */
export async function getOnlineLeave(request: GetOnlineLeaveRequest): Promise<ApiResponse<GetOnlineLeaveResponseData>> {
    const url = '/api/OnlineLeaveApplicationWrapperFacade/GetDetails';
    console.log('🔵 [SERVER] POST Request URL:', url);

    const requestBody = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        UserId: request.UserId || 0
    };

    try {
        const response = await api.post<GetOnlineLeaveResponseData>('hmslms', url, requestBody);
        console.log('🔵 [SERVER] POST Response:', JSON.stringify(response, null, 2));

        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped in ApiResponse format
            return response as ApiResponse<GetOnlineLeaveResponseData>;
        }

        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Data fetched successfully',
            data: response as unknown as GetOnlineLeaveResponseData
        };
    } catch (error: any) {
        console.error('🔴 [SERVER] GET Error:', error);
        // Extract error message from API response
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch online leave data';
        // Throw error so hooks can catch and display it
        throw new Error(errorMessage);
    }
}
/**
 * Save or update online leave application
 * POST /api/OnlineLeaveApplicationWrapperFacade/SaveOnlineLeave
 * 
 * @param data - Leave application data to save
 * @returns Save/Update response
 */
export async function saveOnlineLeave(data: SaveOnlineLeaveRequest): Promise<ApiResponse<GetOnlineLeaveResponseData>> {
    const url = '/api/OnlineLeaveApplicationWrapperFacade/SaveOnlineLeave';
    const requestBody: SaveOnlineLeaveRequest = {
        MI_Id: data.MI_Id || HRMS_MI_ID,
        UserId: data.UserId || 0,
        HRME_Id: data.HRME_Id || 0,
        frmToDates: data.frmToDates || [],
        temp_table_data: data.temp_table_data || [],
        HRELT_LeaveReason: data.HRELT_LeaveReason || '',
        HRELT_SupportingDocument: data.HRELT_SupportingDocument || '',
        asmay_id: data.asmay_id || 0
    };
    try {
        const response = await api.post<SaveOnlineLeaveResponse>('hmslms', url, requestBody);
        // Extract return message from response
        const responseData = response as any;
        const retrunMsg = responseData?.retrunMsg ||
            responseData?.data?.retrunMsg ||
            responseData?.message ||
            '';
        // Check for duplicate
        const isDuplicate = retrunMsg === 'Duplicate' ||
            (retrunMsg && retrunMsg.toLowerCase().includes('duplicate'));
        if (isDuplicate) {
            return {
                success: false,
                message: retrunMsg || 'Leave application already exists',
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
            ((response as any)?.success === true);
        let message = retrunMsg || 'Failed to save leave application';
        if (isSuccess) {
            message = retrunMsg || 'Leave application saved successfully';
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
            'Failed to save leave application';
        throw new Error(errorMessage);
    }
}
