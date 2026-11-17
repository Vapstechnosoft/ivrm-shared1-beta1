import {
    deleteLeaveById,
    getEmployeeOnDutyDetails,
    getEmployeeOnDutyLeaveApply,
    getLeaveDetailsById,
    saveOnDutyLeaveRequest,
    viewOnDutyLeaveDetailsById,
    toggleActiveStatusOnDuty
} from '@/server/hrms/leave-management/transaction/admin-on-duty-apply';
import type { ApiSearchparams } from '@/types';
import type {
    AdminOnDutyApply,
    AdminOnDutyApplyApiData,
    EmployeeDetails,
    EmployeeOnDutyDetailsResponse,
    OnDutyLeaveSaveRequest
} from '@/types/hrms/leave-management/admin-on-duty-apply';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ADMIN_ON_DUTY_APPLY_KEYS = {
    LIST: 'admin-on-duty-apply-list',
    EMPLOYEE_DETAILS: 'admin-on-duty-employee-details',
    LEAVE_DETAILS: 'admin-on-duty-leave-details',
    VIEW_DETAILS: 'admin-on-duty-view-details'
};

function mapApiDataToAdminOnDutyApply(
    apiData: any // Use any to allow case-insensitive access
): AdminOnDutyApply {
    // Helper to get property regardless of casing
    const getProp = (obj: any, key: string) => {
        if (!obj) return undefined;
        if (key in obj) return obj[key];
        const lowerKey = key.toLowerCase();
        for (const k in obj) {
            if (k.toLowerCase() === lowerKey) return obj[k];
        }
        return undefined;
    };

    return {
        id: getProp(apiData, 'hrelaP_Id') || getProp(apiData, 'id'),
        employeeName: getProp(apiData, 'hrmE_EmployeeFirstName') || getProp(apiData, 'employeeName'),
        leaveName: getProp(apiData, 'hrmL_LeaveName') || getProp(apiData, 'leaveName'),
        leaveCode: getProp(apiData, 'hrmL_LeaveCode') || getProp(apiData, 'leaveCode'),
        fromDate: new Date(getProp(apiData, 'hrelaP_FromDate') || getProp(apiData, 'fromDate')),
        toDate: new Date(getProp(apiData, 'hrelaP_ToDate') || getProp(apiData, 'toDate')),
        totalDays: getProp(apiData, 'hreltD_TotDays') || getProp(apiData, 'totalDays') || 0,
        status: getProp(apiData, 'hrelaP_ApplicationStatus') || getProp(apiData, 'status') || 'Unknown',
        leaveReason: getProp(apiData, 'hrelaP_LeaveReason') || getProp(apiData, 'leaveReason') || '',
        inTime: getProp(apiData, 'hrelapD_InTime') || getProp(apiData, 'inTime') || '',
        outTime: getProp(apiData, 'hrelapD_OutTime') || getProp(apiData, 'outTime') || '',
        leaveId: getProp(apiData, 'hrmL_Id') || getProp(apiData, 'leaveId'),
        employeeId: getProp(apiData, 'hrmE_Id') || getProp(apiData, 'employeeId'),
        isActive: getProp(apiData, 'hrelaP_ActiveFlg') ?? true
    };
}

function mapApiEmployeeToEmployeeDetails(
    apiData: EmployeeOnDutyDetailsResponse['employeeDetails']
): EmployeeDetails {
    return {
        id: apiData.hrmE_Id,
        name: apiData.employeeName,
        designation: apiData.hrmdeS_DesignationName,
        doj: new Date(apiData.hrmE_DOJ),
        photo: apiData.hrmE_Photo,
        email: apiData.emailId || apiData.hrmeM_EmailId,
        mobile: String(apiData.mobileNo || apiData.hrmemnO_MobileNo),
        loginTime: apiData.foesT_IHalfLoginTime,
        logoutTime: apiData.foesT_IIHalfLogoutTime
    };
}

export interface AdminOnDutyApplyListParams {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    searchColumn?: string;
    sortColumn?: string;
    sortDirection?: string;
    isExport?: boolean;
}

export function useAdminOnDutyApplyList(params: AdminOnDutyApplyListParams | ApiSearchparams = {}) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMIN_ON_DUTY_APPLY_KEYS.LIST, params],
            queryFn: async () => {
                const response = await getEmployeeOnDutyLeaveApply({
                    page: (params as any).page,
                    page_size: (params as any).pageSize ?? (params as any).page_size,
                    search_query: (params as any).searchQuery ?? (params as any).search_query,
                    search_column: (params as any).searchColumn ?? (params as any).search_column,
                    sort_column: (params as any).sortColumn ?? (params as any).sort_column,
                    sort_direction: (params as any).sortDirection ?? (params as any).sort_direction
                });
                if (!response.success) {
                    throw new Error(response.message);
                }
                const data = (response.data || []).map(mapApiDataToAdminOnDutyApply);
                return {
                    success: true,
                    data,
                    message: response.message,
                    total: response.total || data.length,
                    page: response.page || 1,
                    page_size: response.page_size || 10
                };
            },
            placeholderData: (previousData) => previousData
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [ADMIN_ON_DUTY_APPLY_KEYS.LIST]
            })
    };
}

export function useEmployeeOnDutyDetails(employeeId: number | null) {
    return useQuery({
        queryKey: [ADMIN_ON_DUTY_APPLY_KEYS.EMPLOYEE_DETAILS, employeeId],
        queryFn: async () => {
            if (!employeeId) return null;
            const response = await getEmployeeOnDutyDetails(employeeId);
            if (!response.success) {
                throw new Error(response.message);
            }
            const data = response.data;
            if (!data) return null;

            return {
                leaveDetails: (data.leaveDetails || []).map(mapApiDataToAdminOnDutyApply),
                employeeDetails: mapApiEmployeeToEmployeeDetails(data.employeeDetails)
            };
        },
        enabled: !!employeeId
    });
}

export function useSaveOnDutyLeaveRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: OnDutyLeaveSaveRequest) => {
            const response = await saveOnDutyLeaveRequest(data);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [ADMIN_ON_DUTY_APPLY_KEYS.LIST] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });
}

export function useLeaveDetailsById(leaveId: number | null) {
    return useQuery({
        queryKey: [ADMIN_ON_DUTY_APPLY_KEYS.LEAVE_DETAILS, leaveId],
        queryFn: async () => {
            if (!leaveId) return null;
            const response = await getLeaveDetailsById(leaveId);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data;
        },
        enabled: !!leaveId
    });
}

export function useDeleteLeaveById() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (leaveId: number) => {
            const response = await deleteLeaveById(leaveId);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [ADMIN_ON_DUTY_APPLY_KEYS.LIST] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });
}

export function useViewOnDutyLeaveDetailsById(leaveId: number | null) {
    return useQuery({
        queryKey: [ADMIN_ON_DUTY_APPLY_KEYS.VIEW_DETAILS, leaveId],
        queryFn: async () => {
            if (!leaveId) return null;
            const response = await viewOnDutyLeaveDetailsById(leaveId);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data;
        },
        enabled: !!leaveId
    });
}
export function useToggleOnDutyStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (leaveId: number) => {
            const response = await toggleActiveStatusOnDuty(leaveId);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [ADMIN_ON_DUTY_APPLY_KEYS.LIST] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });
}
