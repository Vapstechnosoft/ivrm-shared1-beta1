'use client';
import type { ApplyLeave, LeaveHistoryRow } from '@/app/(root)/hrms/leave-management/apply-leave/_components/columns';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import { getOnlineLeave, saveOnlineLeave } from '@/server/hrms/leave-management/apply-leave';
import type { FrmToDatesItem, SaveOnlineLeaveRequest } from '@/types/hrms/leave-management/apply-leave';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
/**
 * Map API response to LeaveHistoryRow format
 */
function mapApiDataToLeaveHistory(apiData: any): LeaveHistoryRow | null {
    if (!apiData) {
        return null;
    }
    return {
        id: apiData.HRELAP_Id || apiData.id || 0,
        leaveType: apiData.HRML_LeaveName || apiData.leaveType || apiData.LeaveType || '',
        fromDate: apiData.HRELAP_FromDate || apiData.fromDate || apiData.FromDate || '',
        toDate: apiData.HRELAP_ToDate || apiData.toDate || apiData.ToDate || '',
        noOfDays: apiData.HRELAP_TotalDays || apiData.days || apiData.noOfDays || 0,
        days: apiData.HRELAP_TotalDays || apiData.days || apiData.noOfDays || 0,
        status: apiData.HRELAP_ApplicationStatus || apiData.status || apiData.Status || 'Applied',
        remark: apiData.HRELAP_LeaveReason || apiData.reason || apiData.remark || '',
        document: apiData.HRELAP_SupportingDocument || apiData.document || ''
    };
}
/**
 * Map frontend ApplyLeave format to API request format
 */
function mapApplyLeaveToApiData(data: ApplyLeave, HRME_Id = 0): SaveOnlineLeaveRequest {
    // Create the frmToDates array with the leave application data
    const frmToDatesItem: FrmToDatesItem = {
        HRELAP_Id: 0, // New application
        HRELAP_ApplicationDate: new Date().toISOString(),
        HRELAP_FromDate: data.fromDate || '',
        HRELAP_ToDate: data.toDate || '',
        HRELAP_TotalDays: data.numDays || 0,
        HRELAP_LeaveReason: data.reason || '',
        HRELAP_ContactNoOnLeave: data.contactNumber ? Number.parseInt(data.contactNumber) : 0,
        HRELAP_ReportingDate: data.dateReportingBack || '',
        HRELAP_ApplicationStatus: 'Applied',
        HRELAP_SupportingDocument: data.file?.[0]?.name || '',
        HRME_Id: HRME_Id,
        HRML_Id: 0, // Will be set based on leaveType selection
        MI_Id: HRMS_MI_ID,
        UserId: 0, // Will be set from session
        approvaluser_array: []
    };
    return {
        MI_Id: HRMS_MI_ID,
        UserId: 0, // Will be set from session
        HRME_Id: HRME_Id,
        frmToDates: [frmToDatesItem],
        temp_table_data: [],
        HRELT_LeaveReason: data.reason || '',
        HRELT_SupportingDocument: data.file?.[0]?.name || ''
    };
}
/**
 * Hook to fetch online leave applications/history
 */
export function useLeaveHistory(request?: { MI_Id?: number; UserId?: number }) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.APPLY_LEAVE, request?.MI_Id, request?.UserId],
            queryFn: async () => {
                try {
                    const response = await getOnlineLeave({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        UserId: request?.UserId || 0
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave history');
                    }
                    // Extract leave history from response
                    // The API might return list in online_leave, GridviewDetails, or other fields
                    let leaveHistory: LeaveHistoryRow[] = [];
                    const data = response.data;
                    // Check different possible locations for the leave list
                    if (data.online_leave && Array.isArray(data.online_leave)) {
                        leaveHistory = data.online_leave
                            .map((item: any) => mapApiDataToLeaveHistory(item))
                            .filter((item: LeaveHistoryRow | null): item is LeaveHistoryRow => item !== null);
                    } else if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        leaveHistory = data.GridviewDetails.map((item: any) => mapApiDataToLeaveHistory(item)).filter(
                            (item: LeaveHistoryRow | null): item is LeaveHistoryRow => item !== null
                        );
                    } else if (data.get_leave_status && Array.isArray(data.get_leave_status)) {
                        leaveHistory = data.get_leave_status
                            .map((item: any) => mapApiDataToLeaveHistory(item))
                            .filter((item: LeaveHistoryRow | null): item is LeaveHistoryRow => item !== null);
                    } else if (Array.isArray(data)) {
                        leaveHistory = data
                            .map((item: any) => mapApiDataToLeaveHistory(item))
                            .filter((item: LeaveHistoryRow | null): item is LeaveHistoryRow => item !== null);
                    }
                    return {
                        success: true,
                        data: leaveHistory,
                        total: leaveHistory.length,
                        page: 1,
                        page_Size: leaveHistory.length,
                        message: response.message || 'Leave history fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave history');
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.APPLY_LEAVE]
            });
        }
    };
}
/**
 * Hook to apply for leave
 */
export function useApplyLeave() {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean; message: string }, Error, { data: ApplyLeave; HRME_Id?: number }>({
        mutationFn: async ({ data, HRME_Id = 0 }) => {
            try {
                // Map frontend data to API format
                const apiRequest = mapApplyLeaveToApiData(data, HRME_Id);
                const response = await saveOnlineLeave(apiRequest);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to apply leave');
                }
                return {
                    success: true,
                    message: response.message || 'Leave applied successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to apply leave');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.APPLY_LEAVE]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to apply leave');
        }
    });
}
