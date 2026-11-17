'use server';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    MasterLeaveGetRequest,
    MasterLeaveGetResponse,
    MasterLeaveGetResponseData,
    MasterLeaveSaveRequest,
    MasterLeaveListItem
} from '@/types/hrms/leave-management/master-leave';
/**
 * Get master leave dropdown options (leave types, etc.)
 * This is a helper function that calls GetLeave with HRML_Id=0 to get dropdown data
 */
export async function getMasterLeaveDropdowns(request: { MI_Id?: number }): Promise<{
    leaveTypes: Array<{ value: string; label: string }>;
    leaveOrders: Array<{ value: number; label: string }>;
}> {
    const response = await getMasterLeave({
        MI_Id: String(request.MI_Id || HRMS_MI_ID)
    });

    if (!response || !response.success || !response.data) {
        return {
            leaveTypes: [],
            leaveOrders: []
        };
    }
    // Extract leave types from master_eventlist or dropdowns if provided in same response
    let leaveTypes: Array<{ value: string; label: string }> = [];
    const responseData = response.data as any;
    if (responseData?.master_eventlist && Array.isArray(responseData.master_eventlist)) {
        leaveTypes = responseData.master_eventlist
            .map((item: any) => {
                const value = item.value || item.LeaveType || item.HRML_LeaveType || item.type || '';
                const label = item.label || item.LeaveTypeName || item.HRML_LeaveName || item.name || value;
                return { value: String(value), label: String(label) };
            })
            .filter((item: { value: string; label: string }) => item.value && item.label);
    }
    // Extract leave orders
    let leaveOrders: Array<{ value: number; label: string }> = [];
    if (responseData?.leaveorderlist && Array.isArray(responseData.leaveorderlist)) {
        leaveOrders = responseData.leaveorderlist
            .map((item: any) => {
                const value = item.value || item.Order || item.HRML_LateDeductOrder || item.order || 0;
                const label = item.label || item.OrderName || String(value);
                return { value: Number(value), label: String(label) };
            })
            .filter((item: { value: number; label: string }) => item.value !== undefined);
    }
    return {
        leaveTypes,
        leaveOrders
    };
}
/**
 * Get master leave for editing
 * GET /api/MasterLeave/get_master_leave_by_id/{hrml_id}
 *
 * @param HRML_Id - Leave ID to edit
 * @returns Master leave data for editing
 */
export async function getMasterLeaveForEdit(HRML_Id: number): Promise<ApiResponse<MasterLeaveListItem>> {
    const url = `/api/MasterLeave/get_master_leave_by_id/${HRML_Id}`;
    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔵 [SERVER] GET Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        if (isSuccess && res.data) {
            return {
                success: true,
                message: res.message || 'Data fetched successfully',
                data: res.data
            };
        }

        // Handle case where data is directly the response object
        if (res.hrmL_Id || res.HRML_Id) {
            return {
                success: true,
                message: 'Data fetched successfully',
                data: res
            };
        }

        throw new Error(res.message || 'Failed to fetch leave data for editing');
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch master leave data for editing';
        throw new Error(errorMessage);
    }
}
import type { ApiSearchparams } from '@/types';

/**
 * Get master leave details
 * GET /api/MasterLeave/get_master_leave_details
 *
 * @param searchParams - Search parameters for filtering
 * @returns Master leave data
 */
export async function getMasterLeave(
    searchParams?: ApiSearchparams & { MI_Id?: string | number; HRML_Id?: number }
): Promise<ApiResponse<MasterLeaveListItem[] | MasterLeaveGetResponseData>> {
    const miId = searchParams?.MI_Id || HRMS_MI_ID;

    // Construct query parameters manually for better control
    const params = new URLSearchParams();
    params.append('MI_Id', String(miId));
    params.append('mI_Id', String(miId)); // Backend sometimes expects mI_Id

    if (searchParams?.page) params.append('page', String(searchParams.page));
    if (searchParams?.page_size) params.append('page_size', String(searchParams.page_size));
    if (searchParams?.search_query) params.append('search_query', searchParams.search_query);
    if (searchParams?.sort_column) params.append('sort_column', searchParams.sort_column);
    if (searchParams?.sort_direction) params.append('sort_direction', searchParams.sort_direction);
    if (searchParams?.HRML_Id) params.append('HRML_Id', String(searchParams.HRML_Id));

    const url = `/api/MasterLeave/get_master_leave_details?${params.toString()}`;

    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔵 [SERVER] GET Response:', JSON.stringify(response, null, 2));

        // Handle the case where the response itself is the array
        if (Array.isArray(response)) {
            console.log('🔵 [SERVER] GET Response is an array');
            return { success: true, message: 'Fetched successfully', data: response };
        }

        // Handle case where it's wrapped in ApiResponse
        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        if (response && isSuccess) {
            return {
                ...response,
                success: true,
                page_Size: res.page_size || res.page_Size || 10
            };
        }

        // If returned data exists even if success is not explicitly true
        if (response && response.data) {
            return {
                success: true,
                message: response.message || 'Data fetched',
                data: response.data,
                total: response.total,
                page: response.page,
                page_Size: res.page_size || res.page_Size || 10
            };
        }

        // If the API returns raw array or different structure
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || 'Data fetched successfully',
            data: responseData?.data || responseData || []
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch master leave data';
        throw new Error(errorMessage);
    }
}
/**
 * Save or update master leave
 * POST /api/MasterLeave/add_or_update_master_leave
 *
 * @param data - Master leave data to save or update
 * @returns Save/Update response
 */
export async function saveMasterLeave(data: MasterLeaveSaveRequest): Promise<ApiResponse<MasterLeaveGetResponseData>> {
    const url = '/api/MasterLeave/add_or_update_master_leave';
    const currentDate = new Date().toISOString();
    const isEdit = data.HRML_Id && data.HRML_Id > 0;

    // Map legacy/frontend PascalCase to the new camelCase structure expected by the API
    const requestBody = {
        hrmL_Id: data.HRML_Id || 0,
        mI_Id: data.MI_Id || HRMS_MI_ID,
        hrmL_LeaveName: data.HRML_LeaveName,
        hrmL_LeaveCode: data.HRML_LeaveCode,
        hrmL_LeaveDetails: data.HRML_LeaveDetails || '',
        hrmL_LeaveCreditFlg: !!data.HRML_LeaveCreditFlg,
        hrmL_LeaveType: data.HRML_LeaveType,
        hrmL_LateDeductFlag: !!data.HRML_LateDeductFlag,
        hrmL_LateDeductOrder: Number(data.HRML_LateDeductOrder || 0),
        hrmL_ActiveFlag: data.HRML_ActiveFlag === false || data.HRML_ActiveFlag === 0 ? false : true,
        hrmL_ProbationNotApplicableFlg: !!data.HRML_ProbationNotApplicableFlg,
        hrmL_WhenToApplyFlg: data.HRML_LeaveApplyCriteria || null,
        hrmL_NoOfDays: data.HRML_DaysForApplyCriteria ? Number(data.HRML_DaysForApplyCriteria) : null,
        hrmL_MaxDaysForApply: data.HRML_MaxDaysForApply ? Number(data.HRML_MaxDaysForApply) : null,
        createdDate: data.CreatedDate || currentDate,
        updatedDate: currentDate
    };

    console.log('🟠 [SERVER] POST Request URL:', url);
    console.log('🟠 [SERVER] Request Body:', JSON.stringify(requestBody, null, 2));

    try {
        const response = await api.post<any>('hmslms', url, requestBody);
        console.log('🟢 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        if (isSuccess) {
            return {
                success: true,
                message: res.message || (isEdit ? 'Updated successfully' : 'Saved successfully'),
                data: res.data || requestBody // Fallback to request data if response data is null
            };
        }

        return {
            success: false,
            message: res.message || (isEdit ? 'Failed to update' : 'Failed to save'),
            data: null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save master leave';
        throw new Error(errorMessage);
    }
}
/**
 * Toggle active status of master leave
 * PUT /api/MasterLeave/toggle_master_leave/{hrml_id}
 *
 * @param HRML_Id - Leave ID to toggle
 * @returns Success response
 */
export async function toggleMasterLeave(HRML_Id: number): Promise<ApiResponse<any>> {
    const url = `/api/MasterLeave/toggle_master_leave/${HRML_Id}`;
    console.log('🟡 [SERVER] PUT Request URL:', url);
    try {
        const response = await api.put<any>('hmslms', url, {});
        console.log('🟡 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || (isSuccess ? 'Status toggled successfully' : 'Failed to toggle status'),
            data: res.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to toggle master leave status';
        throw new Error(errorMessage);
    }
}

/**
 * Update master leave display order
 * PUT /api/MasterLeave/update_master_leave_order
 *
 * @param orders - Array of {id, order} objects
 * @returns Success response
 */
export async function updateMasterLeaveOrder(orders: Array<{ id: number; order: number }>): Promise<ApiResponse<any>> {
    const url = '/api/MasterLeave/update_master_leave_order';
    console.log('🟡 [SERVER] PUT Request URL:', url);
    console.log('🟡 [SERVER] Request Body:', JSON.stringify(orders, null, 2));
    try {
        const response = await api.put<any>('hmslms', url, orders);
        console.log('🟡 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || (isSuccess ? 'Order updated successfully' : 'Failed to update order'),
            data: res.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update master leave order';
        throw new Error(errorMessage);
    }
}
/**
 * Delete master leave
 * DELETE /api/MasterLeave/delete_master_leave_by_id/{hrml_id}
 *
 * @param HRML_Id - Leave ID to delete
 * @returns Delete response
 */
export async function deleteMasterLeave(HRML_Id: number): Promise<ApiResponse<any>> {
    const url = `/api/MasterLeave/delete_master_leave_by_id/${HRML_Id}`;
    console.log('🔴 [SERVER] DELETE Request URL:', url);
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
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete master leave';
        throw new Error(errorMessage);
    }
}
