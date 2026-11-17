'use server';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { api, type ApiResponse, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    LeaveTransactionManualApiData,
    LeaveTransactionManualSaveRequest,
    LeaveTransactionManualDeleteRequest
} from '@/types/hrms/leave-management/leave-transaction-manual';

/**
 * Get leave transaction manual list with pagination
 * GET /api/LeaveTransactionManual/get_onload_leave_transaction_list
 */
export async function getLeaveTransactionManualList(
    searchParams?: ApiSearchparams
): Promise<ApiResponse<LeaveTransactionManualApiData[]>> {
    // Build URL with pagination parameters
    const baseUrl = '/api/LeaveTransactionManual/get_onload_leave_transaction_list';
    const queryParams = getSearchParamsUrl(searchParams);
    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔵 [SERVER] GET Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        if (isSuccess) {
            return {
                success: true,
                message: res.message || 'Leave transaction list fetched successfully',
                data: res.data || [],
                total: res.total || 0,
                page: res.page || 1,
                page_size: res.page_size || res.page_Size || 10
            };
        }

        return {
            success: false,
            message: res.message || 'Failed to fetch leave transaction list',
            data: []
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch leave transaction list';
        throw new Error(errorMessage);
    }
}

/**
 * Save or update leave transaction manual
 * POST /api/LeaveTransactionManual/add_or_update_leave_transaction_manual
 */
export async function saveLeaveTransactionManual(
    data: LeaveTransactionManualSaveRequest
): Promise<ApiResponse<LeaveTransactionManualApiData>> {
    const url = '/api/LeaveTransactionManual/add_or_update_leave_transaction_manual';

    console.log('🟠 [SERVER] POST Request URL:', url);
    console.log('🟠 [SERVER] Request Body:', JSON.stringify(data, null, 2));

    try {
        const response = await api.post<any>('hmslms', url, data);
        console.log('🟢 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true' || res.returnval === true;

        return {
            success: isSuccess,
            message: res.message || 'Leave transaction saved successfully',
            data: res.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save leave transaction';
        throw new Error(errorMessage);
    }
}

/**
 * Delete leave transaction manual
 * DELETE /api/LeaveTransactionManual/delete_leave_transaction/{hreltd_id}/{hrelt_id}
 */
export async function deleteLeaveTransactionManual(
    request: LeaveTransactionManualDeleteRequest
): Promise<ApiResponse<any>> {
    const hreltdId = Number(request.HRELTD_Id || 0);
    const hreltId = Number(request.HRELT_Id || 0);

    const url = `/api/LeaveTransactionManual/delete_leave_transaction/${hreltdId}/${hreltId}`;

    console.log(`🔴 [SERVER] DELETE Request URL: ${url}`);

    try {
        const response = await api.delete<any>('hmslms', url);
        console.log('🔴 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true' || res.returnval === true;

        return {
            success: isSuccess,
            message: res.message || (isSuccess ? 'Deleted successfully' : 'Failed to delete'),
            data: res.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete leave transaction';
        throw new Error(errorMessage);
    }
}

/**
 * Toggle leave transaction active status
 * PUT /api/LeaveTransactionManual/activate_deactivate_leave_transaction_manual/{hrelt_id}
 */
export async function toggleLeaveTransactionManual(hreltId: number): Promise<ApiResponse<any>> {
    const url = `/api/LeaveTransactionManual/activate_deactivate_leave_transaction_manual/${hreltId}`;

    console.log(`🟡 [SERVER] PUT Request URL: ${url}`);

    try {
        const response = await api.put<any>('hmslms', url);
        console.log('🟡 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Status toggled successfully',
            data: res.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to toggle status';
        throw new Error(errorMessage);
    }
}

/**
 * Get onload grid details on change of employee
 * GET /api/LeaveTransactionManual/get_onload_grid_details_onchnage_of_employee/{hrme_id}
 */
export async function getEmployeeLeaveDetails(hrmeId: number): Promise<ApiResponse<LeaveTransactionManualApiData[]>> {
    const url = `/api/LeaveTransactionManual/get_onload_grid_details_onchnage_of_employee/${hrmeId}`;

    console.log('🔵 [SERVER] GET Employee Details URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔵 [SERVER] GET Employee Details Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Employee leave details fetched successfully',
            data: res.data || []
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch employee leave details';
        throw new Error(errorMessage);
    }
}
