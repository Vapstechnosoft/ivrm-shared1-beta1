import {
    deleteLeaveTransactionManual,
    getEmployeeLeaveDetails,
    getLeaveTransactionManualList,
    saveLeaveTransactionManual,
    toggleLeaveTransactionManual
} from '@/server/hrms/leave-management/transaction/leave-transaction-manual';
import type { ApiSearchparams } from '@/types';
import type {
    LeaveTransactionManual,
    LeaveTransactionManualApiData,
    LeaveTransactionManualDeleteRequest,
    LeaveTransactionManualSaveRequest
} from '@/types/hrms/leave-management/leave-transaction-manual';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Query keys
const LEAVE_TRANSACTION_MANUAL_KEYS = {
    LIST: 'leave-transaction-manual-list',
    EMPLOYEE_DETAILS: 'leave-transaction-manual-employee-details'
};

/**
 * Map API data to frontend model
 */
function mapApiDataToLeaveTransactionManual(apiData: LeaveTransactionManualApiData): LeaveTransactionManual {
    return {
        id: apiData.hreltD_Id || 0,
        employeeName: apiData.hrmE_EmployeeFirstName || '',
        leaveName: apiData.hrmL_LeaveName || '',
        fromDate: apiData.hreltD_FromDate ? new Date(apiData.hreltD_FromDate) : new Date(),
        toDate: apiData.hreltD_ToDate ? new Date(apiData.hreltD_ToDate) : new Date(),
        totalDays: apiData.hreltD_TotDays || 0,
        transactionId: apiData.hrelT_Id || 0,
        isActive: apiData.hrelT_ActiveFlag ?? true,
        employeeId: apiData.hrmE_Id || 0,
        createdAt: new Date()
    };
}

/**
 * Map frontend model to API request
 */
function mapLeaveTransactionManualToApiData(
    data: Partial<LeaveTransactionManual> & { hrmL_LeaveType?: string; hrmlY_Id?: number }
): LeaveTransactionManualSaveRequest {
    const fromDate = data.fromDate ? (typeof data.fromDate === 'string' ? new Date(data.fromDate) : data.fromDate) : new Date();
    const toDate = data.toDate ? (typeof data.toDate === 'string' ? new Date(data.toDate) : data.toDate) : new Date();

    return {
        hrelT_Id: data.transactionId || 0,
        hreltD_Id: data.id || 0,
        hrmE_Id: data.employeeId || 0,
        hrmL_LeaveType: data.hrmL_LeaveType || 'OD',
        hrmlY_Id: data.hrmlY_Id || 0,
        hrelT_FromDate: fromDate.toISOString(),
        hrelT_ToDate: toDate.toISOString(),
        hrelT_TotDays: data.totalDays || 0
    };
}

/**
 * Hook to fetch leave transaction manual list with pagination
 */
export function useLeaveTransactionManualList(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [LEAVE_TRANSACTION_MANUAL_KEYS.LIST, searchParams ?? {}],
            queryFn: async () => {
                try {
                    const response = await getLeaveTransactionManualList(searchParams);
                    if (!response.success) {
                        throw new Error(response.message || 'Failed to fetch leave transaction list');
                    }

                    // Map API data to frontend model
                    const transactionList = (response.data || []).map(mapApiDataToLeaveTransactionManual);

                    return {
                        success: true,
                        message: response.message || 'Leave transaction list fetched successfully',
                        data: transactionList,
                        total: response.total || transactionList.length,
                        page: response.page || 1,
                        page_size: response.page_size || 30
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave transaction list');
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [LEAVE_TRANSACTION_MANUAL_KEYS.LIST]
            });
        }
    };
}

/**
 * Hook to save leave transaction manual
 */
export function useSaveLeaveTransactionManual() {
    const queryClient = useQueryClient();
    return useMutation<
        { success: boolean; data: LeaveTransactionManual; message: string },
        Error,
        Omit<LeaveTransactionManual, 'id' | 'createdAt'>
    >({
        mutationFn: async (data: Omit<LeaveTransactionManual, 'id' | 'createdAt'>) => {
            const apiData = mapLeaveTransactionManualToApiData(data);
            const response = await saveLeaveTransactionManual(apiData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to save leave transaction');
            }

            // Map response back to frontend format
            let mappedData: LeaveTransactionManual | null = null;
            if (response.data) {
                mappedData = mapApiDataToLeaveTransactionManual(response.data);
            }

            // If API returns null data, synthesize response from input data
            if (!mappedData) {
                mappedData = {
                    id: 0,
                    createdAt: new Date(),
                    ...data
                } as LeaveTransactionManual;
            }

            return {
                success: true,
                data: mappedData,
                message: response.message || 'Leave transaction saved successfully'
            };
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [LEAVE_TRANSACTION_MANUAL_KEYS.LIST]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save leave transaction');
        }
    });
}

/**
 * Hook to update leave transaction manual
 */
export function useUpdateLeaveTransactionManual() {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean; data: LeaveTransactionManual; message: string }, Error, LeaveTransactionManual>({
        mutationFn: async (data: LeaveTransactionManual) => {
            if (!data.id) {
                throw new Error('ID is required for update');
            }
            const apiData = mapLeaveTransactionManualToApiData(data);
            const response = await saveLeaveTransactionManual(apiData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update leave transaction');
            }

            // Map response back to frontend format
            const mappedData = response.data ? mapApiDataToLeaveTransactionManual(response.data) : data;

            return {
                success: true,
                data: mappedData,
                message: response.message || 'Leave transaction updated successfully'
            };
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [LEAVE_TRANSACTION_MANUAL_KEYS.LIST]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update leave transaction');
        }
    });
}

/**
 * Hook to delete leave transaction manual
 */
export function useDeleteLeaveTransactionManual() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (request: LeaveTransactionManualDeleteRequest) => {
            try {
                const response = await deleteLeaveTransactionManual(request);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to delete leave transaction');
                }
                return {
                    success: true,
                    message: response.message || 'Leave transaction deleted successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to delete leave transaction');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [LEAVE_TRANSACTION_MANUAL_KEYS.LIST]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete leave transaction');
        }
    });
}

/**
 * Hook to toggle leave transaction active status
 */
export function useToggleLeaveTransactionManual() {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean; message: string }, Error, number>({
        mutationFn: async (hreltId: number) => {
            try {
                const response = await toggleLeaveTransactionManual(hreltId);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to toggle status');
                }
                return {
                    success: true,
                    message: response.message || 'Status toggled successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to toggle status');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [LEAVE_TRANSACTION_MANUAL_KEYS.LIST]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to toggle status');
        }
    });
}

/**
 * Hook to fetch leave details for a specific employee
 */
export function useEmployeeLeaveDetails(hrmeId: number | null) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [LEAVE_TRANSACTION_MANUAL_KEYS.EMPLOYEE_DETAILS, hrmeId],
            queryFn: async () => {
                if (!hrmeId) return { success: true, data: [] };
                try {
                    const response = await getEmployeeLeaveDetails(hrmeId);
                    if (!response.success) {
                        throw new Error(response.message || 'Failed to fetch employee leave details');
                    }

                    // Map API data to frontend model
                    const transactionList = (response.data || []).map(mapApiDataToLeaveTransactionManual);

                    return {
                        success: true,
                        message: response.message || 'Employee leave details fetched successfully',
                        data: transactionList
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch employee leave details');
                }
            },
            enabled: !!hrmeId,
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [LEAVE_TRANSACTION_MANUAL_KEYS.EMPLOYEE_DETAILS, hrmeId]
            });
        }
    };
}
