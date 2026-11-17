'use client';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import {
    getApprovalStatus,
    getStatusAsync,
    rejectStatusAsync,
    getApprovedLeave,
    viewLeaveBalanceHistory,
    getRequestStatus,
    getApproveStatusAsync,
    getPeriodApprovalStatus,
    periodLeaveStatus,
    getLeaveAppliedOrApprovalGrid,
    approveOrRejectLeaveStatus,
    viewLeaveBalanceHistoryByEmpId
} from '@/server/hrms/leave-management/leave-approval';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { LeaveApprovalRow } from '@/app/(root)/hrms/leave-management/leave-approval/_components/columns';
/**
 * Map API response data to LeaveApprovalRow format
 */
function mapApiDataToLeaveApproval(apiData: any): LeaveApprovalRow | null {
    if (!apiData) {
        return null;
    }
    return {
        id: apiData.HRELAP_Id || apiData.hrelaP_Id || apiData.id || 0,
        hrmE_Id: apiData.HRME_Id || apiData.hrmE_Id || 0,
        hrelaP_Id: apiData.HRELAP_Id || apiData.hrelaP_Id || 0,
        employeeCode: apiData.HRME_EmployeeCode || apiData.hrmE_EmployeeCode || '',
        employeeName: apiData.HRME_EmployeeFirstName ||
            apiData.hrmE_FullName ||
            `${apiData.HRME_EmployeeFirstName || ''} ${apiData.HRME_EmployeeLastName || ''}`.trim() || '',
        leaveName: apiData.HRML_LeaveName || apiData.hrmL_LeaveName || '',
        fromDate: apiData.HRELAP_FromDate || apiData.hrelaP_FromDate || apiData.hreltD_FromDate || '',
        toDate: apiData.HRELAP_ToDate || apiData.hrelaP_ToDate || apiData.hreltD_ToDate || '',
        totalDays: apiData.HRELAP_TotalDays || apiData.hrelapD_TotalDays || apiData.hreltD_TotDays || 0,
        leaveStatus: (apiData.HRELAP_ApplicationStatus || apiData.hrelT_Status || 'Applied') as 'Applied' | 'Approved' | 'Rejected' | 'Pending',
        remark: apiData.HRELAP_LeaveReason || apiData.hrelapA_Remarks || ''
    };
}
/**
 * Hook to fetch leave approval status
 */
export function useLeaveApprovalStatus(request?: { MI_Id?: number }) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, request?.MI_Id],
            queryFn: async () => {
                try {
                    const response = await getApprovalStatus({
                        MI_Id: request?.MI_Id || HRMS_MI_ID
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave approval status');
                    }
                    // Extract leave approval list from response
                    // The API might return list in GridviewDetails, approvalList, or other fields
                    let approvalList: LeaveApprovalRow[] = [];
                    const data = response.data;
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        approvalList = data.GridviewDetails
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.approvalList && Array.isArray(data.approvalList)) {
                        approvalList = data.approvalList
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.leaveApprovalList && Array.isArray(data.leaveApprovalList)) {
                        approvalList = data.leaveApprovalList
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.pendingLeaves && Array.isArray(data.pendingLeaves)) {
                        approvalList = data.pendingLeaves
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (Array.isArray(data)) {
                        approvalList = data
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    }
                    return {
                        success: true,
                        data: approvalList,
                        message: response.message || 'Leave approval status fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave approval status');
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL]
            });
        }
    };
}
/**
 * Hook to fetch leave status async (for filtering/searching)
 * This can be used to filter leave approvals by various criteria
 */
export function useLeaveStatusAsync(request?: {
    MI_Id?: number;
    retrunMsg?: string;
    HRME_Id?: number;
    HRELTD_FromDate?: string;
    HRELTD_ToDate?: string;
    HRELT_Status?: string;
    LoginId?: number;
    HRELAPA_Remarks?: string;
    get_leave_status?: any[];
}, enabled: boolean = true) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'statusAsync', request?.MI_Id, request?.HRME_Id, request?.HRELT_Status],
            queryFn: async () => {
                try {
                    const response = await getStatusAsync({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        retrunMsg: request?.retrunMsg || '',
                        HRME_Id: request?.HRME_Id || 0,
                        HRELTD_FromDate: request?.HRELTD_FromDate || '',
                        HRELTD_ToDate: request?.HRELTD_ToDate || '',
                        HRELT_Status: request?.HRELT_Status || '',
                        LoginId: request?.LoginId || 0,
                        HRELAPA_Remarks: request?.HRELAPA_Remarks || '',
                        get_leave_status: request?.get_leave_status || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave status');
                    }
                    // Extract leave approval list from response
                    const data = response.data;
                    let approvalList: LeaveApprovalRow[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        approvalList = data.GridviewDetails
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.approvalList && Array.isArray(data.approvalList)) {
                        approvalList = data.approvalList
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.leaveApprovalList && Array.isArray(data.leaveApprovalList)) {
                        approvalList = data.leaveApprovalList
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.get_leave_status && Array.isArray(data.get_leave_status)) {
                        approvalList = data.get_leave_status
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.get_leavestatus && Array.isArray(data.get_leavestatus)) {
                        approvalList = data.get_leavestatus
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (Array.isArray(data)) {
                        approvalList = data
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    }
                    return {
                        success: true,
                        data: approvalList,
                        rawData: data,
                        message: response.message || 'Leave status fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave status');
                }
            },
            enabled: enabled,
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'statusAsync']
            });
        }
    };
}
/**
 * Hook to reject leave status
 */
export function useRejectLeaveStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {
            MI_Id?: number;
            LoginId: number;
            HRELAPA_Remarks: string;
            get_leave_status: any[];
        }) => {
            try {
                const response = await rejectStatusAsync({
                    MI_Id: data.MI_Id || HRMS_MI_ID,
                    LoginId: data.LoginId || 0,
                    HRELAPA_Remarks: data.HRELAPA_Remarks || '',
                    get_leave_status: data.get_leave_status || []
                });
                if (!response.success) {
                    throw new Error(response.message || 'Failed to reject leave');
                }
                return {
                    success: true,
                    message: response.message || 'Leave rejected successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to reject leave');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to reject leave');
        }
    });
}
/**
 * Hook to fetch approved leave
 */
export function useApprovedLeave(request?: { MI_Id?: number; LoginId?: number }) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'approved', request?.MI_Id, request?.LoginId],
            queryFn: async () => {
                try {
                    const response = await getApprovedLeave({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        LoginId: request?.LoginId || 0
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch approved leave');
                    }
                    // Extract approved leave list from response
                    const data = response.data;
                    let approvedList: LeaveApprovalRow[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        approvedList = data.GridviewDetails
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.approvedLeaves && Array.isArray(data.approvedLeaves)) {
                        approvedList = data.approvedLeaves
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.leaveApprovalList && Array.isArray(data.leaveApprovalList)) {
                        approvedList = data.leaveApprovalList
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (data.approvedLeaveList && Array.isArray(data.approvedLeaveList)) {
                        approvedList = data.approvedLeaveList
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    } else if (Array.isArray(data)) {
                        approvedList = data
                            .map((item: any) => mapApiDataToLeaveApproval(item))
                            .filter((item: LeaveApprovalRow | null): item is LeaveApprovalRow => item !== null);
                    }
                    return {
                        success: true,
                        data: approvedList,
                        rawData: data,
                        message: response.message || 'Approved leave fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch approved leave');
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'approved']
            });
        }
    };
}
/**
 * Hook to fetch leave balance history
 */
export function useLeaveBalanceHistory(HRME_Id: number, enabled: boolean = true) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'balanceHistory', HRME_Id],
            queryFn: async () => {
                try {
                    const response = await viewLeaveBalanceHistory({
                        HRME_Id: HRME_Id || 0
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave balance history');
                    }
                    // Extract leave balance history list from response
                    const data = response.data;
                    let historyList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        historyList = data.GridviewDetails;
                    } else if (data.leaveBalanceHistory && Array.isArray(data.leaveBalanceHistory)) {
                        historyList = data.leaveBalanceHistory;
                    } else if (data.balanceHistory && Array.isArray(data.balanceHistory)) {
                        historyList = data.balanceHistory;
                    } else if (data.leaveHistory && Array.isArray(data.leaveHistory)) {
                        historyList = data.leaveHistory;
                    } else if (data.historyList && Array.isArray(data.historyList)) {
                        historyList = data.historyList;
                    } else if (Array.isArray(data)) {
                        historyList = data;
                    }
                    return {
                        success: true,
                        data: historyList,
                        rawData: data,
                        message: response.message || 'Leave balance history fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave balance history');
                }
            },
            enabled: enabled && HRME_Id > 0, // Only fetch if HRME_Id is provided and greater than 0
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'balanceHistory']
            });
        }
    };
}
/**
 * Hook to fetch request status
 */
export function useRequestStatus(request?: { MI_Id?: number; LoginId?: number }) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'requestStatus', request?.MI_Id, request?.LoginId],
            queryFn: async () => {
                try {
                    const response = await getRequestStatus({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        LoginId: request?.LoginId || 0
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch request status');
                    }
                    // Extract request status list from response
                    const data = response.data;
                    let statusList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        statusList = data.GridviewDetails;
                    } else if (data.requestStatusList && Array.isArray(data.requestStatusList)) {
                        statusList = data.requestStatusList;
                    } else if (data.statusList && Array.isArray(data.statusList)) {
                        statusList = data.statusList;
                    } else if (data.leaveRequestStatus && Array.isArray(data.leaveRequestStatus)) {
                        statusList = data.leaveRequestStatus;
                    } else if (Array.isArray(data)) {
                        statusList = data;
                    }
                    return {
                        success: true,
                        data: statusList,
                        rawData: data,
                        message: response.message || 'Request status fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch request status');
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'requestStatus']
            });
        }
    };
}
/**
 * Hook to fetch approve status async
 */
export function useApproveStatusAsync(request?: {
    LoginId?: number;
    MI_Id?: number;
    doc_list2?: Array<{
        HRELAPA_Remarks: string;
        HRELAPD_InTime: string;
        HRELAPD_OutTime: string;
        Status: string;
        HRELAP_Id: number;
        HRME_Id: number;
    }>;
}, enabled: boolean = true) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'approveStatusAsync', request?.MI_Id, request?.LoginId, request?.doc_list2],
            queryFn: async () => {
                try {
                    const response = await getApproveStatusAsync({
                        LoginId: request?.LoginId || 0,
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        doc_list2: request?.doc_list2 || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch approve status');
                    }
                    // Extract approve status list from response
                    const data = response.data;
                    let statusList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        statusList = data.GridviewDetails;
                    } else if (data.approveStatusList && Array.isArray(data.approveStatusList)) {
                        statusList = data.approveStatusList;
                    } else if (data.statusList && Array.isArray(data.statusList)) {
                        statusList = data.statusList;
                    } else if (data.approvalStatus && Array.isArray(data.approvalStatus)) {
                        statusList = data.approvalStatus;
                    } else if (data.doc_list2 && Array.isArray(data.doc_list2)) {
                        statusList = data.doc_list2;
                    } else if (Array.isArray(data)) {
                        statusList = data;
                    }
                    return {
                        success: true,
                        data: statusList,
                        rawData: data,
                        message: response.message || 'Approve status fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch approve status');
                }
            },
            enabled: enabled,
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'approveStatusAsync']
            });
        }
    };
}
/**
 * Hook to fetch period approval status
 */
export function usePeriodApprovalStatus(request?: { MI_Id?: number; LoginId?: number }) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'periodApprovalStatus', request?.MI_Id, request?.LoginId],
            queryFn: async () => {
                try {
                    const response = await getPeriodApprovalStatus({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        LoginId: request?.LoginId || 0
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch period approval status');
                    }
                    // Extract period approval status list from response
                    const data = response.data;
                    let statusList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        statusList = data.GridviewDetails;
                    } else if (data.periodApprovalStatus && Array.isArray(data.periodApprovalStatus)) {
                        statusList = data.periodApprovalStatus;
                    } else if (data.approvalStatusList && Array.isArray(data.approvalStatusList)) {
                        statusList = data.approvalStatusList;
                    } else if (data.periodStatusList && Array.isArray(data.periodStatusList)) {
                        statusList = data.periodStatusList;
                    } else if (Array.isArray(data)) {
                        statusList = data;
                    }
                    return {
                        success: true,
                        data: statusList,
                        rawData: data,
                        message: response.message || 'Period approval status fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch period approval status');
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'periodApprovalStatus']
            });
        }
    };
}
/**
 * Hook to process period leave status
 */
export function usePeriodLeaveStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {
            HRELAPDD_ApprovalFlg: string;
            HRELAPDD_Remarks: string;
            LoginId: number;
            get_leave_status: any[];
        }) => {
            try {
                const response = await periodLeaveStatus({
                    HRELAPDD_ApprovalFlg: data.HRELAPDD_ApprovalFlg || '',
                    HRELAPDD_Remarks: data.HRELAPDD_Remarks || '',
                    LoginId: data.LoginId || 0,
                    get_leave_status: data.get_leave_status || []
                });
                if (!response.success) {
                    throw new Error(response.message || 'Failed to process period leave status');
                }
                return {
                    success: true,
                    message: response.message || 'Period leave status processed successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to process period leave status');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to process period leave status');
        }
    });
}

/**
 * Hook to fetch leave applied or approval grid
 */
export function useLeaveAppliedOrApprovalGrid() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'grid'],
            queryFn: async () => {
                const response = await getLeaveAppliedOrApprovalGrid();
                if (!response.success) {
                    throw new Error(response.message);
                }
                return response;
            },
            staleTime: 0
        }),
        refetchAll: () => queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL] })
    };
}

/**
 * Hook to approve or reject leave status
 */
export function useApproveOrRejectLeaveStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await approveOrRejectLeaveStatus(data);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });
}

/**
 * Hook to view leave balance history by employee ID
 */
export function useViewLeaveBalanceHistory(hrmeId: number | null) {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.LEAVE_APPROVAL, 'balance-history', hrmeId],
        queryFn: async () => {
            if (!hrmeId) return null;
            const response = await viewLeaveBalanceHistoryByEmpId(hrmeId);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response;
        },
        enabled: !!hrmeId,
        staleTime: 0
    });
}
