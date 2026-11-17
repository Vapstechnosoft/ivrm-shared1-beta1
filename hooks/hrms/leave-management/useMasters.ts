'use client';
import type { LeaveAuthorization } from '@/app/(root)/hrms/leave-management/masters/leave-authorization/_components/columns';
import type { MasterLeave } from '@/app/(root)/hrms/leave-management/masters/master-leave/_components/columns';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import { createLocalCrud } from '@/lib/localdb';
import {
    deleteLeaveAuthorization as deleteLeaveAuthorizationAPI,
    getInstitutionsByLoginBased,
    getLeaveAuthorization,
    getLeaveAuthorizationDropdowns,
    getLeaveAuthorizationForEdit,
    saveLeaveAuthorization as saveLeaveAuthorizationAPI
} from '@/server/hrms/leave-management/masters/leave-authorization';
import {
    deleteMasterLeave as deleteMasterLeaveAPI,
    getMasterLeave,
    getMasterLeaveDropdowns,
    getMasterLeaveForEdit,
    saveMasterLeave as saveMasterLeaveAPI,
    toggleMasterLeave as toggleMasterLeaveAPI,
    updateMasterLeaveOrder as updateMasterLeaveOrderAPI
} from '@/server/hrms/leave-management/masters/master-leave';
import { getTimetableData } from '@/server/timetable/transactions/staff-replacement-in-unallocated-period';
import type { ApiSearchparams } from '@/types';
import type { LeaveAuthorizationGetResponseData } from '@/types/hrms/leave-management/leave-authorization';
import type { MasterLeaveGetResponseData, MasterLeaveListItem, MasterLeaveSaveRequest, MasterLeaveDTOO } from '@/types/hrms/leave-management/master-leave';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
// MasterLeaveYear type - placeholder until actual type is defined
interface MasterLeaveYear {
    id: number;
    createdAt: Date;
    leaveYear: string;
    fromDate: string;
    toDate: string;
    isActive: boolean;
}
/**
 * Map API response data to frontend MasterLeave format
 */
function mapApiDataToMasterLeave(apiData: MasterLeaveGetResponseData | MasterLeaveListItem | null): MasterLeave | null {
    if (!apiData) {
        return null;
    }

    // Normalize data (handle both PascalCase and camelCase)
    const data = apiData as any;
    const id = data.hrmL_Id || data.HRML_Id || data.id || 0;

    // Debug logging for isActive
    console.log('🔍 Mapping Master Leave - ID:', id);
    console.log('🔍 hrmL_ActiveFlag:', data.hrmL_ActiveFlag);
    console.log('🔍 HRML_ActiveFlag:', data.HRML_ActiveFlag);
    console.log('🔍 isActive:', data.isActive);

    return {
        id: id,
        createdAt: data.createdDate || data.CreatedDate ? new Date(data.createdDate || data.CreatedDate) : new Date(),
        leaveName: data.hrmL_LeaveName || data.HRML_LeaveName || data.leaveName || '',
        leaveCode: data.hrmL_LeaveCode || data.HRML_LeaveCode || data.leaveCode || '',
        leaveType: data.hrmL_LeaveType || data.HRML_LeaveType || data.leaveType || '',
        leaveApplyCriteria: data.hrmL_WhenToApplyFlg || data.HRML_LeaveApplyCriteria || data.leaveApplyCriteria || '',
        daysForApplyCriteria: String(
            data.hrmL_NoOfDays !== undefined && data.hrmL_NoOfDays !== null
                ? data.hrmL_NoOfDays
                : data.HRML_DaysForApplyCriteria !== undefined
                    ? data.HRML_DaysForApplyCriteria
                    : data.daysForApplyCriteria || ''
        ),
        maxDaysForApply: String(data.hrmL_MaxDaysForApply || data.HRML_MaxDaysForApply || data.maxDaysForApply || ''),
        leaveDetails: data.hrmL_LeaveDetails || data.HRML_LeaveDetails || data.leaveDetails || '',
        leaveCredit: data.hrmL_LeaveCreditFlg ?? data.HRML_LeaveCreditFlg ?? data.leaveCredit ?? false,
        lateDeduct: data.hrmL_LateDeductFlag ?? data.HRML_LateDeductFlag ?? data.lateDeduct ?? false,
        probationNotApplicable:
            data.hrmL_ProbationNotApplicableFlg ?? data.HRML_ProbationNotApplicableFlg ?? data.probationNotApplicable ?? false,
        leaveOrder: data.hrmL_LateDeductOrder || data.HRML_LateDeductOrder || data.leaveOrder || 0,
        // Map isActive to hrmL_LeaveCreditFlg as per user request for toggle functionality
        isActive: data.hrmL_LeaveCreditFlg ?? data.HRML_LeaveCreditFlg ?? false
    };
}
/**
 * Map frontend MasterLeave format to API request format
 */
function mapMasterLeaveToApiData(data: MasterLeave | Omit<MasterLeave, 'id' | 'createdAt'>): MasterLeaveSaveRequest {
    return {
        MI_Id: HRMS_MI_ID,
        HRML_Id: 'id' in data ? Number(data.id) || 0 : 0,
        HRML_LeaveName: data.leaveName,
        HRML_LeaveCode: data.leaveCode,
        HRML_LeaveDetails: data.leaveDetails || '',
        HRML_LeaveCreditFlg: !!data.leaveCredit,
        HRML_LeaveType: data.leaveType,
        HRML_LateDeductFlag: !!data.lateDeduct,
        HRML_LateDeductOrder: Number(data.leaveOrder || 0),
        HRML_ActiveFlag: data.isActive,
        HRML_ProbationNotApplicableFlg: !!data.probationNotApplicable,
        HRML_LeaveApplyCriteria: data.leaveApplyCriteria || '',
        HRML_DaysForApplyCriteria: data.daysForApplyCriteria ? Number(data.daysForApplyCriteria) : 0,
        HRML_MaxDaysForApply: data.maxDaysForApply ? Number(data.maxDaysForApply) : 0,
        CreatedDate: 'createdAt' in data && data.createdAt ? data.createdAt.toISOString() : new Date().toISOString()
    };
}
/**
 * Hook to fetch master leave dropdown options (leave types, etc.)
 */
export function useMasterLeaveDropdowns() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE, 'dropdowns'],
            queryFn: async () => {
                try {
                    const dropdowns = await getMasterLeaveDropdowns({
                        MI_Id: HRMS_MI_ID
                    });
                    return {
                        success: true,
                        data: dropdowns,
                        message: 'Dropdown data fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch dropdown data');
                }
            },
            staleTime: 5 * 60 * 1000, // Cache for 5 minutes
            retry: 1
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE, 'dropdowns']
            });
        }
    };
}
// Master Leave hooks
export function useMasterLeave(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE, searchParams],
            queryFn: async () => {
                try {
                    // Call API with search parameters
                    const response = await getMasterLeave(searchParams);
                    if (!response.success) {
                        throw new Error(response.message || 'Failed to fetch master leave');
                    }
                    // Extract list from response
                    let leaveList: MasterLeave[] = [];
                    const data = response.data;

                    if (data) {
                        // Case 1: data is directly an array (New GET API)
                        if (Array.isArray(data)) {
                            leaveList = data
                                .map((item: any) => mapApiDataToMasterLeave(item))
                                .filter((item: MasterLeave | null): item is MasterLeave => item !== null);
                        }
                        // Case 2: data is an object with list fields (Wrapper API)
                        else if (typeof data === 'object') {
                            const dataObj = data as MasterLeaveGetResponseData;
                            const possibleLists = [dataObj.GridviewDetails, dataObj.leavelistedit, dataObj.leaveData];

                            for (const list of possibleLists) {
                                if (list && Array.isArray(list)) {
                                    leaveList = list
                                        .map((item: any) => mapApiDataToMasterLeave(item))
                                        .filter((item: MasterLeave | null): item is MasterLeave => item !== null);
                                    if (leaveList.length > 0) break;
                                }
                            }

                            // If single record in object
                            if ((leaveList.length === 0 && (dataObj as any).hrmL_Id) || (dataObj as any).HRML_Id) {
                                const mapped = mapApiDataToMasterLeave(dataObj);
                                if (mapped) leaveList = [mapped];
                            }
                        }
                    }
                    return {
                        success: true,
                        data: leaveList,
                        total: response.total || leaveList.length,
                        page: response.page || 1,
                        page_Size: response.page_Size || 10,
                        message: response.message || 'Master leave fetched successfully'
                    };
                } catch (error: any) {
                    // Error message from API is already in error.message
                    throw new Error(error?.message || 'Failed to fetch master leave');
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE]
            });
        }
    };
}
export function useSaveMasterLeave() {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean; data: MasterLeave; message: string }, Error, Omit<MasterLeave, 'id' | 'createdAt'>>({
        mutationFn: async (data: Omit<MasterLeave, 'id' | 'createdAt'>) => {
            const apiData = mapMasterLeaveToApiData(data);
            const response = await saveMasterLeaveAPI(apiData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to save master leave');
            }

            // If API returns null data, synthesize response from input data
            let mappedData: MasterLeave | null = null;

            if (response.data) {
                mappedData = mapApiDataToMasterLeave(response.data);
            }

            // If mapping failed or data was null, create a response from the input data
            if (!mappedData) {
                mappedData = {
                    id: 0, // Will be updated on refetch
                    createdAt: new Date(),
                    ...data
                };
            }

            return {
                success: true,
                data: mappedData,
                message: response.message || 'Master leave saved successfully'
            };
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to save master leave');
        }
    });
}
/**
 * Hook to fetch master leave data for editing
 * Uses the Edit endpoint to get fresh data for a specific leave
 */
export function useMasterLeaveForEdit(HRML_Id: number | null) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE, 'edit', HRML_Id],
            queryFn: async () => {
                if (!HRML_Id) {
                    throw new Error('HRML_Id is required');
                }
                try {
                    const response = await getMasterLeaveForEdit(HRML_Id);
                    if (!response.success) {
                        throw new Error(response.message || 'Failed to fetch leave data for editing');
                    }
                    // Map API response to frontend format
                    const mappedData = mapApiDataToMasterLeave(response.data);
                    if (!mappedData) {
                        throw new Error('Failed to parse leave data');
                    }
                    return {
                        success: true,
                        data: mappedData,
                        message: response.message || 'Leave data fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave data for editing');
                }
            },
            enabled: !!HRML_Id && HRML_Id > 0,
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE, 'edit']
            });
        }
    };
}
export function useUpdateMasterLeave() {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean; data: MasterLeave; message: string }, Error, MasterLeave>({
        mutationFn: async (data: MasterLeave) => {
            if (!data.id) {
                throw new Error('ID is required for update');
            }
            const apiData = mapMasterLeaveToApiData(data);
            const response = await saveMasterLeaveAPI(apiData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update master leave');
            }
            // Map response back to frontend format
            const mappedData = mapApiDataToMasterLeave(response.data);
            if (!mappedData) {
                throw new Error('Failed to parse updated leave data');
            }
            return {
                success: true,
                data: mappedData,
                message: response.message || 'Master leave updated successfully'
            };
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to update master leave');
        }
    });
}
/**
 * Hook to toggle master leave activation status
 * Uses the toggle_master_leave endpoint
 */
export function useToggleMasterLeave() {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean; message: string }, Error, number>({
        mutationFn: async (HRML_Id: number) => {
            try {
                const response = await toggleMasterLeaveAPI(HRML_Id);
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
                    queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE]
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
 * Hook to update master leave sequence/order
 * Uses the update_master_leave_order endpoint
 */
export function useUpdateMasterLeaveOrder() {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean; message: string }, Error, Array<{ id: number; order: number }>>({
        mutationFn: async (orders: Array<{ id: number; order: number }>) => {
            try {
                const response = await updateMasterLeaveOrderAPI(orders);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to update order');
                }
                return {
                    success: true,
                    message: response.message || 'Order updated successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to update order');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update order');
        }
    });
}
/**
 * Hook to delete master leave
 * Uses the DeletePages endpoint
 */
export function useDeleteMasterLeave() {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean; message: string }, Error, number>({
        mutationFn: async (HRML_Id: number) => {
            if (!HRML_Id || HRML_Id <= 0) {
                throw new Error('Valid HRML_Id is required for deletion');
            }
            try {
                const response = await deleteMasterLeaveAPI(HRML_Id);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to delete master leave');
                }
                return {
                    success: true,
                    message: response.message || 'Master leave deleted successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to delete master leave');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to delete master leave');
        }
    });
}

// Master Leave Year hooks
export function useMasterLeaveYear() {
    const queryClient = useQueryClient();
    const db = createLocalCrud<MasterLeaveYear>('masterLeaveYear');
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE_YEAR],
            queryFn: async () => {
                return {
                    success: true,
                    data: db.list(),
                    message: 'Master leave year fetched successfully'
                };
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE_YEAR]
            });
        }
    };
}
export function useSaveMasterLeaveYear() {
    const queryClient = useQueryClient();
    const db = createLocalCrud<MasterLeaveYear>('masterLeaveYear');
    return useMutation<{ success: boolean; data: MasterLeaveYear; message: string }, Error, Omit<MasterLeaveYear, 'id' | 'createdAt'>>({
        mutationFn: async (data: Omit<MasterLeaveYear, 'id' | 'createdAt'>) => {
            const newLeaveYear = db.create(data);
            return {
                success: true,
                data: newLeaveYear,
                message: 'Master leave year saved successfully'
            };
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE_YEAR]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save master leave year');
        }
    });
}
export function useUpdateMasterLeaveYear() {
    const queryClient = useQueryClient();
    const db = createLocalCrud<MasterLeaveYear>('masterLeaveYear');
    return useMutation<{ success: boolean; data: MasterLeaveYear; message: string }, Error, MasterLeaveYear>({
        mutationFn: async (data: MasterLeaveYear) => {
            if (data.id) {
                db.update(data.id, data);
                return {
                    success: true,
                    data,
                    message: 'Master leave year updated successfully'
                };
            }
            throw new Error('ID is required for update');
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_LEAVE_YEAR]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update master leave year');
        }
    });
}
/**
 * Map API response data to frontend LeaveAuthorization format
 */
function mapApiDataToLeaveAuthorization(apiData: LeaveAuthorizationGetResponseData | any | null): LeaveAuthorization | null {
    if (!apiData) {
        return null;
    }
    const data = apiData as any;
    // Normalize mapping for both camelCase and PascalCase
    const mappedData: LeaveAuthorization & { _HRLA_Id?: number } = {
        id: data.hrlaoN_Id || data.HRLAON_Id || data.hrmlA_Id || data.HRMLA_Id || data.id || 0,
        createdAt: data.createdDate || data.CreatedDate ? new Date(data.createdDate || data.CreatedDate) : new Date(),
        institution: data.mI_Name || data.institutionName || data.InstitutionName || data.institution || '',
        gradeName: data.hrmG_GradeName || data.HRMG_GradeName || data.gradeName || '',
        groupTypeName: data.hrmgT_EmployeeGroupType || data.hrmgT_GroupTypeName || data.HRMGT_GroupTypeName || data.groupTypeName || '',
        departmentName: data.hrmD_DepartmentName || data.HRMD_DepartmentName || data.departmentName || '',
        designationName: data.hrmdeS_DesignationName || data.HRMDES_DesignationName || data.designationName || '',
        leaveType: data.hrmL_LeaveType || data.hrmL_LeaveName || data.HRML_LeaveName || data.leaveType || '',
        orderOfApproval: String(data.hrlaoN_SanctionLevelNo || data.hrmlA_OrderOfApproval || data.HRMLA_OrderOfApproval || data.orderOfApproval || ''),
        approvalPerson: data.hrmE_EmployeeFirstName || data.hrmlA_ApprovalPerson || data.HRMLA_ApprovalPerson || data.approvalPerson || '',
        finalFlag: data.hrlaoN_FinalFlg ?? data.hrmlA_FinalFlag ?? data.HRMLA_FinalFlag ?? data.finalFlag ?? false
    };

    // Store HRLA_Id if available (needed for delete operation)
    // In authorizationGrid it is hrlA_Id or hrmlA_Id
    const hrlA_Id = data.hrlA_Id || data.HRLA_Id || data.hrla_id || data.hrmlA_Id || data.HRMLA_Id;
    console.log(`🔍 Mapping Auth - id: ${mappedData.id}, hrlA_Id found: ${hrlA_Id}`);
    if (hrlA_Id !== undefined && hrlA_Id !== null) {
        (mappedData as any)._HRLA_Id = hrlA_Id;
    }
    return mappedData;
}

/**
 * Hook to fetch institutions based on login
 */
export function useInstitutionsByLoginBased() {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.LEAVE_AUTHORIZATION, 'institutions'],
        queryFn: async () => {
            const response = await getInstitutionsByLoginBased();
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch institutions');
            }
            return response;
        }
    });
}
// Leave Authorization hooks
export function useLeaveAuthorization(searchParams?: ApiSearchparams & { MI_Id?: string | number; UserId?: number }) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_AUTHORIZATION, searchParams ?? {}],
            queryFn: async () => {
                try {
                    // Call API with search params for pagination and filtering
                    const response = await getLeaveAuthorization({
                        ...searchParams,
                        UserId: 0,
                        MI_Id: searchParams?.MI_Id || HRMS_MI_ID
                    });
                    if (!response.success) {
                        throw new Error(response.message || 'Failed to fetch leave authorization');
                    }
                    // Extract list from response
                    let authList: LeaveAuthorization[] = [];
                    if (response.data) {
                        // Check for authorizationGrid (User provided specific structure)
                        if ((response.data as any).authorizationGrid && Array.isArray((response.data as any).authorizationGrid)) {
                            authList = (response.data as any).authorizationGrid
                                .map((item: any) => mapApiDataToLeaveAuthorization(item))
                                .filter((item: LeaveAuthorization | null): item is LeaveAuthorization => item !== null);
                        }
                        // Check if GridviewDetails contains the list
                        else if ((response.data as any).GridviewDetails && Array.isArray((response.data as any).GridviewDetails)) {
                            authList = (response.data as any).GridviewDetails
                                .map((item: any) => mapApiDataToLeaveAuthorization(item))
                                .filter((item: LeaveAuthorization | null): item is LeaveAuthorization => item !== null);
                        }
                        // Check if leavelistauth contains the list
                        else if ((response.data as any).leavelistauth && Array.isArray((response.data as any).leavelistauth)) {
                            authList = (response.data as any).leavelistauth
                                .map((item: any) => mapApiDataToLeaveAuthorization(item))
                                .filter((item: LeaveAuthorization | null): item is LeaveAuthorization => item !== null);
                        }
                        // If single record, convert it
                        else if ((response.data as any).HRMLA_Id > 0) {
                            const mapped = mapApiDataToLeaveAuthorization(response.data);
                            if (mapped) {
                                authList = [mapped];
                            }
                        }
                        // Check if data is directly an array
                        else if (Array.isArray(response.data)) {
                            authList = response.data
                                .map((item: any) => mapApiDataToLeaveAuthorization(item))
                                .filter((item: LeaveAuthorization | null): item is LeaveAuthorization => item !== null);
                        }
                    }
                    return {
                        success: true,
                        message: response.message || 'Leave authorization fetched successfully',
                        data: authList,
                        total: response.total || authList.length,
                        page: response.page || 1,
                        page_size: response.page_size || authList.length
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave authorization');
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_AUTHORIZATION]
            });
        }
    };
}
/**
 * Hook to fetch leave authorization dropdown options
 */
export function useLeaveAuthorizationDropdowns() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_AUTHORIZATION, 'dropdowns'],
            queryFn: async () => {
                try {
                    const dropdowns = await getLeaveAuthorizationDropdowns({
                        MI_Id: HRMS_MI_ID,
                        UserId: 0
                    });
                    return {
                        success: true,
                        data: dropdowns,
                        message: 'Dropdown data fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch dropdown data');
                }
            },
            staleTime: 5 * 60 * 1000, // Cache for 5 minutes
            retry: 1
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_AUTHORIZATION, 'dropdowns']
            });
        }
    };
}
/**
 * Hook to fetch a single leave authorization record for editing
 * @param HRLAON_Id - Leave authorization ID
 */
export function useLeaveAuthorizationForEdit(HRLAON_Id: number | null) {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.LEAVE_AUTHORIZATION, 'edit', HRLAON_Id],
        queryFn: async () => {
            if (!HRLAON_Id) {
                throw new Error('HRLAON_Id is required');
            }
            try {
                const response = await getLeaveAuthorizationForEdit(HRLAON_Id);
                if (!response.success || !response.data) {
                    throw new Error(response.message || 'Failed to fetch leave authorization data');
                }
                // Map API response to frontend format
                const mappedData = mapApiDataToLeaveAuthorization(response.data);
                if (!mappedData) {
                    throw new Error('Failed to parse leave authorization data');
                }
                return {
                    success: true,
                    data: mappedData,
                    message: response.message || 'Leave authorization fetched successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to fetch leave authorization data');
            }
        },
        enabled: !!HRLAON_Id && HRLAON_Id > 0,
        retry: 1
    });
}
/**
 * Map frontend LeaveAuthorization format to API request format
 */
function mapLeaveAuthorizationToApiData(
    data: LeaveAuthorization | Omit<LeaveAuthorization, 'id' | 'createdAt'>,
    dropdownData: any
): {
    HRLA_Id: number;
    MI_Id: number;
    HRMG_Id: number;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRML_Id: number;
    UserId: number;
    approvaluser_array: Array<{
        Approval_HRME_Id: number;
        ApprovalLevelNo: number;
        ApprovalFinalFlag: boolean;
    }>;
} {
    // Find IDs from dropdown options based on names or values
    // form data might contain IDs (values) if coming from add/edit form, or Names (labels) if coming from table row
    const gradeId = dropdownData?.grades?.find((g: any) => g.value == data.gradeName || g.label === data.gradeName)?.value || 0;
    const groupTypeId = dropdownData?.groupTypes?.find((g: any) => g.value == data.groupTypeName || g.label === data.groupTypeName)?.value || 0;
    const departmentId = dropdownData?.departments?.find((d: any) => d.value == data.departmentName || d.label === data.departmentName)?.value || 0;
    const designationId = dropdownData?.designations?.find((d: any) => d.value == data.designationName || d.label === data.designationName)?.value || 0;
    const leaveTypeId = dropdownData?.leaveTypes?.find((l: any) => l.value == data.leaveType || l.label === data.leaveType)?.value || 0;
    const approvalPersonId = dropdownData?.approvalPersons?.find((a: any) => a.value == data.approvalPerson || a.label === data.approvalPerson)?.value || 0;

    return {
        HRLA_Id: (data as any)._HRLA_Id || 0,
        MI_Id: HRMS_MI_ID,
        HRMG_Id: Number(gradeId),
        HRMGT_Id: Number(groupTypeId),
        HRMD_Id: Number(departmentId),
        HRMDES_Id: Number(designationId),
        HRML_Id: Number(leaveTypeId),
        UserId: 0,
        approvaluser_array: [
            {
                Approval_HRME_Id: Number(approvalPersonId),
                ApprovalLevelNo: Number(data.orderOfApproval) || 0,
                ApprovalFinalFlag: !!data.finalFlag
            }
        ]
    };
}
export function useSaveLeaveAuthorization() {
    const queryClient = useQueryClient();
    const { data: dropdownData } = useLeaveAuthorizationDropdowns();
    return useMutation<
        { success: boolean; data: LeaveAuthorization; message: string },
        Error,
        Omit<LeaveAuthorization, 'id' | 'createdAt'>
    >({
        mutationFn: async (data: Omit<LeaveAuthorization, 'id' | 'createdAt'>) => {
            if (!dropdownData?.data) {
                throw new Error('Dropdown data not loaded. Please wait...');
            }
            const apiData = mapLeaveAuthorizationToApiData(data, dropdownData.data);
            const response = await saveLeaveAuthorizationAPI(apiData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to save leave authorization');
            }
            // Map response back to frontend format
            let mappedData: LeaveAuthorization | null = null;
            if (response.data) {
                mappedData = mapApiDataToLeaveAuthorization(response.data);
            }

            // If API returns success but no data (common in some legacy APIs), prevent error
            if (!mappedData && response.success) {
                // Return the input data as a placeholder
                // Note: This might contain IDs instead of Names until refetch
                mappedData = {
                    id: 0,
                    createdAt: new Date(),
                    ...data
                } as LeaveAuthorization;
            }

            if (!mappedData) {
                throw new Error('Failed to parse saved authorization data');
            }
            return {
                success: true,
                data: mappedData,
                message: response.message || 'Leave authorization saved successfully'
            };
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_AUTHORIZATION]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to save leave authorization');
        }
    });
}
export function useUpdateLeaveAuthorization() {
    const queryClient = useQueryClient();
    const { data: dropdownData } = useLeaveAuthorizationDropdowns();
    return useMutation<{ success: boolean; data: LeaveAuthorization; message: string }, Error, LeaveAuthorization>({
        mutationFn: async (data: LeaveAuthorization) => {
            if (!data.id) {
                throw new Error('ID is required for update');
            }
            if (!dropdownData?.data) {
                throw new Error('Dropdown data not loaded. Please wait...');
            }
            const apiData = mapLeaveAuthorizationToApiData(data, dropdownData.data);
            const response = await saveLeaveAuthorizationAPI(apiData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update leave authorization');
            }
            // Map response back to frontend format
            const mappedData = mapApiDataToLeaveAuthorization(response.data);
            if (!mappedData) {
                throw new Error('Failed to parse updated authorization data');
            }
            return {
                success: true,
                data: mappedData,
                message: response.message || 'Leave authorization updated successfully'
            };
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_AUTHORIZATION]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to update leave authorization');
        }
    });
}
/**
 * Hook to delete a leave authorization
 */
export function useDeleteLeaveAuthorization() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (request: { HRLA_Id: number; HRLAON_Id: number }) => {
            try {
                const response = await deleteLeaveAuthorizationAPI(request);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to delete leave authorization');
                }
                return {
                    success: true,
                    message: response.message || 'Leave authorization deleted successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to delete leave authorization');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_AUTHORIZATION]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            console.error('Delete Authorization Failed:', error);
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to delete leave authorization');
        }
    });
}
