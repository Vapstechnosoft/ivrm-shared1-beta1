'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    GetEmployeeLeaveDetailsResponse,
    GetEmployeeLeaveStatusDetailsResponse,
    SaveOnlineLeaveApplicationRequest
} from '@/types/hrms/leave-management/online-leave-application';

/**
 * Get employee leave details
 * GET /api/OnlineLeaveApplication/get_employee_leave_details
 */
export async function getEmployeeLeaveDetails(): Promise<ApiResponse<GetEmployeeLeaveDetailsResponse>> {
    const url = '/api/OnlineLeaveApplication/get_employee_leave_details';
    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Employee leave details fetched successfully',
            data: res.data || null
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch employee leave details');
    }
}

/**
 * Get employee leave status details
 * GET /api/OnlineLeaveApplication/get_employee_leave_status_details
 */
export async function getEmployeeLeaveStatusDetails(): Promise<ApiResponse<GetEmployeeLeaveStatusDetailsResponse>> {
    const url = '/api/OnlineLeaveApplication/get_employee_leave_status_details';
    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Leave status details fetched successfully',
            data: res.data || null
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch leave status details');
    }
}

/**
 * Save online leave application
 * POST /api/OnlineLeaveApplication/save_online_leave_application
 */
export async function saveOnlineLeaveApplication(data: SaveOnlineLeaveApplicationRequest): Promise<ApiResponse<any>> {
    const url = '/api/OnlineLeaveApplication/save_online_leave_application';
    console.log('🟠 [SERVER] POST Request URL:', url);
    try {
        const response = await api.post<any>('hmslms', url, data);
        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Leave application submitted successfully',
            data: res.data || null
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to submit leave application');
    }
}

/**
 * Delete employee leave by ID
 * DELETE /api/OnlineLeaveApplication/delete_employee_leave_by_id/{hrelap_id}
 */
export async function deleteEmployeeLeaveById(hrelapId: number): Promise<ApiResponse<any>> {
    const url = `/api/OnlineLeaveApplication/delete_employee_leave_by_id/${hrelapId}`;
    console.log('🔴 [SERVER] DELETE Request URL:', url);
    try {
        const response = await api.delete<any>('hmslms', url);
        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Leave record deleted successfully',
            data: res.data || null
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to delete leave record');
    }
}

/**
 * Save leave request document
 * POST /api/OnlineLeaveApplication/save_leave_request_document/{hrme_id}
 */
export async function saveLeaveRequestDocument(hrmeId: number, formData: FormData): Promise<ApiResponse<string>> {
    const url = `/api/OnlineLeaveApplication/save_leave_request_document/${hrmeId}`;
    console.log('🟠 [SERVER] POST Request URL:', url);
    try {
        const response = await api.postMultipart<any>('hmslms', url, formData);
        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Document uploaded successfully',
            data: res.data || ''
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to upload document');
    }
}
