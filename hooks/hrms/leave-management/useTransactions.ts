'use client';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import { getLeaveCredit, addOrUpdateLeaveCredit, deleteLeaveCredit } from '@/server/hrms/leave-management/transactions/leave-credit';
import { getLeaveCreditTransaction, addOrUpdateLeaveCreditTransaction, deleteLeaveCreditTransaction, getLeavetransm, getLeaveTransactionDepartments, getLeaveTransactionDesignation, getLeaveTransactionEmployee, getLeaveTransactionEmpLop, saveLeaveTransaction, deleteLeaveTransactionDetails } from '@/server/hrms/leave-management/transactions/leave-credit-transaction';
import { getLeaveCreditDetails, addOrUpdateLeaveCreditDetails, deleteLeaveCreditDetails, getLeaveCode, getLeaveCreditDepartments, getLeaveCreditDesignation, getLeaveCreditGrade, getLeaveMaster, saveLeaveCreditDetails, getLeaveDetailsCreditMonth, getLeaveDetailsCF, getLeaveDetailsCFMonth, getLeaveDetailsEnCash, getLeaveNameDropdown, getCreditMonthDropdown } from '@/server/hrms/leave-management/transactions/leave-credit-details';
import { getLeaveCreditDeduction, addOrUpdateLeaveCreditDeduction, deleteLeaveCreditDeduction } from '@/server/hrms/leave-management/transactions/leave-credit-deduction';
import { getLeaveCreditAddition, addOrUpdateLeaveCreditAddition, deleteLeaveCreditAddition } from '@/server/hrms/leave-management/transactions/leave-credit-addition';
import { getLeaveCarryForward, addOrUpdateLeaveCarryForward, deleteLeaveCarryForward } from '@/server/hrms/leave-management/transactions/leave-carryforward';
import { getCompOffApproval, updateCompOffApprovalStatus } from '@/server/hrms/leave-management/transactions/comp-off-approval';
import { getCompOffRequestData, submitCompOffRequest, cancelCompOffRequest } from '@/server/hrms/leave-management/transactions/comp-off-request';
import { getLeaveTransferBasicData, getLeaveOB, getDepartments, getDesignation, saveLeaveTransferDetails, leaveCarryForward, deleteLeaveTransfer } from '@/server/hrms/leave-management/transactions/leave-transfer';
import { getLeaveOB as getLeaveOpeningBalanceOB, getLeaveOpeningBalanceDepartments, getLeaveOpeningBalanceDesignation, getOBDetails, getEmployeOB, saveLeaveOpeningBalance, deleteLeaveOpeningBalance, getLeaveOpeningBalancePageDetails } from '@/server/hrms/leave-management/transactions/leave-opening-balance';
import type { LeaveCredit } from '@/app/(root)/hrms/leave-management/transaction/leave-transfer/_components/columns';
import type { LeaveCreditTransaction } from '@/app/(root)/hrms/leave-management/transaction/leave-credit-transaction/_components/columns';
import type { LeaveCreditDetail } from '@/app/(root)/hrms/leave-management/transaction/leave-credit-details/_components/columns';
import type { LeaveCreditDeduction, LeaveCreditAddition, LeaveCarryForward } from '@/types/hrms/leave-management/leave-credit-types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
// Leave Credit Hooks
export const useLeaveCredit = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT],
            queryFn: async () => getLeaveCredit(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT]
            });
        }
    };
};
export const useSaveLeaveCredit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (credit: LeaveCredit) => addOrUpdateLeaveCredit(credit),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save leave credit');
        }
    });
};
export const useUpdateLeaveCredit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (credit: LeaveCredit) => addOrUpdateLeaveCredit(credit),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update leave credit');
        }
    });
};
export const useDeleteLeaveCredit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => deleteLeaveCredit(id),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete leave credit');
        }
    });
};
// Leave Credit Transaction Hooks
export const useLeaveCreditTransaction = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION],
            queryFn: async () => getLeaveCreditTransaction(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION]
            });
        }
    };
};
export const useSaveLeaveCreditTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (transaction: LeaveCreditTransaction) => addOrUpdateLeaveCreditTransaction(transaction),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save leave credit transaction');
        }
    });
};
export const useUpdateLeaveCreditTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (transaction: LeaveCreditTransaction) => addOrUpdateLeaveCreditTransaction(transaction),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update leave credit transaction');
        }
    });
};
export const useDeleteLeaveCreditTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => deleteLeaveCreditTransaction(id),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete leave credit transaction');
        }
    });
};
/**
 * Hook to fetch leave transactions
 * POST /api/LeaveTransactionManualWrapperFacade/GetLeavetransm
 */
export const useLeavetransm = (request?: {
    MI_Id?: number;
    EmpTypeIds?: number[];
    DepartmentIds?: number[];
    DesignationIds?: number[];
    EmployeeIds?: number[];
}, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'leavetransm', request?.MI_Id, request?.EmpTypeIds, request?.DepartmentIds, request?.DesignationIds, request?.EmployeeIds],
            queryFn: async () => {
                try {
                    const response = await getLeavetransm({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        EmpTypeIds: request?.EmpTypeIds || [],
                        DepartmentIds: request?.DepartmentIds || [],
                        DesignationIds: request?.DesignationIds || [],
                        EmployeeIds: request?.EmployeeIds || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave transactions');
                    }
                    // Extract leave transaction list from API response
                    const data = response.data;
                    // Map GridviewDetails, leaveTransactionList, transactionList, or leaveTransmList to transactionList
                    let transactionList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        transactionList = data.GridviewDetails;
                    } else if (data.leaveTransactionList && Array.isArray(data.leaveTransactionList)) {
                        transactionList = data.leaveTransactionList;
                    } else if (data.transactionList && Array.isArray(data.transactionList)) {
                        transactionList = data.transactionList;
                    } else if (data.leaveTransmList && Array.isArray(data.leaveTransmList)) {
                        transactionList = data.leaveTransmList;
                    } else if (Array.isArray(data)) {
                        transactionList = data;
                    }
                    return {
                        success: true,
                        data: {
                            transactionList
                        },
                        rawData: data,
                        message: response.message || 'Leave transactions fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave transactions');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined, // Only fetch when MI_Id is provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'leavetransm']
            });
        }
    };
};
/**
 * Hook to fetch departments for leave transaction
 * POST /api/LeaveTransactionManualWrapperFacade/GetDepartments
 */
export const useLeaveTransactionDepartments = (request?: {
    MI_Id?: number;
    EmpTypeIds?: number[];
    DepartmentIds?: number[];
    DesignationIds?: number[];
    EmployeeIds?: number[];
}, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'departments', request?.MI_Id, request?.EmpTypeIds, request?.DepartmentIds, request?.DesignationIds, request?.EmployeeIds],
            queryFn: async () => {
                try {
                    const response = await getLeaveTransactionDepartments({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        EmpTypeIds: request?.EmpTypeIds || [],
                        DepartmentIds: request?.DepartmentIds || [],
                        DesignationIds: request?.DesignationIds || [],
                        EmployeeIds: request?.EmployeeIds || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch departments');
                    }
                    // Extract and map department options from API response
                    const data = response.data;
                    // Map DepartmentTempDto to departmentOptions
                    const departmentOptions = (data.DepartmentTempDto || []).map((item: any) => ({
                        label: item.HRMD_DepartmentName || item.label || '',
                        value: String(item.HRMD_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Also check other possible locations
                    if (departmentOptions.length === 0 && data.departmentdropdownlist && Array.isArray(data.departmentdropdownlist)) {
                        const mapped = data.departmentdropdownlist.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    // Check GridviewDetails as fallback
                    if (departmentOptions.length === 0 && data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        const mapped = data.GridviewDetails.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    // Check departmentList or departments as fallback
                    if (departmentOptions.length === 0 && data.departmentList && Array.isArray(data.departmentList)) {
                        const mapped = data.departmentList.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    if (departmentOptions.length === 0 && data.departments && Array.isArray(data.departments)) {
                        const mapped = data.departments.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    return {
                        success: true,
                        data: {
                            departmentOptions
                        },
                        rawData: data,
                        message: response.message || 'Departments fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch departments');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined, // Only fetch when MI_Id is provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'departments']
            });
        }
    };
};
/**
 * Hook to fetch designations for leave transaction
 * POST /api/LeaveTransactionManualWrapperFacade/GetDesignation
 */
export const useLeaveTransactionDesignation = (request?: {
    MI_Id?: number;
    EmpTypeIds?: number[];
    DepartmentIds?: number[];
    DesignationIds?: number[];
    EmployeeIds?: number[];
}, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'designation', request?.MI_Id, request?.EmpTypeIds, request?.DepartmentIds, request?.DesignationIds, request?.EmployeeIds],
            queryFn: async () => {
                try {
                    const response = await getLeaveTransactionDesignation({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        EmpTypeIds: request?.EmpTypeIds || [],
                        DepartmentIds: request?.DepartmentIds || [],
                        DesignationIds: request?.DesignationIds || [],
                        EmployeeIds: request?.EmployeeIds || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch designations');
                    }
                    // Extract and map designation options from API response
                    const data = response.data;
                    // Map DesignationTempDto to designationOptions
                    const designationOptions = (data.DesignationTempDto || []).map((item: any) => ({
                        label: item.HRMDES_DesignationName || item.label || '',
                        value: String(item.HRMDES_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Also check designationarray
                    if (designationOptions.length === 0 && data.designationarray && Array.isArray(data.designationarray)) {
                        const mapped = data.designationarray.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    // Also check designationdropdownlist as fallback
                    if (designationOptions.length === 0 && data.designationdropdownlist && Array.isArray(data.designationdropdownlist)) {
                        const mapped = data.designationdropdownlist.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    // Check GridviewDetails as fallback
                    if (designationOptions.length === 0 && data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        const mapped = data.GridviewDetails.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    // Check designationList or designations as fallback
                    if (designationOptions.length === 0 && data.designationList && Array.isArray(data.designationList)) {
                        const mapped = data.designationList.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    if (designationOptions.length === 0 && data.designations && Array.isArray(data.designations)) {
                        const mapped = data.designations.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    return {
                        success: true,
                        data: {
                            designationOptions
                        },
                        rawData: data,
                        message: response.message || 'Designations fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch designations');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined, // Only fetch when MI_Id is provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'designation']
            });
        }
    };
};
/**
 * Hook to fetch employee LOP (Loss of Pay) for leave transaction
 * POST /api/LeaveTransactionManualWrapperFacade/GetEmpLop
 */
export const useLeaveTransactionEmpLop = (request?: {
    MI_Id?: number;
    EmpTypeIds?: number[];
    DepartmentIds?: number[];
    DesignationIds?: number[];
    EmployeeIds?: number[];
}, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'empLop', request?.MI_Id, request?.EmpTypeIds, request?.DepartmentIds, request?.DesignationIds, request?.EmployeeIds],
            queryFn: async () => {
                try {
                    const response = await getLeaveTransactionEmpLop({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        EmpTypeIds: request?.EmpTypeIds || [],
                        DepartmentIds: request?.DepartmentIds || [],
                        DesignationIds: request?.DesignationIds || [],
                        EmployeeIds: request?.EmployeeIds || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch employee LOP');
                    }
                    // Extract employee LOP list from API response
                    const data = response.data;
                    // Map EmpLopTempDto, empLopList, empLopdropdownlist, employeeLopList, or GridviewDetails to lopList
                    let lopList: any[] = [];
                    if (data.EmpLopTempDto && Array.isArray(data.EmpLopTempDto)) {
                        lopList = data.EmpLopTempDto;
                    } else if (data.empLopList && Array.isArray(data.empLopList)) {
                        lopList = data.empLopList;
                    } else if (data.empLopdropdownlist && Array.isArray(data.empLopdropdownlist)) {
                        lopList = data.empLopdropdownlist;
                    } else if (data.employeeLopList && Array.isArray(data.employeeLopList)) {
                        lopList = data.employeeLopList;
                    } else if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        lopList = data.GridviewDetails;
                    } else if (Array.isArray(data)) {
                        lopList = data;
                    }
                    // Map to LOP options format
                    const lopOptions = lopList.map((item: any) => ({
                        id: item.HRME_Id || item.id || 0,
                        employeeCode: item.HRME_EmployeeCode || item.employeeCode || '',
                        employeeName: `${item.HRME_EmployeeFirstName || ''} ${item.HRME_EmployeeMiddleName || ''} ${item.HRME_EmployeeLastName || ''}`.trim() || item.employeeName || '',
                        departmentId: item.HRMD_Id || item.departmentId || 0,
                        departmentName: item.HRMD_DepartmentName || item.departmentName || '',
                        designationId: item.HRMDES_Id || item.designationId || 0,
                        designationName: item.HRMDES_DesignationName || item.designationName || '',
                        lopDays: item.LOPDays || item.lopDays || 0,
                        lopDate: item.LOPDate || item.lopDate || '',
                        lopReason: item.LOPReason || item.lopReason || ''
                    }));
                    return {
                        success: true,
                        data: {
                            lopOptions,
                            lopList
                        },
                        rawData: data,
                        message: response.message || 'Employee LOP fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch employee LOP');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined, // Only fetch when MI_Id is provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'empLop']
            });
        }
    };
};
/**
 * Hook to fetch employees for leave transaction
 * POST /api/LeaveTransactionManualWrapperFacade/GetEmployee
 */
export const useLeaveTransactionEmployee = (request?: {
    MI_Id?: number;
    EmpTypeIds?: number[];
    DepartmentIds?: number[];
    DesignationIds?: number[];
    EmployeeIds?: number[];
}, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'employee', request?.MI_Id, request?.EmpTypeIds, request?.DepartmentIds, request?.DesignationIds, request?.EmployeeIds],
            queryFn: async () => {
                try {
                    const response = await getLeaveTransactionEmployee({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        EmpTypeIds: request?.EmpTypeIds || [],
                        DepartmentIds: request?.DepartmentIds || [],
                        DesignationIds: request?.DesignationIds || [],
                        EmployeeIds: request?.EmployeeIds || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch employees');
                    }
                    // Extract and map employee options from API response
                    const data = response.data;
                    // Map EmployeeTempDto, employeeList, or GridviewDetails to employeeOptions
                    let employeeList: any[] = [];
                    if (data.EmployeeTempDto && Array.isArray(data.EmployeeTempDto)) {
                        employeeList = data.EmployeeTempDto;
                    } else if (data.employeeList && Array.isArray(data.employeeList)) {
                        employeeList = data.employeeList;
                    } else if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        employeeList = data.GridviewDetails;
                    } else if (Array.isArray(data)) {
                        employeeList = data;
                    }
                    const employeeOptions = employeeList.map((item: any) => ({
                        label: `${item.HRME_EmployeeFirstName || ''} ${item.HRME_EmployeeMiddleName || ''} ${item.HRME_EmployeeLastName || ''}`.trim() || item.label || item.name || '',
                        value: String(item.HRME_Id || item.value || item.id || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    return {
                        success: true,
                        data: {
                            employeeOptions,
                            employeeList
                        },
                        rawData: data,
                        message: response.message || 'Employees fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch employees');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined,
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION, 'employee']
            });
        }
    };
};
/**
 * Hook to save leave transaction data
 * POST /api/LeaveTransactionManualWrapperFacade/SaveData
 */
export const useSaveLeaveTransactionManual = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {
            MI_Id?: number;
            HRME_Id: number;
            HRML_LeaveType: string;
            HRELT_FromDate: string;
            HRELT_ToDate: string;
            HRELT_TotDays: number;
            HRELT_Id?: number;
            HRELTD_Id?: number;
            [key: string]: any;
        }) => {
            try {
                const response = await saveLeaveTransaction({
                    ...data,
                    MI_Id: data.MI_Id || HRMS_MI_ID,
                    HRME_Id: data.HRME_Id || 0,
                    HRML_LeaveType: data.HRML_LeaveType || '',
                    HRELT_FromDate: data.HRELT_FromDate || '',
                    HRELT_ToDate: data.HRELT_ToDate || '',
                    HRELT_TotDays: data.HRELT_TotDays || 0,
                    HRELT_Id: data.HRELT_Id || 0,
                    HRELTD_Id: data.HRELTD_Id || 0
                });
                if (!response.success) {
                    throw new Error(response.message || 'Failed to save leave transaction');
                }
                return {
                    success: true,
                    message: response.message || 'Leave transaction saved successfully',
                    data: response.data
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to save leave transaction');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to save leave transaction');
        }
    });
};
/**
 * Hook to delete leave transaction details
 * POST /api/LeaveTransactionManualWrapperFacade/DeleteDetails
 */
export const useDeleteLeaveTransactionManual = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (HRELT_Id: number) => {
            try {
                const response = await deleteLeaveTransactionDetails({ HRELT_Id });
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
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_TRANSACTION]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to delete leave transaction');
        }
    });
};
// Leave Credit Details Hooks
export const useLeaveCreditDetails = (request?: { MI_Id?: number }) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, request?.MI_Id],
            queryFn: async () => {
                try {
                    const response = await getLeaveCreditDetails(request);
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave credit details');
                    }
                    return response;
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave credit details');
                }
            },
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS]
            });
        }
    };
};
/**
 * Hook to save leave credit details using the API
 */
export const useSaveLeaveCreditDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {
            MI_Id?: number;
            HRML_Id: number;
            HRMLD_NoOfDays: string;
            HRMLD_MaxLeaveApplicable: number;
            LoginId?: number;
            Emp_types: any[];
            dept_types: any[];
            desig_types: any[];
            grade_types: any[];
            HRMLD_CarryForFlg: boolean;
            HRMLD_EncashFlg: boolean;
            HRMLDCF_MaxLeaveAplFlg: boolean;
            HRMLDCF_MaxLeaveCF: number;
            selectedcarryMonthList: number[];
            selectedMonthList: number[];
            [key: string]: any;
        }) => {
            try {
                const response = await saveLeaveCreditDetails({
                    ...data,
                    MI_Id: data.MI_Id || HRMS_MI_ID,
                    HRML_Id: data.HRML_Id || 0,
                    HRMLD_NoOfDays: data.HRMLD_NoOfDays || '',
                    HRMLD_MaxLeaveApplicable: data.HRMLD_MaxLeaveApplicable || 0,
                    LoginId: data.LoginId || 0,
                    Emp_types: data.Emp_types || [],
                    dept_types: data.dept_types || [],
                    desig_types: data.desig_types || [],
                    grade_types: data.grade_types || [],
                    HRMLD_CarryForFlg: data.HRMLD_CarryForFlg ?? false,
                    HRMLD_EncashFlg: data.HRMLD_EncashFlg ?? false,
                    HRMLDCF_MaxLeaveAplFlg: data.HRMLDCF_MaxLeaveAplFlg ?? false,
                    HRMLDCF_MaxLeaveCF: data.HRMLDCF_MaxLeaveCF || 0,
                    selectedcarryMonthList: data.selectedcarryMonthList || [],
                    selectedMonthList: data.selectedMonthList || []
                });
                if (!response.success) {
                    throw new Error(response.message || 'Failed to save leave credit details');
                }
                return {
                    success: true,
                    message: response.message || 'Leave credit details saved successfully',
                    data: response.data
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to save leave credit details');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS] });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to save leave credit details');
        }
    });
};
export const useUpdateLeaveCreditDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (detail: LeaveCreditDetail) => addOrUpdateLeaveCreditDetails(detail),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update leave credit details');
        }
    });
};
export const useDeleteLeaveCreditDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => deleteLeaveCreditDetails(id),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete leave credit details');
        }
    });
};
/**
 * Hook to fetch leave code
 */
export const useLeaveCode = (leavecode: number, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveCode', leavecode],
            queryFn: async () => {
                try {
                    const response = await getLeaveCode({ leavecode: leavecode || 0 });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave code');
                    }
                    // Extract leave code list from response
                    const data = response.data;
                    let codeList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        codeList = data.GridviewDetails;
                    } else if (data.leaveCodeList && Array.isArray(data.leaveCodeList)) {
                        codeList = data.leaveCodeList;
                    } else if (data.leaveList && Array.isArray(data.leaveList)) {
                        codeList = data.leaveList;
                    } else if (data.leaveCodes && Array.isArray(data.leaveCodes)) {
                        codeList = data.leaveCodes;
                    } else if (Array.isArray(data)) {
                        codeList = data;
                    }
                    return {
                        success: true,
                        data: codeList,
                        rawData: data,
                        message: response.message || 'Leave code fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave code');
                }
            },
            enabled: enabled && leavecode !== undefined,
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveCode']
            });
        }
    };
};
/**
 * Hook to fetch departments for leave credit details based on selected employee types
 * This is typically called when employee types are selected to filter departments
 */
export const useLeaveCreditDepartments = (request?: { MI_Id?: number; emptypes?: any[] }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'departments', request?.MI_Id, request?.emptypes],
            queryFn: async () => {
                try {
                    const response = await getLeaveCreditDepartments({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        emptypes: request?.emptypes || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch departments');
                    }
                    // Extract and map department options from API response
                    const data = response.data;
                    // Map DepartmentTempDto to departmentOptions
                    const departmentOptions = (data.DepartmentTempDto || []).map((item: any) => ({
                        label: item.HRMD_DepartmentName || item.label || '',
                        value: String(item.HRMD_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Also check other possible locations
                    if (departmentOptions.length === 0 && data.departmentdropdownlist && Array.isArray(data.departmentdropdownlist)) {
                        const mapped = data.departmentdropdownlist.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    // Check GridviewDetails as fallback
                    if (departmentOptions.length === 0 && data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        const mapped = data.GridviewDetails.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    return {
                        success: true,
                        data: {
                            departmentOptions
                        },
                        rawData: data,
                        message: response.message || 'Departments fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch departments');
                }
            },
            enabled: enabled && (request?.emptypes?.length ?? 0) > 0, // Only fetch when emptypes are provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'departments']
            });
        }
    };
};
/**
 * Hook to fetch designations for leave credit details based on selected employee types
 * This is typically called when employee types are selected to filter designations
 */
export const useLeaveCreditDesignations = (request?: { MI_Id?: number; emptypes?: any[] }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'designations', request?.MI_Id, request?.emptypes],
            queryFn: async () => {
                try {
                    const response = await getLeaveCreditDesignation({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        emptypes: request?.emptypes || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch designations');
                    }
                    // Extract and map designation options from API response
                    const data = response.data;
                    // Map DesignationTempDto to designationOptions
                    const designationOptions = (data.DesignationTempDto || []).map((item: any) => ({
                        label: item.HRMDES_DesignationName || item.label || '',
                        value: String(item.HRMDES_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Also check designationarray
                    if (designationOptions.length === 0 && data.designationarray && Array.isArray(data.designationarray)) {
                        const mapped = data.designationarray.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    // Also check designationdropdownlist as fallback
                    if (designationOptions.length === 0 && data.designationdropdownlist && Array.isArray(data.designationdropdownlist)) {
                        const mapped = data.designationdropdownlist.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    // Check GridviewDetails as fallback
                    if (designationOptions.length === 0 && data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        const mapped = data.GridviewDetails.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    return {
                        success: true,
                        data: {
                            designationOptions
                        },
                        rawData: data,
                        message: response.message || 'Designations fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch designations');
                }
            },
            enabled: enabled && (request?.emptypes?.length ?? 0) > 0, // Only fetch when emptypes are provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'designations']
            });
        }
    };
};
/**
 * Hook to fetch grades for leave credit details based on selected employee types
 * This is typically called when employee types are selected to filter grades
 */
export const useLeaveCreditGrades = (request?: { MI_Id?: number; emptypes?: any[] }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'grades', request?.MI_Id, request?.emptypes],
            queryFn: async () => {
                try {
                    const response = await getLeaveCreditGrade({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        emptypes: request?.emptypes || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch grades');
                    }
                    // Extract and map grade options from API response
                    const data = response.data;
                    // Map GradeTempDto to gradeOptions
                    const gradeOptions = (data.GradeTempDto || []).map((item: any) => ({
                        label: item.HRMG_GradeName || item.HRMG_GradeDisplayName || item.label || '',
                        value: String(item.HRMG_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Also check gradeList
                    if (gradeOptions.length === 0 && data.gradeList && Array.isArray(data.gradeList)) {
                        const mapped = data.gradeList.map((item: any) => ({
                            label: item.HRMG_GradeName || item.HRMG_GradeDisplayName || item.label || item.name || '',
                            value: String(item.HRMG_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            gradeOptions.push(...mapped);
                        }
                    }
                    // Check GridviewDetails as fallback
                    if (gradeOptions.length === 0 && data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        const mapped = data.GridviewDetails.map((item: any) => ({
                            label: item.HRMG_GradeName || item.HRMG_GradeDisplayName || item.label || item.name || '',
                            value: String(item.HRMG_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            gradeOptions.push(...mapped);
                        }
                    }
                    return {
                        success: true,
                        data: {
                            gradeOptions
                        },
                        rawData: data,
                        message: response.message || 'Grades fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch grades');
                }
            },
            enabled: enabled && (request?.emptypes?.length ?? 0) > 0, // Only fetch when emptypes are provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'grades']
            });
        }
    };
};
/**
 * Hook to fetch leave details credit month data
 * This is typically called when HRMLDCM_Id or HRMLDCM_LCMonthCode is provided
 */
export const useLeaveDetailsCreditMonth = (request?: { HRMLDCM_Id?: number; HRMLDCM_LCMonthCode?: string }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveDetailsCreditMonth', request?.HRMLDCM_Id, request?.HRMLDCM_LCMonthCode],
            queryFn: async () => {
                try {
                    const response = await getLeaveDetailsCreditMonth({
                        HRMLDCM_Id: request?.HRMLDCM_Id || 0,
                        HRMLDCM_LCMonthCode: request?.HRMLDCM_LCMonthCode || ''
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave details credit month');
                    }
                    // Extract leave details credit month list from API response
                    const data = response.data;
                    // Map leaveCM, GridviewDetails, creditMonthList, or leaveDetailsCreditMonthList to monthOptions
                    let monthList: any[] = [];
                    if (data.leaveCM && Array.isArray(data.leaveCM)) {
                        monthList = data.leaveCM;
                    } else if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        monthList = data.GridviewDetails;
                    } else if (data.creditMonthList && Array.isArray(data.creditMonthList)) {
                        monthList = data.creditMonthList;
                    } else if (data.leaveDetailsCreditMonthList && Array.isArray(data.leaveDetailsCreditMonthList)) {
                        monthList = data.leaveDetailsCreditMonthList;
                    } else if (Array.isArray(data)) {
                        monthList = data;
                    }
                    // Map to month options format
                    const monthOptions = monthList.map((item: any) => ({
                        id: item.HRMLDCM_Id || item.id || 0,
                        monthCode: item.HRMLDCM_LCMonthCode || item.monthCode || item.monthName || '',
                        monthName: item.HRMLDCM_LCMonthCode || item.monthName || item.monthCode || '',
                        monthId: item.monthId || item.id || 0,
                        HRMLD_Id: item.HRMLD_Id || item.leaveDetailId || 0,
                        HRML_Id: item.HRML_Id || item.leaveId || 0
                    })).filter((item: { id: number; monthCode: string }) => item.id && item.monthCode);
                    return {
                        success: true,
                        data: {
                            monthOptions,
                            monthList
                        },
                        rawData: data,
                        message: response.message || 'Leave details credit month fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave details credit month');
                }
            },
            enabled: enabled && (request?.HRMLDCM_Id !== undefined || !!request?.HRMLDCM_LCMonthCode), // Only fetch when parameters are provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveDetailsCreditMonth']
            });
        }
    };
};
/**
 * Hook to fetch leave details CF (Carry Forward) data
 * This is typically called when HRMLDCF_Id or HRMLDCF_MaxLeaveAplFlg is provided
 */
export const useLeaveDetailsCF = (request?: { HRMLDCF_Id?: number; HRMLDCF_MaxLeaveAplFlg?: boolean }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveDetailsCF', request?.HRMLDCF_Id, request?.HRMLDCF_MaxLeaveAplFlg],
            queryFn: async () => {
                try {
                    const response = await getLeaveDetailsCF({
                        HRMLDCF_Id: request?.HRMLDCF_Id || 0,
                        HRMLDCF_MaxLeaveAplFlg: request?.HRMLDCF_MaxLeaveAplFlg ?? true
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave details CF');
                    }
                    // Extract leave details CF list from API response
                    const data = response.data;
                    // Map leaveCf, GridviewDetails, carryForwardList, or leaveDetailsCFList to cfOptions
                    let cfList: any[] = [];
                    if (data.leaveCf && Array.isArray(data.leaveCf)) {
                        cfList = data.leaveCf;
                    } else if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        cfList = data.GridviewDetails;
                    } else if (data.carryForwardList && Array.isArray(data.carryForwardList)) {
                        cfList = data.carryForwardList;
                    } else if (data.leaveDetailsCFList && Array.isArray(data.leaveDetailsCFList)) {
                        cfList = data.leaveDetailsCFList;
                    } else if (Array.isArray(data)) {
                        cfList = data;
                    }
                    // Map to carry forward options format
                    const cfOptions = cfList.map((item: any) => ({
                        id: item.HRMLDCF_Id || item.id || 0,
                        maxLeaveAplFlg: item.HRMLDCF_MaxLeaveAplFlg ?? item.maxLeaveAplFlg ?? true,
                        maxLeaveCF: item.HRMLDCF_MaxLeaveCF || item.maxLeaveCF || 0,
                        HRMLD_Id: item.HRMLD_Id || item.leaveDetailId || 0,
                        HRML_Id: item.HRML_Id || item.leaveId || 0,
                        monthId: item.monthId || item.id || 0,
                        monthName: item.monthName || ''
                    }));
                    return {
                        success: true,
                        data: {
                            cfOptions,
                            cfList
                        },
                        rawData: data,
                        message: response.message || 'Leave details CF fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave details CF');
                }
            },
            enabled: enabled && request?.HRMLDCF_Id !== undefined, // Only fetch when HRMLDCF_Id is provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveDetailsCF']
            });
        }
    };
};
/**
 * Hook to fetch leave details CF Month (Carry Forward Month) data
 * This is typically called when HRMLDCFM_Id or HRMLDCFM_MonthId is provided
 */
export const useLeaveDetailsCFMonth = (request?: { HRMLDCFM_Id?: number; HRMLDCFM_MonthId?: number }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveDetailsCFMonth', request?.HRMLDCFM_Id, request?.HRMLDCFM_MonthId],
            queryFn: async () => {
                try {
                    const response = await getLeaveDetailsCFMonth({
                        HRMLDCFM_Id: request?.HRMLDCFM_Id || 0,
                        HRMLDCFM_MonthId: request?.HRMLDCFM_MonthId || 0
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave details CF month');
                    }
                    // Extract leave details CF month list from API response
                    const data = response.data;
                    // Map leaveCf, GridviewDetails, carryForwardMonthList, or leaveDetailsCFMonthList to cfMonthOptions
                    let cfMonthList: any[] = [];
                    if (data.leaveCf && Array.isArray(data.leaveCf)) {
                        cfMonthList = data.leaveCf;
                    } else if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        cfMonthList = data.GridviewDetails;
                    } else if (data.carryForwardMonthList && Array.isArray(data.carryForwardMonthList)) {
                        cfMonthList = data.carryForwardMonthList;
                    } else if (data.leaveDetailsCFMonthList && Array.isArray(data.leaveDetailsCFMonthList)) {
                        cfMonthList = data.leaveDetailsCFMonthList;
                    } else if (Array.isArray(data)) {
                        cfMonthList = data;
                    }
                    // Map to carry forward month options format
                    const cfMonthOptions = cfMonthList.map((item: any) => ({
                        id: item.HRMLDCFM_Id || item.id || 0,
                        monthId: item.HRMLDCFM_MonthId || item.monthId || item.id || 0,
                        monthName: item.monthName || item.monthCode || '',
                        monthCode: item.monthCode || item.monthName || '',
                        HRMLDCF_Id: item.HRMLDCF_Id || item.carryForwardId || 0,
                        HRMLD_Id: item.HRMLD_Id || item.leaveDetailId || 0,
                        HRML_Id: item.HRML_Id || item.leaveId || 0
                    }));
                    return {
                        success: true,
                        data: {
                            cfMonthOptions,
                            cfMonthList
                        },
                        rawData: data,
                        message: response.message || 'Leave details CF month fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave details CF month');
                }
            },
            enabled: enabled && (request?.HRMLDCFM_Id !== undefined || request?.HRMLDCFM_MonthId !== undefined), // Only fetch when parameters are provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveDetailsCFMonth']
            });
        }
    };
};
/**
 * Hook to fetch leave details EnCash (Encashment) data
 * This is typically called when encashment details are needed
 */
export const useLeaveDetailsEnCash = (request?: {
    HRMLDEC_Id?: number;
    HRMLDEC_ServiceAplFlg?: boolean;
    HRMLDEC_ServiceYear?: string;
    HRMLDEC_ServiceMonth?: string;
    HRMLDEC_ServiceDays?: string;
    HRMLDEC_MaxLeaveFlg?: boolean;
    HRMLDEC_MaxLeaves?: number;
    HRMLDEC_MinLeaveFlg?: boolean;
    HRMLDEC_MinLeaves?: number;
    HRMLDEC_ScheduleFlg?: string;
    HRMLDEC_ScheduleYear?: string;
    HRMLDEC_ScheduleMonth?: string;
}, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveDetailsEnCash', request?.HRMLDEC_Id, request?.HRMLDEC_ServiceAplFlg],
            queryFn: async () => {
                try {
                    const response = await getLeaveDetailsEnCash({
                        HRMLDEC_Id: request?.HRMLDEC_Id || 0,
                        HRMLDEC_ServiceAplFlg: request?.HRMLDEC_ServiceAplFlg ?? true,
                        HRMLDEC_ServiceYear: request?.HRMLDEC_ServiceYear || '',
                        HRMLDEC_ServiceMonth: request?.HRMLDEC_ServiceMonth || '',
                        HRMLDEC_ServiceDays: request?.HRMLDEC_ServiceDays || '',
                        HRMLDEC_MaxLeaveFlg: request?.HRMLDEC_MaxLeaveFlg ?? true,
                        HRMLDEC_MaxLeaves: request?.HRMLDEC_MaxLeaves || 0,
                        HRMLDEC_MinLeaveFlg: request?.HRMLDEC_MinLeaveFlg ?? true,
                        HRMLDEC_MinLeaves: request?.HRMLDEC_MinLeaves || 0,
                        HRMLDEC_ScheduleFlg: request?.HRMLDEC_ScheduleFlg || '',
                        HRMLDEC_ScheduleYear: request?.HRMLDEC_ScheduleYear || '',
                        HRMLDEC_ScheduleMonth: request?.HRMLDEC_ScheduleMonth || ''
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave details encash');
                    }
                    // Extract leave details encash list from API response
                    const data = response.data;
                    // Map encashList, GridviewDetails, encashmentList, or leaveDetailsEnCashList to encashOptions
                    let encashList: any[] = [];
                    if (data.encashList && Array.isArray(data.encashList)) {
                        encashList = data.encashList;
                    } else if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        encashList = data.GridviewDetails;
                    } else if (data.encashmentList && Array.isArray(data.encashmentList)) {
                        encashList = data.encashmentList;
                    } else if (data.leaveDetailsEnCashList && Array.isArray(data.leaveDetailsEnCashList)) {
                        encashList = data.leaveDetailsEnCashList;
                    } else if (Array.isArray(data)) {
                        encashList = data;
                    }
                    // Map to encashment options format
                    const encashOptions = encashList.map((item: any) => ({
                        id: item.HRMLDEC_Id || item.id || 0,
                        HRMLD_Id: item.HRMLD_Id || item.leaveDetailId || 0,
                        HRML_Id: item.HRML_Id || item.leaveId || 0,
                        serviceAplFlg: item.HRMLDEC_ServiceAplFlg ?? item.serviceAplFlg ?? true,
                        serviceYear: item.HRMLDEC_ServiceYear || item.serviceYear || '',
                        serviceMonth: item.HRMLDEC_ServiceMonth || item.serviceMonth || '',
                        serviceDays: item.HRMLDEC_ServiceDays || item.serviceDays || '',
                        maxLeaveFlg: item.HRMLDEC_MaxLeaveFlg ?? item.maxLeaveFlg ?? true,
                        maxLeaves: item.HRMLDEC_MaxLeaves || item.maxLeaves || 0,
                        minLeaveFlg: item.HRMLDEC_MinLeaveFlg ?? item.minLeaveFlg ?? true,
                        minLeaves: item.HRMLDEC_MinLeaves || item.minLeaves || 0,
                        scheduleFlg: item.HRMLDEC_ScheduleFlg || item.scheduleFlg || '',
                        scheduleYear: item.HRMLDEC_ScheduleYear || item.scheduleYear || '',
                        scheduleMonth: item.HRMLDEC_ScheduleMonth || item.scheduleMonth || '',
                        variableFixedFlg: item.HRMLDEC_VariableFixedFlg ?? item.variableFixedFlg ?? false,
                        fixedAmount: item.HRMLDEC_FixedAmount || item.fixedAmount || 0
                    }));
                    return {
                        success: true,
                        data: {
                            encashOptions,
                            encashList
                        },
                        rawData: data,
                        message: response.message || 'Leave details encash fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave details encash');
                }
            },
            enabled: enabled && request?.HRMLDEC_Id !== undefined, // Only fetch when HRMLDEC_Id is provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leaveDetailsEnCash']
            });
        }
    };
};
// Leave Credit Deduction Hooks
export const useLeaveCreditDeduction = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DEDUCTION],
            queryFn: async () => getLeaveCreditDeduction(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DEDUCTION]
            });
        }
    };
};
export const useSaveLeaveCreditDeduction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (deduction: LeaveCreditDeduction) => addOrUpdateLeaveCreditDeduction(deduction),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DEDUCTION] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save leave credit deduction');
        }
    });
};
export const useUpdateLeaveCreditDeduction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (deduction: LeaveCreditDeduction) => addOrUpdateLeaveCreditDeduction(deduction),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DEDUCTION] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update leave credit deduction');
        }
    });
};
export const useDeleteLeaveCreditDeduction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => deleteLeaveCreditDeduction(id),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DEDUCTION] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete leave credit deduction');
        }
    });
};
// Leave Credit Addition Hooks
export const useLeaveCreditAddition = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_ADDITION],
            queryFn: async () => getLeaveCreditAddition(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_ADDITION]
            });
        }
    };
};
export const useSaveLeaveCreditAddition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (addition: LeaveCreditAddition) => addOrUpdateLeaveCreditAddition(addition),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_ADDITION] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save leave credit addition');
        }
    });
};
export const useUpdateLeaveCreditAddition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (addition: LeaveCreditAddition) => addOrUpdateLeaveCreditAddition(addition),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_ADDITION] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update leave credit addition');
        }
    });
};
export const useDeleteLeaveCreditAddition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => deleteLeaveCreditAddition(id),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_ADDITION] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete leave credit addition');
        }
    });
};
// Leave Carry Forward Hooks
export const useLeaveCarryForward = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CARRYFORWARD],
            queryFn: async () => getLeaveCarryForward(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CARRYFORWARD]
            });
        }
    };
};
export const useSaveLeaveCarryForward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (carryForward: LeaveCarryForward) => addOrUpdateLeaveCarryForward(carryForward),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CARRYFORWARD] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save leave carry forward');
        }
    });
};
export const useUpdateLeaveCarryForward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (carryForward: LeaveCarryForward) => addOrUpdateLeaveCarryForward(carryForward),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CARRYFORWARD] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update leave carry forward');
        }
    });
};
export const useDeleteLeaveCarryForward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => deleteLeaveCarryForward(id),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.LEAVE_CARRYFORWARD] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete leave carry forward');
        }
    });
};
// Comp Off Approval Hooks
export const useCompOffApproval = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.COMP_OFF_APPROVAL],
            queryFn: async () => getCompOffApproval(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.COMP_OFF_APPROVAL]
            });
        }
    };
};
export const useUpdateCompOffApprovalStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, hrStatus, approverRemarks }: { id: number; hrStatus: 'Approved' | 'Rejected'; approverRemarks?: string }) =>
            updateCompOffApprovalStatus(id, hrStatus, approverRemarks),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.COMP_OFF_APPROVAL] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update comp off approval status');
        }
    });
};
// Comp Off Request Hooks
export const useCompOffRequest = (employeeId?: number) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.COMP_OFF_REQUEST, employeeId],
            queryFn: async () => getCompOffRequestData(employeeId),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.COMP_OFF_REQUEST]
            });
        }
    };
};
export const useSubmitCompOffRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (selectedIds: number[]) => submitCompOffRequest(selectedIds),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.COMP_OFF_REQUEST] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to submit comp off request');
        }
    });
};
export const useCancelCompOffRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (selectedIds: number[]) => cancelCompOffRequest(selectedIds),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: [HRMS_QUERY_KEYS.COMP_OFF_REQUEST] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to cancel comp off request');
        }
    });
};
// Leave Transfer Hooks
export const useLeaveTransferBasicData = (request?: { MI_Id?: number }) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER, 'basicData', request?.MI_Id],
            queryFn: async () => {
                try {
                    const response = await getLeaveTransferBasicData({
                        MI_Id: request?.MI_Id || HRMS_MI_ID
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave transfer basic data');
                    }
                    // Extract and map dropdown options from API response
                    const data = response.data;
                    // Map GroupTypeTempDto to typeOptions
                    const typeOptions = (data.GroupTypeTempDto || []).map((item: any) => ({
                        label: item.HRMGT_EmployeeGroupType || item.label || '',
                        value: String(item.HRMGT_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Map DepartmentTempDto to departmentOptions
                    const departmentOptions = (data.DepartmentTempDto || []).map((item: any) => ({
                        label: item.HRMD_DepartmentName || item.label || '',
                        value: String(item.HRMD_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Map DesignationTempDto to designationOptions
                    const designationOptions = (data.DesignationTempDto || []).map((item: any) => ({
                        label: item.HRMDES_DesignationName || item.label || '',
                        value: String(item.HRMDES_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Map leavearrayyear to leaveYearOptions
                    const leaveYearOptions = (data.leavearrayyear || []).map((item: any) => ({
                        label: item.HRMLY_LeaveYear || item.label || '',
                        value: String(item.HRMLY_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Map master_eventlist to leaveNameOptions
                    const leaveNameOptions = (data.master_eventlist || []).map((item: any) => ({
                        label: item.HRML_LeaveName || item.label || '',
                        value: String(item.HRML_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    return {
                        success: true,
                        data: {
                            typeOptions,
                            departmentOptions,
                            designationOptions,
                            leaveYearOptions,
                            leaveNameOptions
                        },
                        message: response.message || 'Leave transfer basic data fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave transfer basic data');
                }
            },
            staleTime: 5 * 60 * 1000 // Cache for 5 minutes
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER]
            });
        }
    };
};
/**
 * Hook to fetch leave OB (Outstanding Balance) data
 * This can be used to fetch employee leave balance data
 */
export const useLeaveOB = (request?: { MI_Id?: number }) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER, 'leaveOB', request?.MI_Id],
            queryFn: async () => {
                try {
                    const response = await getLeaveOB({
                        MI_Id: request?.MI_Id || HRMS_MI_ID
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave OB data');
                    }
                    // Extract leave OB data from response
                    const data = response.data;
                    // The API might return list in GridviewDetails, leaveOBList, or other fields
                    let leaveOBList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        leaveOBList = data.GridviewDetails;
                    } else if (data.leaveOBList && Array.isArray(data.leaveOBList)) {
                        leaveOBList = data.leaveOBList;
                    } else if (data.employeeList && Array.isArray(data.employeeList)) {
                        leaveOBList = data.employeeList;
                    } else if (data.leaveBalanceList && Array.isArray(data.leaveBalanceList)) {
                        leaveOBList = data.leaveBalanceList;
                    } else if (Array.isArray(data)) {
                        leaveOBList = data;
                    }
                    return {
                        success: true,
                        data: leaveOBList,
                        rawData: data,
                        message: response.message || 'Leave OB data fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave OB data');
                }
            },
            staleTime: 0 // Don't cache as this might be filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER, 'leaveOB']
            });
        }
    };
};
/**
 * Hook to fetch departments based on selected employee types
 * This is typically called when employee types are selected to filter departments
 */
export const useDepartments = (request?: { MI_Id?: number; emptypes?: any[] }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER, 'departments', request?.MI_Id, request?.emptypes],
            queryFn: async () => {
                try {
                    const response = await getDepartments({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        emptypes: request?.emptypes || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch departments');
                    }
                    // Extract and map department options from API response
                    const data = response.data;
                    // Map DepartmentTempDto to departmentOptions
                    const departmentOptions = (data.DepartmentTempDto || []).map((item: any) => ({
                        label: item.HRMD_DepartmentName || item.label || '',
                        value: String(item.HRMD_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Also check other possible locations
                    if (departmentOptions.length === 0 && data.departmentdropdownlist && Array.isArray(data.departmentdropdownlist)) {
                        const mapped = data.departmentdropdownlist.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    return {
                        success: true,
                        data: {
                            departmentOptions
                        },
                        rawData: data,
                        message: response.message || 'Departments fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch departments');
                }
            },
            enabled: enabled && (request?.emptypes?.length ?? 0) > 0, // Only fetch when emptypes are provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER, 'departments']
            });
        }
    };
};
/**
 * Hook to fetch designations based on selected employee types
 * This is typically called when employee types are selected to filter designations
 */
export const useDesignations = (request?: { MI_Id?: number; emptypes?: any[] }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER, 'designations', request?.MI_Id, request?.emptypes],
            queryFn: async () => {
                try {
                    const response = await getDesignation({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        emptypes: request?.emptypes || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch designations');
                    }
                    // Extract and map designation options from API response
                    const data = response.data;
                    // Map DesignationTempDto to designationOptions
                    const designationOptions = (data.DesignationTempDto || []).map((item: any) => ({
                        label: item.HRMDES_DesignationName || item.label || '',
                        value: String(item.HRMDES_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Also check designationarray
                    if (designationOptions.length === 0 && data.designationarray && Array.isArray(data.designationarray)) {
                        const mapped = data.designationarray.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    // Also check designationdropdownlist as fallback
                    if (designationOptions.length === 0 && data.designationdropdownlist && Array.isArray(data.designationdropdownlist)) {
                        const mapped = data.designationdropdownlist.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    return {
                        success: true,
                        data: {
                            designationOptions
                        },
                        rawData: data,
                        message: response.message || 'Designations fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch designations');
                }
            },
            enabled: enabled && (request?.emptypes?.length ?? 0) > 0, // Only fetch when emptypes are provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER, 'designations']
            });
        }
    };
};
/**
 * Hook to save leave transfer details
 */
export const useSaveLeaveTransferDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {
            MI_Id?: number;
            HRME_SubstituteFlag: string;
            HRELAP_Id: number;
            HRML_Id: number;
            monthid: number;
            yearid: number;
            emplist: Array<{
                HRME_Id: number;
                HRELS_CreditedLeaves: number;
                HRELS_TotalLeaves: number;
                HRELS_Id: number;
                HRELS_CBLeaves: number;
                HRMLY_Id: number;
                HRML_Id: number;
            }>;
            UserId: string;
            HRELS_Id: number;
            HRME_Id: number;
            HRELS_OBLeaves: number;
            HRELS_CreditedLeaves: number;
            HRELS_TotalLeaves: number;
            HRELS_TransLeaves: number;
            HRMLY_Id: number;
            HRELS_EncashedLeaves: number;
            HRELS_CBLeaves: number;
        }) => {
            try {
                const response = await saveLeaveTransferDetails(data as any);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to save leave transfer details');
                }
                return {
                    success: true,
                    message: response.message || 'Leave transfer details saved successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to save leave transfer details');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to save leave transfer details');
        }
    });
};
/**
 * Hook to process leave carry forward for Leave Transfer
 */
export const useProcessLeaveTransferCarryForward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {
            MI_Id?: number;
            emplist: Array<{
                HRME_Id: number;
                HRELS_CreditedLeaves: number;
                HRELS_TotalLeaves: number;
                HRELS_Id: number;
                HRELS_CBLeaves: number;
                HRMLY_Id: number;
                HRML_Id: number;
            }>;
        }) => {
            try {
                const response = await leaveCarryForward(data as any);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to process leave carry forward');
                }
                return {
                    success: true,
                    message: response.message || 'Leave carry forward processed successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to process leave carry forward');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to process leave carry forward');
        }
    });
};
/**
 * Hook to delete leave transfer record
 */
export const useDeleteLeaveTransfer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (HRELS_Id: number) => {
            try {
                const response = await deleteLeaveTransfer({ HRELS_Id });
                if (!response.success) {
                    throw new Error(response.message || 'Failed to delete leave transfer');
                }
                return {
                    success: true,
                    message: response.message || 'Leave transfer deleted successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to delete leave transfer');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_TRANSFER]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            // Error message from API is already in error.message
            toast.error(error.message || 'Failed to delete leave transfer');
        }
    });
};
// Leave Opening Balance Hooks
/**
 * Hook to fetch leave opening balance data
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetLeaveOB
 */
export const useLeaveOpeningBalance = (request?: { MI_Id?: number }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, request?.MI_Id],
            queryFn: async () => {
                try {
                    const response = await getLeaveOpeningBalanceOB({
                        MI_Id: request?.MI_Id || HRMS_MI_ID
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave opening balance');
                    }
                    // Extract leave opening balance list from API response
                    const data = response.data;
                    // Map GridviewDetails, leaveOBList, openingBalanceList, or leaveOpeningBalanceList to obList
                    let obList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        obList = data.GridviewDetails;
                    } else if (data.leaveOBList && Array.isArray(data.leaveOBList)) {
                        obList = data.leaveOBList;
                    } else if (data.openingBalanceList && Array.isArray(data.openingBalanceList)) {
                        obList = data.openingBalanceList;
                    } else if (data.leaveOpeningBalanceList && Array.isArray(data.leaveOpeningBalanceList)) {
                        obList = data.leaveOpeningBalanceList;
                    } else if (Array.isArray(data)) {
                        obList = data;
                    }
                    // Map to leave opening balance format
                    const openingBalanceList = obList.map((item: any) => ({
                        id: item.HREOBL_Id || item.id || 0,
                        employeeId: item.HRME_Id || item.employeeId || 0,
                        employeeCode: item.HRME_EmployeeCode || item.employeeCode || '',
                        employeeName: `${item.HRME_EmployeeFirstName || ''} ${item.HRME_EmployeeMiddleName || ''} ${item.HRME_EmployeeLastName || ''}`.trim() || item.employeeName || '',
                        leaveId: item.HRML_Id || item.leaveId || 0,
                        leaveName: item.HRML_LeaveName || item.leaveName || '',
                        leaveCode: item.HRML_LeaveCode || item.leaveCode || '',
                        obDate: item.HREOBL_Date || item.obDate || '',
                        obLeaves: item.HREOBL_OBLeaves || item.obLeaves || 0,
                        departmentId: item.HRMD_Id || item.departmentId || 0,
                        departmentName: item.HRMD_DepartmentName || item.departmentName || '',
                        designationId: item.HRMDES_Id || item.designationId || 0,
                        designationName: item.HRMDES_DesignationName || item.designationName || '',
                        leaveYearId: item.HRMLY_Id || item.leaveYearId || 0,
                        leaveYear: item.HRMLY_LeaveYear || item.leaveYear || ''
                    }));
                    return {
                        success: true,
                        data: {
                            openingBalanceList
                        },
                        rawData: data,
                        message: response.message || 'Leave opening balance fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave opening balance');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined, // Only fetch when MI_Id is provided
            staleTime: 0 // Don't cache as this might be filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE]
            });
        }
    };
};
/**
 * Hook to fetch departments for leave opening balance
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetDepartments
 */
export const useLeaveOpeningBalanceDepartments = (request?: { MI_Id?: number }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'departments', request?.MI_Id],
            queryFn: async () => {
                try {
                    const response = await getLeaveOpeningBalanceDepartments({
                        MI_Id: request?.MI_Id || HRMS_MI_ID
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch departments');
                    }
                    // Extract and map department options from API response
                    const data = response.data;
                    // Map DepartmentTempDto to departmentOptions
                    const departmentOptions = (data.DepartmentTempDto || []).map((item: any) => ({
                        label: item.HRMD_DepartmentName || item.label || '',
                        value: String(item.HRMD_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Also check other possible locations
                    if (departmentOptions.length === 0 && data.departmentdropdownlist && Array.isArray(data.departmentdropdownlist)) {
                        const mapped = data.departmentdropdownlist.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    // Check GridviewDetails as fallback
                    if (departmentOptions.length === 0 && data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        const mapped = data.GridviewDetails.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    // Check departmentList or departments as fallback
                    if (departmentOptions.length === 0 && data.departmentList && Array.isArray(data.departmentList)) {
                        const mapped = data.departmentList.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    if (departmentOptions.length === 0 && data.departments && Array.isArray(data.departments)) {
                        const mapped = data.departments.map((item: any) => ({
                            label: item.HRMD_DepartmentName || item.label || item.name || '',
                            value: String(item.HRMD_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            departmentOptions.push(...mapped);
                        }
                    }
                    return {
                        success: true,
                        data: {
                            departmentOptions
                        },
                        rawData: data,
                        message: response.message || 'Departments fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch departments');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined, // Only fetch when MI_Id is provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'departments']
            });
        }
    };
};
/**
 * Hook to fetch designations for leave opening balance
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetDesignation
 */
export const useLeaveOpeningBalanceDesignation = (request?: { MI_Id?: number }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'designations', request?.MI_Id],
            queryFn: async () => {
                try {
                    const response = await getLeaveOpeningBalanceDesignation({
                        MI_Id: request?.MI_Id || HRMS_MI_ID
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch designations');
                    }
                    // Extract and map designation options from API response
                    const data = response.data;
                    // Map DesignationTempDto to designationOptions
                    const designationOptions = (data.DesignationTempDto || []).map((item: any) => ({
                        label: item.HRMDES_DesignationName || item.label || '',
                        value: String(item.HRMDES_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    // Also check other possible locations
                    if (designationOptions.length === 0 && data.designationdropdownlist && Array.isArray(data.designationdropdownlist)) {
                        const mapped = data.designationdropdownlist.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    // Check GridviewDetails as fallback
                    if (designationOptions.length === 0 && data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        const mapped = data.GridviewDetails.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    // Check designationList or designations as fallback
                    if (designationOptions.length === 0 && data.designationList && Array.isArray(data.designationList)) {
                        const mapped = data.designationList.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    if (designationOptions.length === 0 && data.designations && Array.isArray(data.designations)) {
                        const mapped = data.designations.map((item: any) => ({
                            label: item.HRMDES_DesignationName || item.label || item.name || '',
                            value: String(item.HRMDES_Id || item.value || item.id || '')
                        })).filter((item: { label: string; value: string }) => item.label && item.value);
                        if (mapped.length > 0) {
                            designationOptions.push(...mapped);
                        }
                    }
                    return {
                        success: true,
                        data: {
                            designationOptions
                        },
                        rawData: data,
                        message: response.message || 'Designations fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch designations');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined, // Only fetch when MI_Id is provided
            staleTime: 0 // Don't cache as this is filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'designations']
            });
        }
    };
};
/**
 * Hook to fetch OB (Opening Balance) details
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetOBDetails
 */
export const useOBDetails = (request?: { MI_Id?: number }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'ob-details', request?.MI_Id],
            queryFn: async () => {
                try {
                    const response = await getOBDetails({
                        MI_Id: request?.MI_Id || HRMS_MI_ID
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch OB details');
                    }
                    // Extract OB details list from API response
                    const data = response.data;
                    // Map GridviewDetails, obDetailsList, openingBalanceDetailsList, or detailsList to obDetailsList
                    let obDetailsList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        obDetailsList = data.GridviewDetails;
                    } else if (data.obDetailsList && Array.isArray(data.obDetailsList)) {
                        obDetailsList = data.obDetailsList;
                    } else if (data.openingBalanceDetailsList && Array.isArray(data.openingBalanceDetailsList)) {
                        obDetailsList = data.openingBalanceDetailsList;
                    } else if (data.detailsList && Array.isArray(data.detailsList)) {
                        obDetailsList = data.detailsList;
                    } else if (Array.isArray(data)) {
                        obDetailsList = data;
                    }
                    // Map to OB details format
                    const detailsList = obDetailsList.map((item: any) => ({
                        id: item.HREOBL_Id || item.id || 0,
                        employeeId: item.HRME_Id || item.employeeId || 0,
                        employeeCode: item.HRME_EmployeeCode || item.employeeCode || '',
                        employeeName: `${item.HRME_EmployeeFirstName || ''} ${item.HRME_EmployeeMiddleName || ''} ${item.HRME_EmployeeLastName || ''}`.trim() || item.employeeName || '',
                        leaveId: item.HRML_Id || item.leaveId || 0,
                        leaveName: item.HRML_LeaveName || item.leaveName || '',
                        leaveCode: item.HRML_LeaveCode || item.leaveCode || '',
                        obDate: item.HREOBL_Date || item.obDate || '',
                        obLeaves: item.HREOBL_OBLeaves || item.obLeaves || 0,
                        departmentId: item.HRMD_Id || item.departmentId || 0,
                        departmentName: item.HRMD_DepartmentName || item.departmentName || '',
                        designationId: item.HRMDES_Id || item.designationId || 0,
                        designationName: item.HRMDES_DesignationName || item.designationName || '',
                        leaveYearId: item.HRMLY_Id || item.leaveYearId || 0,
                        leaveYear: item.HRMLY_LeaveYear || item.leaveYear || ''
                    }));
                    return {
                        success: true,
                        data: {
                            detailsList
                        },
                        rawData: data,
                        message: response.message || 'OB details fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch OB details');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined, // Only fetch when MI_Id is provided
            staleTime: 0 // Don't cache as this might be filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'ob-details']
            });
        }
    };
};
/**
 * Hook to fetch employee opening balance data
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetEmployeOB
 */
export const useEmployeOB = (request?: { MI_Id?: number; emptypes?: any[]; empdept?: any[]; empdesg?: any[] }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'employee-ob', request?.MI_Id, request?.emptypes, request?.empdept, request?.empdesg],
            queryFn: async () => {
                try {
                    const response = await getEmployeOB({
                        MI_Id: request?.MI_Id || HRMS_MI_ID,
                        emptypes: request?.emptypes || [],
                        empdept: request?.empdept || [],
                        empdesg: request?.empdesg || []
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch employee OB');
                    }
                    // Extract employee OB list from API response
                    const data = response.data;
                    // Map GridviewDetails, employeeOBList, employeOBList, or employeeList to employeeOBList
                    let employeeOBList: any[] = [];
                    if (data.GridviewDetails && Array.isArray(data.GridviewDetails)) {
                        employeeOBList = data.GridviewDetails;
                    } else if (data.employeeOBList && Array.isArray(data.employeeOBList)) {
                        employeeOBList = data.employeeOBList;
                    } else if (data.employeOBList && Array.isArray(data.employeOBList)) {
                        employeeOBList = data.employeOBList;
                    } else if (data.employeeList && Array.isArray(data.employeeList)) {
                        employeeOBList = data.employeeList;
                    } else if (Array.isArray(data)) {
                        employeeOBList = data;
                    }
                    // Map to employee OB format
                    const mappedEmployeeOBList = employeeOBList.map((item: any) => ({
                        id: item.HREOBL_Id || item.id || 0,
                        employeeId: item.HRME_Id || item.employeeId || 0,
                        employeeCode: item.HRME_EmployeeCode || item.employeeCode || '',
                        employeeName: `${item.HRME_EmployeeFirstName || ''} ${item.HRME_EmployeeMiddleName || ''} ${item.HRME_EmployeeLastName || ''}`.trim() || item.employeeName || '',
                        leaveId: item.HRML_Id || item.leaveId || 0,
                        leaveName: item.HRML_LeaveName || item.leaveName || '',
                        leaveCode: item.HRML_LeaveCode || item.leaveCode || '',
                        leaveOBName: item.leave_ob_name || item.leaveOBName || '',
                        obDate: item.HREOBL_Date || item.obDate || '',
                        obLeaves: item.HREOBL_OBLeaves || item.obLeaves || 0,
                        departmentId: item.HRMD_Id || item.departmentId || 0,
                        departmentName: item.HRMD_DepartmentName || item.departmentName || '',
                        designationId: item.HRMDES_Id || item.designationId || 0,
                        designationName: item.HRMDES_DesignationName || item.designationName || '',
                        leaveYearId: item.HRMLY_Id || item.leaveYearId || 0,
                        leaveYear: item.HRMLY_LeaveYear || item.leaveYear || ''
                    }));
                    // Also extract filter dropdowns if available
                    const dataAny = data as any;
                    const departmentOptions = (dataAny.DepartmentTempDto || []).map((item: any) => ({
                        label: item.HRMD_DepartmentName || item.label || '',
                        value: String(item.HRMD_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    const designationOptions = (dataAny.DesignationTempDto || []).map((item: any) => ({
                        label: item.HRMDES_DesignationName || item.label || '',
                        value: String(item.HRMDES_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    const groupTypeOptions = (dataAny.GroupTypeTempDto || []).map((item: any) => ({
                        label: item.HRMGT_EmployeeGroupType || item.label || '',
                        value: String(item.HRMGT_Id || item.value || '')
                    })).filter((item: { label: string; value: string }) => item.label && item.value);
                    return {
                        success: true,
                        data: {
                            employeeOBList: mappedEmployeeOBList,
                            departmentOptions,
                            designationOptions,
                            groupTypeOptions,
                            emptypes: dataAny.emptypes || [],
                            empdept: dataAny.empdept || [],
                            empdesg: dataAny.empdesg || []
                        },
                        rawData: data,
                        message: response.message || 'Employee OB fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch employee OB');
                }
            },
            enabled: enabled && request?.MI_Id !== undefined, // Only fetch when MI_Id is provided
            staleTime: 0 // Don't cache as this might be filter-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'employee-ob']
            });
        }
    };
};
/**
 * Hook to save leave opening balance data
 * POST /api/LeaveOpeningBalanceWrapperFacade/Save
 */
export const useSaveLeaveOpeningBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { MI_Id?: number; HRME_Id?: number; HRMLY_Id?: number; temp_table_data?: any[];[key: string]: any }) => {
            try {
                const response = await saveLeaveOpeningBalance({
                    MI_Id: data.MI_Id || HRMS_MI_ID,
                    HRME_Id: data.HRME_Id || 0,
                    HRMLY_Id: data.HRMLY_Id || 0,
                    temp_table_data: data.temp_table_data || [],
                    ...data // Include any additional fields
                });
                if (!response.success) {
                    throw new Error(response.message || 'Failed to save leave opening balance');
                }
                return {
                    success: true,
                    message: response.message || 'Leave opening balance saved successfully',
                    data: response.data
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to save leave opening balance');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save leave opening balance');
        }
    });
};
/**
 * Hook to delete leave opening balance record
 * POST /api/LeaveOpeningBalanceWrapperFacade/DeletePages
 */
export const useDeleteLeaveOpeningBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { HREOBL_Id: number }) => {
            try {
                const response = await deleteLeaveOpeningBalance({ HREOBL_Id: data.HREOBL_Id || 0 });
                if (!response.success) {
                    throw new Error(response.message || 'Failed to delete leave opening balance');
                }
                return {
                    success: true,
                    message: response.message || 'Leave opening balance deleted successfully'
                };
            } catch (error: any) {
                throw new Error(error?.message || 'Failed to delete leave opening balance');
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete leave opening balance');
        }
    });
};
/**
 * Hook to fetch page details for leave opening balance
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetPageDetails
 */
export const useLeaveOpeningBalancePageDetails = (request?: { Id?: number }, enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'page-details', request?.Id],
            queryFn: async () => {
                try {
                    const response = await getLeaveOpeningBalancePageDetails({
                        Id: request?.Id || 0
                    });
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch page details');
                    }
                    // Extract page details from API response
                    const data = response.data;
                    // Map pageDetails, details, data, or first item from GridviewDetails
                    let pageDetails: any = null;
                    if (data.pageDetails) {
                        pageDetails = data.pageDetails;
                    } else if (data.details) {
                        pageDetails = data.details;
                    } else if (data.data) {
                        pageDetails = data.data;
                    } else if (data.GridviewDetails && Array.isArray(data.GridviewDetails) && data.GridviewDetails.length > 0) {
                        pageDetails = data.GridviewDetails[0];
                    }
                    // Map to page details format
                    const mappedPageDetails = pageDetails ? {
                        id: pageDetails.HREOBL_Id || pageDetails.id || 0,
                        employeeId: pageDetails.HRME_Id || pageDetails.employeeId || 0,
                        employeeCode: pageDetails.HRME_EmployeeCode || pageDetails.employeeCode || '',
                        employeeName: `${pageDetails.HRME_EmployeeFirstName || ''} ${pageDetails.HRME_EmployeeMiddleName || ''} ${pageDetails.HRME_EmployeeLastName || ''}`.trim() || pageDetails.employeeName || '',
                        leaveId: pageDetails.HRML_Id || pageDetails.leaveId || 0,
                        leaveName: pageDetails.HRML_LeaveName || pageDetails.leaveName || '',
                        leaveCode: pageDetails.HRML_LeaveCode || pageDetails.leaveCode || '',
                        leaveYearId: pageDetails.HRMLY_Id || pageDetails.leaveYearId || 0,
                        leaveYear: pageDetails.HRMLY_LeaveYear || pageDetails.leaveYear || '',
                        obDate: pageDetails.HREOBL_Date || pageDetails.obDate || '',
                        obLeaves: pageDetails.HREOBL_OBLeaves || pageDetails.obLeaves || 0,
                        leaveOBName: pageDetails.leave_ob_name || pageDetails.leaveOBName || '',
                        departmentId: pageDetails.HRMD_Id || pageDetails.departmentId || 0,
                        departmentName: pageDetails.HRMD_DepartmentName || pageDetails.departmentName || '',
                        designationId: pageDetails.HRMDES_Id || pageDetails.designationId || 0,
                        designationName: pageDetails.HRMDES_DesignationName || pageDetails.designationName || ''
                    } : null;
                    return {
                        success: true,
                        data: {
                            pageDetails: mappedPageDetails
                        },
                        rawData: data,
                        message: response.message || 'Page details fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch page details');
                }
            },
            enabled: enabled && request?.Id !== undefined && request?.Id !== 0, // Only fetch when Id is provided and not 0
            staleTime: 0 // Don't cache as this is ID-dependent
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_OPENING_BALANCE, 'page-details']
            });
        }
    };
};

/**
 * Hook to fetch leave names for dropdown
 * GET /api/LeaveCredit/get_leave_name_dropdown
 */
export const useLeaveNameDropdown = (enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leave-name-dropdown'],
            queryFn: async () => {
                try {
                    const response = await getLeaveNameDropdown();
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch leave names');
                    }
                    // Map items to expected format
                    const leaveNameOptions = (response.data || []).map((item) => ({
                        id: item.hrmL_Id,
                        name: item.hrmL_LeaveName,
                        code: item.hrmL_LeaveCode,
                        details: item.hrmL_LeaveDetails,
                        creditFlg: item.hrmL_LeaveCreditFlg,
                        type: item.hrmL_LeaveType
                    }));
                    return {
                        success: true,
                        data: leaveNameOptions,
                        rawData: response.data,
                        message: response.message || 'Leave names fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch leave names');
                }
            },
            enabled: enabled,
            staleTime: 5 * 60 * 1000 // Cache for 5 minutes
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'leave-name-dropdown']
            });
        }
    };
};

/**
 * Hook to fetch credit months for dropdown
 * GET /api/LeaveCredit/get_creditmonth_dropdown
 */
export const useCreditMonthDropdown = (enabled: boolean = true) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'credit-month-dropdown'],
            queryFn: async () => {
                try {
                    const response = await getCreditMonthDropdown();
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Failed to fetch credit months');
                    }
                    // Map items to expected format
                    const creditMonthOptions = (response.data || []).map((item) => ({
                        id: item.ivrM_Month_Id,
                        name: item.ivrM_Month_Name
                    }));
                    return {
                        success: true,
                        data: creditMonthOptions,
                        rawData: response.data,
                        message: response.message || 'Credit months fetched successfully'
                    };
                } catch (error: any) {
                    throw new Error(error?.message || 'Failed to fetch credit months');
                }
            },
            enabled: enabled,
            staleTime: 5 * 60 * 1000 // Cache for 5 minutes
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.LEAVE_CREDIT_DETAILS, 'credit-month-dropdown']
            });
        }
    };
};

