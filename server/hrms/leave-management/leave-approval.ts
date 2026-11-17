'use server';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { api, type ApiResponse, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    GetApprovalStatusRequest,
    GetApprovalStatusResponseData,
    GetStatusAsyncRequest,
    GetStatusAsyncResponseData,
    RejectStatusAsyncRequest,
    RejectStatusAsyncResponseData,
    GetApprovedLeaveRequest,
    GetApprovedLeaveResponseData,
    ViewLeaveBalanceHistoryRequest,
    ViewLeaveBalanceHistoryResponseData,
    GetRequestStatusRequest,
    GetRequestStatusResponseData,
    GetApproveStatusAsyncRequest,
    GetApproveStatusAsyncResponseData,
    GetPeriodApprovalStatusRequest,
    GetPeriodApprovalStatusResponseData,
    PeriodLeaveStatusRequest,
    PeriodLeaveStatusResponseData,
    LeaveApprovalGridItem,
    ApproveRejectLeaveStatusRequest,
    LeaveBalanceHistoryItem
} from '@/types/hrms/leave-management/leave-approval';

/**
 * Leave Approval Server Functions
 * Using Admin On Duty Apply APIs as the LeaveApprovalFacade endpoints are returning 405 errors
 */

/**
 * Get leave approval status
 * POST /api/LeaveApprovalFacade/GetApprovalStatus
 */
export async function getApprovalStatus(request: GetApprovalStatusRequest): Promise<ApiResponse<GetApprovalStatusResponseData>> {
    const url = '/api/LeaveApprovalFacade/get_approval_status';
    const requestBody: GetApprovalStatusRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID
    };

    console.log('🔵 [SERVER] POST Request URL:', url);
    try {
        const response = await api.post<GetApprovalStatusResponseData>('hmslms', url, requestBody);
        console.log('🔵 [SERVER] POST Response:', JSON.stringify(response, null, 2));

        // Handle the response structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response as ApiResponse<GetApprovalStatusResponseData>;
        }

        // Wrap raw response data
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Leave approval status fetched successfully',
            data: response as unknown as GetApprovalStatusResponseData
        };
    } catch (error: any) {
        console.error('🔴 [SERVER] GetApprovalStatus Error:', error);
        const errorMessage = error?.response?.data?.message ||
            error?.response?.data?.retrunMsg ||
            error?.message ||
            'Failed to fetch leave approval status';
        throw new Error(errorMessage);
    }
}


/**
 * Approve leave application
 * POST /api/AdminOnDutyApply/approve_leave (placeholder - implement when endpoint is available)
 */
export async function approveLeave(hrelapId: number, remarks?: string): Promise<ApiResponse<any>> {
    // TODO: Replace with actual approve endpoint when available
    const url = `/api/AdminOnDutyApply/approve_leave/${hrelapId}`;

    console.log('🟢 [SERVER] POST Request URL:', url);
    try {
        const response = await api.post<any>('hmslms', url, { remarks: remarks || '' });
        console.log('🟢 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Leave approved successfully',
            data: res.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve leave';
        throw new Error(errorMessage);
    }
}

/**
 * Reject leave application
 * POST /api/AdminOnDutyApply/reject_leave (placeholder - implement when endpoint is available)
 */
export async function rejectLeave(hrelapId: number, remarks: string): Promise<ApiResponse<any>> {
    // TODO: Replace with actual reject endpoint when available
    const url = `/api/AdminOnDutyApply/reject_leave/${hrelapId}`;

    console.log('🔴 [SERVER] POST Request URL:', url);
    try {
        const response = await api.post<any>('hmslms', url, { remarks });
        console.log('🔴 [SERVER] Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Leave rejected successfully',
            data: res.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reject leave';
        throw new Error(errorMessage);
    }
}

/**
 * Get leave details by ID
 * GET /api/AdminOnDutyApply/get_leave_details_by_id/{hrelap_id}
 */
export async function getLeaveDetailsById(hrelapId: number): Promise<ApiResponse<any>> {
    const url = `/api/AdminOnDutyApply/get_leave_details_by_id/${hrelapId}`;

    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔵 [SERVER] GET Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        if (isSuccess) {
            return {
                success: true,
                message: res.message || 'Leave details fetched successfully',
                data: res.data || null
            };
        }

        return {
            success: false,
            message: res.message || 'Failed to fetch leave details',
            data: null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch leave details';
        throw new Error(errorMessage);
    }
}

/**
 * View employee on duty details
 * GET /api/AdminOnDutyApply/employee_on_duty_details_by_id/{hrme_id}
 */
export async function getEmployeeOnDutyDetails(hrmeId: number): Promise<ApiResponse<any>> {
    const url = `/api/AdminOnDutyApply/employee_on_duty_details_by_id/${hrmeId}`;

    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        console.log('🔵 [SERVER] GET Response:', JSON.stringify(response, null, 2));

        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        if (isSuccess) {
            return {
                success: true,
                message: res.message || 'Employee details fetched successfully',
                data: res.data || null
            };
        }

        return {
            success: false,
            message: res.message || 'Failed to fetch employee details',
            data: null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch employee details';
        throw new Error(errorMessage);
    }
}

/**
 * Get leave status async (for filtering/searching)
 * POST /api/LeaveApprovalFacade/GetStatusAsync
 */
export async function getStatusAsync(request: GetStatusAsyncRequest): Promise<ApiResponse<GetStatusAsyncResponseData>> {
    const url = '/api/LeaveApprovalFacade/get_status_async';
    const requestBody: GetStatusAsyncRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        retrunMsg: request.retrunMsg || '',
        HRME_Id: request.HRME_Id || 0,
        HRELTD_FromDate: request.HRELTD_FromDate || '',
        HRELTD_ToDate: request.HRELTD_ToDate || '',
        HRELT_Status: request.HRELT_Status || '',
        LoginId: request.LoginId || 0,
        HRELAPA_Remarks: request.HRELAPA_Remarks || '',
        get_leave_status: request.get_leave_status || []
    };

    try {
        const response = await api.post<GetStatusAsyncResponseData>('hmslms', url, requestBody);
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Leave status fetched successfully',
            data: response as unknown as GetStatusAsyncResponseData
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.retrunMsg || error?.message || 'Failed to fetch leave status';
        throw new Error(errorMessage);
    }
}

/**
 * Reject leave status
 * POST /api/LeaveApprovalFacade/RejectStatusAsync
 */
export async function rejectStatusAsync(request: RejectStatusAsyncRequest): Promise<ApiResponse<RejectStatusAsyncResponseData>> {
    const url = '/api/LeaveApprovalFacade/reject_status_async';
    const requestBody: RejectStatusAsyncRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        LoginId: request.LoginId || 0,
        HRELAPA_Remarks: request.HRELAPA_Remarks || '',
        get_leave_status: request.get_leave_status || []
    };

    try {
        const response = await api.post<RejectStatusAsyncResponseData>('hmslms', url, requestBody);
        const responseData = response as any;
        const retrunMsg = responseData?.retrunMsg || responseData?.message || '';
        const isSuccess = responseData?.returnval === true || responseData?.returnval_Update === true || retrunMsg.toLowerCase().includes('success');

        return {
            success: isSuccess,
            message: retrunMsg || (isSuccess ? 'Leave rejected successfully' : 'Failed to reject leave'),
            data: responseData?.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.retrunMsg || error?.message || 'Failed to reject leave';
        throw new Error(errorMessage);
    }
}

/**
 * Get approved leave
 * POST /api/LeaveApprovalFacade/GetApprovedLeave
 */
export async function getApprovedLeave(request: GetApprovedLeaveRequest): Promise<ApiResponse<GetApprovedLeaveResponseData>> {
    const url = '/api/LeaveApprovalFacade/get_approved_leave';
    const requestBody: GetApprovedLeaveRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        LoginId: request.LoginId || 0
    };

    try {
        const response = await api.post<GetApprovedLeaveResponseData>('hmslms', url, requestBody);
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Approved leave fetched successfully',
            data: response as unknown as GetApprovedLeaveResponseData
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.retrunMsg || error?.message || 'Failed to fetch approved leave';
        throw new Error(errorMessage);
    }
}

/**
 * View leave balance history
 * POST /api/LeaveApprovalFacade/ViewLeaveBalanceHistory
 */
export async function viewLeaveBalanceHistory(request: ViewLeaveBalanceHistoryRequest): Promise<ApiResponse<ViewLeaveBalanceHistoryResponseData>> {
    const url = '/api/LeaveApprovalFacade/view_leave_balance_history';
    const requestBody: ViewLeaveBalanceHistoryRequest = {
        HRME_Id: request.HRME_Id || 0
    };

    try {
        const response = await api.post<ViewLeaveBalanceHistoryResponseData>('hmslms', url, requestBody);
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Leave balance history fetched successfully',
            data: response as unknown as ViewLeaveBalanceHistoryResponseData
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.retrunMsg || error?.message || 'Failed to fetch leave balance history';
        throw new Error(errorMessage);
    }
}

/**
 * Get request status
 * POST /api/LeaveApprovalFacade/GetRequestStatus
 */
export async function getRequestStatus(request: GetRequestStatusRequest): Promise<ApiResponse<GetRequestStatusResponseData>> {
    const url = '/api/LeaveApprovalFacade/get_request_status';
    const requestBody: GetRequestStatusRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        LoginId: request.LoginId || 0
    };

    try {
        const response = await api.post<GetRequestStatusResponseData>('hmslms', url, requestBody);
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Request status fetched successfully',
            data: response as unknown as GetRequestStatusResponseData
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.retrunMsg || error?.message || 'Failed to fetch request status';
        throw new Error(errorMessage);
    }
}

/**
 * Get approve status async
 * POST /api/LeaveApprovalFacade/GetApproveStatusAsync
 */
export async function getApproveStatusAsync(request: GetApproveStatusAsyncRequest): Promise<ApiResponse<GetApproveStatusAsyncResponseData>> {
    const url = '/api/LeaveApprovalFacade/get_approve_status_async';
    const requestBody: GetApproveStatusAsyncRequest = {
        LoginId: request.LoginId || 0,
        MI_Id: request.MI_Id || HRMS_MI_ID,
        doc_list2: request.doc_list2 || []
    };

    try {
        const response = await api.post<GetApproveStatusAsyncResponseData>('hmslms', url, requestBody);
        const responseData = response as any;
        const retrunMsg = responseData?.retrunMsg || responseData?.message || '';
        const isSuccess = responseData?.returnval === true || responseData?.returnval_Update === true || retrunMsg.toLowerCase().includes('success');

        return {
            success: isSuccess,
            message: retrunMsg || (isSuccess ? 'Leave approved successfully' : 'Failed to approve leave'),
            data: response as unknown as GetApproveStatusAsyncResponseData
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.retrunMsg || error?.message || 'Failed to approve leave';
        throw new Error(errorMessage);
    }
}

/**
 * Get period approval status
 * POST /api/LeaveApprovalFacade/GetPeriodApprovalStatus
 */
export async function getPeriodApprovalStatus(request: GetPeriodApprovalStatusRequest): Promise<ApiResponse<GetPeriodApprovalStatusResponseData>> {
    const url = '/api/LeaveApprovalFacade/get_period_approval_status';
    const requestBody: GetPeriodApprovalStatusRequest = {
        MI_Id: request.MI_Id || HRMS_MI_ID,
        LoginId: request.LoginId || 0
    };

    try {
        const response = await api.post<GetPeriodApprovalStatusResponseData>('hmslms', url, requestBody);
        const responseData = response as any;
        return {
            success: responseData?.success ?? true,
            message: responseData?.message || responseData?.retrunMsg || 'Period approval status fetched successfully',
            data: response as unknown as GetPeriodApprovalStatusResponseData
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.retrunMsg || error?.message || 'Failed to fetch period approval status';
        throw new Error(errorMessage);
    }
}

/**
 * Process period leave status
 * POST /api/LeaveApprovalFacade/PeriodLeaveStatus
 */
export async function periodLeaveStatus(request: PeriodLeaveStatusRequest): Promise<ApiResponse<PeriodLeaveStatusResponseData>> {
    const url = '/api/LeaveApprovalFacade/period_leave_status';
    const requestBody: PeriodLeaveStatusRequest = {
        HRELAPDD_ApprovalFlg: request.HRELAPDD_ApprovalFlg || '',
        HRELAPDD_Remarks: request.HRELAPDD_Remarks || '',
        LoginId: request.LoginId || 0,
        get_leave_status: request.get_leave_status || []
    };

    try {
        const response = await api.post<PeriodLeaveStatusResponseData>('hmslms', url, requestBody);
        const responseData = response as any;
        const retrunMsg = responseData?.retrunMsg || responseData?.message || '';
        const isSuccess = responseData?.returnval === true || responseData?.returnval_Update === true || retrunMsg.toLowerCase().includes('success');

        return {
            success: isSuccess,
            message: retrunMsg || (isSuccess ? 'Period leave status processed successfully' : 'Failed to process period leave status'),
            data: responseData?.data || null
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.retrunMsg || error?.message || 'Failed to process period leave status';
        throw new Error(errorMessage);
    }
}

/**
 * Get leave applied or approval grid
 * GET /api/LeaveApproval/get_leave_applied_or_approval_grid
 */
export async function getLeaveAppliedOrApprovalGrid(): Promise<ApiResponse<LeaveApprovalGridItem[]>> {
    const url = '/api/LeaveApproval/get_leave_applied_or_approval_grid';
    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Leave applied or approval grid details fetched successfully.',
            data: res.data || []
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch leave approval grid');
    }
}

/**
 * Approve or reject leave status
 * POST /api/LeaveApproval/approve_or_reject_leave_status
 */
export async function approveOrRejectLeaveStatus(data: ApproveRejectLeaveStatusRequest): Promise<ApiResponse<any>> {
    const url = '/api/LeaveApproval/approve_or_reject_leave_status';
    console.log('🟠 [SERVER] POST Request URL:', url);
    try {
        const response = await api.post<any>('hmslms', url, data);
        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Leave Approved successfully.',
            data: res.data || null
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to process leave status');
    }
}

/**
 * View leave balance history by employee ID
 * GET /api/LeaveApproval/view_leave_balance_history/{hrme_id}
 */
export async function viewLeaveBalanceHistoryByEmpId(hrmeId: number): Promise<ApiResponse<LeaveBalanceHistoryItem[]>> {
    const url = `/api/LeaveApproval/view_leave_balance_history/${hrmeId}`;
    console.log('🔵 [SERVER] GET Request URL:', url);
    try {
        const response = await api.get<any>('hmslms', url);
        const res = response as any;
        const isSuccess = res.success === true || String(res.success) === 'true';

        return {
            success: isSuccess,
            message: res.message || 'Leave balance history fetched successfully.',
            data: res.data || []
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch leave balance history');
    }
}
