import {
    deleteEmployeeLeaveById,
    getEmployeeLeaveDetails,
    getEmployeeLeaveStatusDetails,
    saveOnlineLeaveApplication,
    saveLeaveRequestDocument
} from '@/server/hrms/leave-management/transaction/online-leave-application';
import type {
    EmployeeDetail,
    EmployeeLeaveDetail,
    EmployeeLeaveStatusDetail,
    LeaveApplication,
    LeaveBalance,
    LeaveCount,
    SaveOnlineLeaveApplicationRequest
} from '@/types/hrms/leave-management/online-leave-application';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ONLINE_LEAVE_APPLICATION_KEYS = {
    LEAVE_DETAILS: 'online-leave-application-details',
    STATUS_DETAILS: 'online-leave-application-status'
};

/**
 * Map API employee leave detail to frontend model
 */
function mapToLeaveBalance(apiData: EmployeeLeaveDetail): LeaveBalance {
    return {
        id: apiData.hrelS_Id,
        leaveName: apiData.hrmL_LeaveName,
        leaveCode: apiData.hrmL_LeaveCode,
        totalLeaves: apiData.hrelS_TotalLeaves,
        creditedLeaves: apiData.hrelS_CreditedLeaves,
        transLeaves: apiData.hrelS_TransLeaves,
        balance: apiData.hrelS_CBLeaves,
        leaveId: apiData.hrmL_Id,
        employeeId: apiData.hrmE_Id
    };
}

/**
 * Map API employee leave status detail to frontend model
 */
function mapToLeaveApplication(apiData: EmployeeLeaveStatusDetail): LeaveApplication {
    return {
        id: apiData.hrelaP_Id,
        leaveName: apiData.hrmL_LeaveName,
        leaveReason: apiData.hrelaP_LeaveReason,
        fromDate: new Date(apiData.hrelaP_FromDate),
        toDate: new Date(apiData.hrelaP_ToDate),
        totalDays: apiData.hreltD_TotDays,
        status: apiData.hrelaP_ApplicationStatus,
        remarks: apiData.hrelapA_Remarks,
        document: apiData.hrelaP_SupportingDocument
    };
}

/**
 * Hook to get employee leave details
 */
export function useEmployeeLeaveDetails() {
    return useQuery({
        queryKey: [ONLINE_LEAVE_APPLICATION_KEYS.LEAVE_DETAILS],
        queryFn: async () => {
            const response = await getEmployeeLeaveDetails();
            if (!response.success) {
                throw new Error(response.message);
            }
            const data = response.data;
            if (!data) return null;

            return {
                leaveBalances: (data.employeeLeaveDetails || []).map(mapToLeaveBalance),
                employeeDetails: data.employeeDetails?.[0] || null,
                leaveCount: data.leaveCount || []
            };
        }
    });
}

/**
 * Hook to get employee leave status details
 */
export function useEmployeeLeaveStatusDetails() {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ONLINE_LEAVE_APPLICATION_KEYS.STATUS_DETAILS],
            queryFn: async () => {
                const response = await getEmployeeLeaveStatusDetails();
                if (!response.success) {
                    throw new Error(response.message);
                }
                const data = response.data;
                if (!data) return null;

                return {
                    leaveApplications: (data.employeeLeaveDetails || []).map(mapToLeaveApplication),
                    gridDetails: data.leaveApplicationGridDetails || []
                };
            }
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [ONLINE_LEAVE_APPLICATION_KEYS.STATUS_DETAILS]
            })
    };
}

/**
 * Hook to save online leave application
 */
export function useSaveOnlineLeaveApplication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SaveOnlineLeaveApplicationRequest) => {
            const response = await saveOnlineLeaveApplication(data);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [ONLINE_LEAVE_APPLICATION_KEYS.LEAVE_DETAILS] });
            queryClient.invalidateQueries({ queryKey: [ONLINE_LEAVE_APPLICATION_KEYS.STATUS_DETAILS] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });
}

/**
 * Hook to delete employee leave by ID
 */
export function useDeleteEmployeeLeaveById() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (leaveId: number) => {
            const response = await deleteEmployeeLeaveById(leaveId);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [ONLINE_LEAVE_APPLICATION_KEYS.STATUS_DETAILS] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });
}

/**
 * Hook to save leave request document
 */
export function useSaveLeaveRequestDocument() {
    return useMutation({
        mutationFn: async ({ hrmeId, formData }: { hrmeId: number; formData: FormData }) => {
            const response = await saveLeaveRequestDocument(hrmeId, formData);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response;
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });
}
