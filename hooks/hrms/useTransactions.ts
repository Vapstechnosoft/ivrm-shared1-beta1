'use client';
/**
 * Unified HRMS Transaction Hooks
 * All transaction-related hooks consolidated in one file
 */
import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import {
    activateDeactivateEmployeeLoan,
    getEmployeeLoanById,
    getEmployeeLoanByEmployee,
    getEmployeeLoanGrid,
    getEmployeeLoanMasters,
    saveEmployeeLoan
} from '@/server/hrms/hrmsConfig/transaction/employee-loan';
import {
    addOrUpdateSalaryAdvance,
    getEmployeeSalaryAdvanceDetails,
    getSalaryAdvanceEmployeeDropdown,
    getSalaryAdvanceGrid,
    toggleSalaryAdvance
} from '@/server/hrms/hrmsConfig/transaction/salary-advance';
import { approveSalaries, getSalaryApprovalOnload, searchSalaryApprovalEmployees } from '@/server/hrms/hrmsConfig/transaction/salary-approval';
import {
    calculateEmployeeSalary,
    generateSalaryForSelectedEmployees,
    getSalaryCalculationOnload,
    searchEmployeesBySelection,
    searchSalaryCalculationBySelection
} from '@/server/hrms/hrmsConfig/transaction/salary-calculation';
import { deleteSalaryIncrement, getSalaryIncrementOnload, saveSalaryIncrement } from '@/server/hrms/hrmsConfig/transaction/salary-increment';
import { deleteSalaryUpdation, filterSalaryUpdationEmployees, getSalaryUpdationDepartments, getSalaryUpdationDesignations, getSalaryUpdationEmployeeDetailsBySelection, getSalaryUpdationList, getSalaryUpdationOnload, saveSalaryUpdation, updateEmployeesEarningsAndDeductions } from '@/server/hrms/hrmsConfig/transaction/salary-updation';
import { getEmployeeDetailsBySelection, getMassUpdationDepartments, getMassUpdationDesignations, getMassUpdationOnload, saveMassUpdation, searchMassUpdationEmployees } from '@/server/hrms/hrmsConfig/transaction/mass-updation';
import type {
    EmployeeDetailsResponse,
    EmployeeLoanDeleteRequest,
    EmployeeLoanGridResponse,
    EmployeeLoanMastersResponse,
    EmployeeLoanOnloadRequest,
    EmployeeLoanOnloadResponse,
    EmployeeLoanSaveRequest,
    EmployeeLoanSaveResponse
} from '@/types/hrms/employee-loan';
import type {
    SalaryAdvanceEmployeeDropdownItem,
    SalaryAdvanceGridItem,
    SalaryAdvanceSaveRequest,
    SalaryAdvanceDetailsRequest,
    EmployeeSalaryAdvanceDetails
} from '@/types/hrms/salary-advance';
import type {
    SalaryApprovalOnloadRequest,
    SalaryApprovalOnloadResponse,
    SalaryApprovalRequest,
    SalaryApprovalResponse,
    SalaryApprovalSearchRequest,
    SalaryApprovalSearchResponse
} from '@/types/hrms/salary-approval';
import type {
    SalaryCalculationGenerateRequest,
    SalaryCalculationGenerateResponse,
    SalaryCalculationOnloadRequest,
    SalaryCalculationOnloadResponse,
    SalaryCalculationSearchRequest,
    NewSalaryCalculationSearchRequest,
    NewSalaryCalculationGenerateRequest,
    SelectionEmployee,
    ApiResponse
} from '@/types/hrms/salary-calculation';
import type {
    SalaryIncrementDeleteRequest,
    SalaryIncrementDeleteResponse,
    SalaryIncrementOnloadRequest,
    SalaryIncrementOnloadResponse,
    SalaryIncrementSaveRequest,
    SalaryIncrementSaveResponse
} from '@/types/hrms/salary-increment';
import type {
    SalaryUpdationDeleteRequest,
    SalaryUpdationDepartmentRequest,
    SalaryUpdationDepartmentResponse,
    SalaryUpdationDesignationRequest,
    SalaryUpdationDesignationResponse,
    SalaryUpdationEmployeeDetailsRequest,
    SalaryUpdationEmployeeDetailsResponse,
    SalaryUpdationFilterRequest,
    SalaryUpdationOnloadRequest,
    SalaryUpdationOnloadResponse,
    SalaryUpdationSaveRequest,
    SalaryUpdationSaveResponse
} from '@/types/hrms/salary-updation';
import type {
    MassUpdationOnloadRequest,
    MassUpdationOnloadResponse,
    MassUpdationSaveRequest,
    MassUpdationSaveResponse,
    MassUpdationSearchRequest
} from '@/types/hrms/mass-updation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
// ============================================================================
// EMPLOYEE LOAN
// ============================================================================
export function useEmployeeLoanMasters(payload: EmployeeLoanOnloadRequest) {
    return useQuery<EmployeeLoanMastersResponse, Error>({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LOAN_LIST, 'masters', payload], // Using same base key to keep unrelated cache clear simple
        queryFn: () =>
            getEmployeeLoanMasters(payload).then((res: any) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 5,
        enabled: !!(payload.MIID || payload.roleId)
    });
}

export function useEmployeeLoanGrid(payload: EmployeeLoanOnloadRequest) {
    return useQuery<EmployeeLoanGridResponse, Error>({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LOAN_LIST, 'grid', payload],
        queryFn: () =>
            getEmployeeLoanGrid(payload).then((res: any) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 1, // Short stale time for list data
        enabled: true
    });
}

export function useSaveEmployeeLoan() {
    const queryClient = useQueryClient();
    return useMutation<EmployeeLoanSaveResponse, Error, EmployeeLoanSaveRequest>({
        mutationFn: (data: EmployeeLoanSaveRequest) =>
            saveEmployeeLoan(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res;
            }),
        onSuccess: (data, variables) => {
            toast.success(
                data.message ||
                (variables.HREL_Id === 0 ? 'Employee loan created successfully!' : 'Employee loan updated successfully!')
            );
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LOAN_LIST]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save employee loan.');
        }
    });
}
export function useGetEmployeeLoanById(id: number) {
    return useQuery<EmployeeLoanOnloadResponse, Error>({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LOAN_LIST, 'by-id', id],
        queryFn: () =>
            getEmployeeLoanById(id).then((res: any) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 5,
        enabled: !!id && id > 0
    });
}
export function useGetEmployeeLoanByEmployee(employeeId: number) {
    return useQuery<EmployeeDetailsResponse, Error>({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LOAN_LIST, 'by-employee', employeeId],
        queryFn: () =>
            getEmployeeLoanByEmployee(employeeId).then((res: any) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 5,
        enabled: !!employeeId && employeeId > 0
    });
}
export function useDeleteEmployeeLoan() {
    const queryClient = useQueryClient();
    return useMutation<any, Error, EmployeeLoanDeleteRequest>({
        mutationFn: async (_data: EmployeeLoanDeleteRequest) => ({}) as any,
        onSuccess: () => {
            toast.success('Employee loan deleted successfully!');
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LOAN_LIST]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete employee loan.');
        }
    });
}
export function useActivateDeactivateEmployeeLoan() {
    const queryClient = useQueryClient();
    return useMutation<any, Error, EmployeeLoanDeleteRequest>({
        mutationFn: (data: EmployeeLoanDeleteRequest) =>
            activateDeactivateEmployeeLoan(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LOAN_LIST]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update employee loan status.');
        }
    });
}
// ============================================================================
// SALARY ADVANCE
// ============================================================================

export function useSalaryAdvanceGrid(pageSize: number = 100) {
    return useQuery<SalaryAdvanceGridItem[], Error>({
        queryKey: [HRMS_QUERY_KEYS.SALARY_ADVANCE_LIST, 'grid', pageSize],
        queryFn: () =>
            getSalaryAdvanceGrid(pageSize).then((res: any) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 5
    });
}

export function useSalaryAdvanceEmployeeDropdown() {
    return useQuery<SalaryAdvanceEmployeeDropdownItem[], Error>({
        queryKey: [HRMS_QUERY_KEYS.SALARY_ADVANCE_LIST, 'employee-dropdown'],
        queryFn: () =>
            getSalaryAdvanceEmployeeDropdown().then((res: any) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 10
    });
}

export function useSaveSalaryAdvance() {
    const queryClient = useQueryClient();
    return useMutation<any, Error, SalaryAdvanceSaveRequest>({
        mutationFn: (data: SalaryAdvanceSaveRequest) =>
            addOrUpdateSalaryAdvance(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_ADVANCE_LIST]
            });
            toast.success(variables.HRESA_Id === 0 ? 'Salary advance created successfully!' : 'Salary advance updated successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save salary advance.');
        }
    });
}

export function useToggleSalaryAdvance() {
    const queryClient = useQueryClient();
    return useMutation<any, Error, number>({
        mutationFn: (hresaId: number) =>
            toggleSalaryAdvance(hresaId).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_ADVANCE_LIST]
            });
            toast.success('Salary advance status updated successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update salary advance status.');
        }
    });
}

export function useEmployeeSalaryAdvanceDetails(params: SalaryAdvanceDetailsRequest) {
    return useQuery<EmployeeSalaryAdvanceDetails, Error>({
        queryKey: [HRMS_QUERY_KEYS.SALARY_ADVANCE_LIST, 'details', params],
        queryFn: () =>
            getEmployeeSalaryAdvanceDetails(params).then((res: any) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 5,
        enabled: !!params.HRME_Id
    });
}

// Legacy Aliases for compatibility
export const useSalaryAdvanceList = (payload: any) => useSalaryAdvanceGrid();
export const useToggleSalaryAdvanceStatus = () => {
    const mutation = useToggleSalaryAdvance();
    return {
        ...mutation,
        mutate: (data: { hresaId: number; activeFlag?: boolean }, options?: any) =>
            mutation.mutate(data.hresaId, options),
        mutateAsync: (data: { hresaId: number; activeFlag?: boolean }, options?: any) =>
            mutation.mutateAsync(data.hresaId, options)
    };
};
export const useGetSalaryAdvanceById = (id: number) => {
    // This would need a specific server action if the grid doesn't suffice
    return useSalaryAdvanceGrid();
};
export const useGetSalaryAdvanceDetailsByEmployee = (employeeId: number) => {
    return useEmployeeSalaryAdvanceDetails({
        HRME_Id: employeeId,
        HRESA_Id: 0,
        HRESA_EntryDate: new Date().toISOString()
    });
};
export const useSearchSalaryAdvanceFilter = (miId: number, searchFilter: string) => useSalaryAdvanceGrid();
// ============================================================================
// SALARY APPROVAL
// ============================================================================
export function useSalaryApprovalOnload(payload: SalaryApprovalOnloadRequest) {
    return useQuery<SalaryApprovalOnloadResponse, Error>({
        queryKey: [HRMS_QUERY_KEYS.SALARY_APPROVAL_ONLOAD, payload],
        queryFn: async () => {
            try {
                const res = await getSalaryApprovalOnload(payload);
                if (!res.success) {
                    // Return empty data structure instead of throwing to prevent UI crash
                    // The error will be available in the error state for the component to handle
                    return {
                        MI_Id: 0,
                        groupTypedropdownlist: [],
                        departmentdropdownlist: [],
                        designationdropdownlist: [],
                        monthdropdown: [],
                        leaveyeardropdown: []
                    } as SalaryApprovalOnloadResponse;
                }
                return res.data!;
            } catch (error) {
                // Return empty data structure instead of throwing to prevent UI crash
                // This allows the component to continue rendering with empty dropdowns
                return {
                    MI_Id: 0,
                    groupTypedropdownlist: [],
                    departmentdropdownlist: [],
                    designationdropdownlist: [],
                    monthdropdown: [],
                    leaveyeardropdown: []
                } as SalaryApprovalOnloadResponse;
            }
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!payload.MI_Id,
        retry: false, // Don't retry on error to avoid repeated failed requests
        refetchOnWindowFocus: false // Don't refetch on window focus to avoid repeated errors
    });
}
export function useSearchSalaryApproval() {
    return useMutation<SalaryApprovalSearchResponse, Error, SalaryApprovalSearchRequest>({
        mutationFn: (data: SalaryApprovalSearchRequest) => {
            return searchSalaryApprovalEmployees(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                const employeeCount = res.data?.ReportData?.length || 0;
                if (employeeCount > 0) {
                }
                return res.data!;
            }).catch((error) => {
                throw error;
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to search employees for approval.');
        }
    });
}
export function useApproveSalaries() {
    const queryClient = useQueryClient();
    return useMutation<SalaryApprovalResponse, Error, SalaryApprovalRequest>({
        mutationFn: (data: SalaryApprovalRequest) => {
            return approveSalaries(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }).catch((error) => {
                throw error;
            });
        },
        onSuccess: (data, variables) => {
            if (data.approvedCount > 0) {
                toast.success(
                    data.message || `${data.approvedCount} salary record(s) ${variables.approvalStatus.toLowerCase()} successfully!`
                );
            }
            if (data.failedCount > 0) {
                toast.warning(`Failed to process ${data.failedCount} record(s).`);
            }
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_APPROVAL_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to process salary approval.');
        }
    });
}
// ============================================================================
// SALARY CALCULATION
// ============================================================================
export function useSalaryCalculationOnload(payload: SalaryCalculationOnloadRequest) {
    return useQuery<SalaryCalculationOnloadResponse, Error>({
        queryKey: [HRMS_QUERY_KEYS.SALARY_CALCULATION_ONLOAD, payload],
        queryFn: () =>
            getSalaryCalculationOnload(payload).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 5,
        enabled: !!payload.MI_Id
    });
}
export function useSearchSalaryCalculation() {
    return useMutation<SalaryCalculationOnloadResponse, Error, SalaryCalculationSearchRequest>({
        mutationFn: (data: SalaryCalculationSearchRequest) =>
            searchSalaryCalculationBySelection(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onError: (error) => {
            toast.error(error.message || 'Failed to search employees for salary calculation.');
        }
    });
}
export function useGenerateSalary() {
    const queryClient = useQueryClient();
    return useMutation<SalaryCalculationGenerateResponse, Error, SalaryCalculationGenerateRequest>({
        mutationFn: (data: SalaryCalculationGenerateRequest) =>
            generateSalaryForSelectedEmployees(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onSuccess: (data) => {
            if (data.processedCount > 0) {
                toast.success(data.retrunMsg || `Salary calculated successfully for ${data.processedCount} employee(s)!`);
            }
            if (data.failedCount > 0) {
                toast.warning(`Failed to calculate salary for ${data.failedCount} employee(s).`);
            }
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_CALCULATION_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to generate salary calculation.');
        }
    });
}

export function useSearchEmployeesBySelection() {
    return useMutation<ApiResponse<SelectionEmployee[]>, Error, NewSalaryCalculationSearchRequest>({
        mutationFn: (data: NewSalaryCalculationSearchRequest) =>
            searchEmployeesBySelection(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res as ApiResponse<SelectionEmployee[]>;
            }),
        onError: (error) => {
            toast.error(error.message || 'Failed to search employees for salary calculation.');
        }
    });
}

export function useCalculateEmployeeSalary() {
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<any>, Error, NewSalaryCalculationGenerateRequest>({
        mutationFn: (data: NewSalaryCalculationGenerateRequest) =>
            calculateEmployeeSalary(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res as ApiResponse<any>;
            }),
        onSuccess: (data) => {
            toast.success(data.message || 'Salary calculated successfully!');
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_CALCULATION_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to calculate salary.');
        }
    });
}

// ============================================================================
// SALARY INCREMENT
// ============================================================================
export function useSalaryIncrementOnload(payload: SalaryIncrementOnloadRequest) {
    return useQuery<SalaryIncrementOnloadResponse, Error>({
        queryKey: [HRMS_QUERY_KEYS.SALARY_INCREMENT_ONLOAD, payload],
        queryFn: async () => {
            const res = await getSalaryIncrementOnload(payload);
            if (!res.success || !res.data) {
                throw new Error(res.message || 'Failed to load salary increment data');
            }
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!(payload.MIID || payload.MI_Id) && (payload.LoginUserId !== undefined || payload.roleId !== undefined)
    });
}
export function useSaveSalaryIncrement() {
    const queryClient = useQueryClient();
    return useMutation<SalaryIncrementSaveResponse, Error, SalaryIncrementSaveRequest>({
        mutationFn: (data: SalaryIncrementSaveRequest) =>
            saveSalaryIncrement(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onSuccess: (data, variables) => {
            toast.success(
                data.retrunMsg ||
                (variables.HREIC_Id === 0 ? 'Salary increment created successfully!' : 'Salary increment updated successfully!')
            );
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_INCREMENT_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save salary increment.');
        }
    });
}
export function useDeleteSalaryIncrement() {
    const queryClient = useQueryClient();
    return useMutation<SalaryIncrementDeleteResponse, Error, number>({
        mutationFn: (id: number) =>
            deleteSalaryIncrement(id).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onSuccess: () => {
            toast.success('Salary increment deactivated successfully!');
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_INCREMENT_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to deactivate salary increment.');
        }
    });
}
// ============================================================================
// SALARY UPDATION
// ============================================================================
export function useSalaryUpdationList(payload: SalaryUpdationOnloadRequest) {
    const queryClient = useQueryClient();
    // Support both new and legacy request formats
    const requestPayload: SalaryUpdationOnloadRequest = {
        page: payload.page ?? 1,
        page_size: payload.page_size ?? 10,
        search_query: payload.search_query ?? '',
        search_column: payload.search_column ?? '',
        sort_column: payload.sort_column ?? '',
        sort_direction: payload.sort_direction ?? '',
        is_export: payload.is_export ?? false,
        MIID: payload.MIID ?? 30,
        LoginUserId: payload.LoginUserId ?? payload.roleId ?? 0,
        UserRole: payload.UserRole ?? ''
    };
    const listQuery = useQuery<SalaryUpdationOnloadResponse, Error>({
        queryKey: [HRMS_QUERY_KEYS.SALARY_UPDATION_ONLOAD, requestPayload],
        queryFn: () =>
            getSalaryUpdationOnload(requestPayload).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 5,
        enabled: !!(requestPayload.LoginUserId || requestPayload.roleId || requestPayload.MIID)
    });
    const saveMutation = useMutation<SalaryUpdationSaveResponse, Error, SalaryUpdationSaveRequest>({
        mutationFn: (data: SalaryUpdationSaveRequest) =>
            saveSalaryUpdation(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onSuccess: (data, variables) => {
            toast.success(
                data.retrunMsg ||
                (variables.HRESU_Id === 0 ? 'Salary updation created successfully!' : 'Salary updation updated successfully!')
            );
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_UPDATION_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save salary updation.');
        }
    });
    const deleteMutation = useMutation<any, Error, SalaryUpdationDeleteRequest>({
        mutationFn: (data: SalaryUpdationDeleteRequest) =>
            deleteSalaryUpdation(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data;
            }),
        onSuccess: () => {
            toast.success('Salary updation deleted successfully!');
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_UPDATION_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete salary updation.');
        }
    });
    return {
        listQuery,
        saveMutation,
        deleteMutation
    };
}
// Legacy exports for backwards compatibility
export function useSaveSalaryUpdation() {
    const queryClient = useQueryClient();
    return useMutation<SalaryUpdationSaveResponse, Error, SalaryUpdationSaveRequest>({
        mutationFn: (data: SalaryUpdationSaveRequest) =>
            saveSalaryUpdation(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onSuccess: (data, variables) => {
            toast.success(
                data.retrunMsg ||
                (variables.HRESU_Id === 0 ? 'Salary updation created successfully!' : 'Salary updation updated successfully!')
            );
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_UPDATION_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save salary updation.');
        }
    });
}
export function useDeleteSalaryUpdation() {
    const queryClient = useQueryClient();
    return useMutation<any, Error, SalaryUpdationDeleteRequest>({
        mutationFn: (data: SalaryUpdationDeleteRequest) =>
            deleteSalaryUpdation(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data;
            }),
        onSuccess: () => {
            toast.success('Salary updation deleted successfully!');
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_UPDATION_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete salary updation.');
        }
    });
}
/**
 * Filter employees for salary updation
 */
export function useFilterSalaryUpdationEmployees() {
    return useMutation<SalaryUpdationOnloadResponse, Error, SalaryUpdationFilterRequest>({
        mutationFn: (data: SalaryUpdationFilterRequest) => {
            return filterSalaryUpdationEmployees(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                const employeeCount = res.data?.employeedropdown?.length || 0;
                if (employeeCount > 0) {
                }
                return res.data!;
            }).catch((error) => {
                throw error;
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to filter employees.');
        }
    });
}
/**
 * Get employee details by selection (earnings and deductions) for salary updation
 */
export function useGetSalaryUpdationEmployeeDetailsBySelection() {
    return useMutation<SalaryUpdationEmployeeDetailsResponse, Error, SalaryUpdationEmployeeDetailsRequest>({
        mutationFn: (data: SalaryUpdationEmployeeDetailsRequest) => {
            return getSalaryUpdationEmployeeDetailsBySelection(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                const employeeCount = res.data?.employeedropdown?.length || 0;
                if (employeeCount > 0) {
                }
                return res.data!;
            }).catch((error) => {
                throw error;
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to get employee details.');
        }
    });
}
/**
 * Get departments by group type selection (cascading dropdown)
 */
export function useGetSalaryUpdationDepartments() {
    return useMutation<SalaryUpdationDepartmentResponse, Error, SalaryUpdationDepartmentRequest>({
        mutationFn: (data: SalaryUpdationDepartmentRequest) => {
            return getSalaryUpdationDepartments(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                const departmentCount = res.data?.departmentdropdown?.length || 0;
                return res.data!;
            }).catch((error) => {
                throw error;
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to get departments.');
        }
    });
}
/**
 * Get designations by group type and department selection (cascading dropdown)
 */
export function useGetSalaryUpdationDesignations() {
    return useMutation<SalaryUpdationDesignationResponse, Error, SalaryUpdationDesignationRequest>({
        mutationFn: (data: SalaryUpdationDesignationRequest) => {
            return getSalaryUpdationDesignations(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                const designationCount = res.data?.designationdropdown?.length || 0;
                return res.data!;
            }).catch((error) => {
                throw error;
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to get designations.');
        }
    });
}
export function useGetSalaryUpdationGroupTypes() {
    return useMutation<SalaryUpdationDesignationResponse, Error, SalaryUpdationDesignationRequest>({
        mutationFn: (data: SalaryUpdationDesignationRequest) => {
            return getSalaryUpdationDesignations(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                const designationCount = res.data?.designationdropdown?.length || 0;
                return res.data!;
            }).catch((error) => {
                throw error;
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to get designations.');
        }
    });
}

/**
 * Update employees earnings and deductions (Batch Save)
 */
export function useUpdateEmployeesEarningsAndDeductions() {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { earningResult?: any[], deductionResult?: any[], LoginUserId: number }>({
        mutationFn: (data) => {
            return updateEmployeesEarningsAndDeductions(data).then((res: any) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data;
            });
        },
        onSuccess: () => {
            toast.success('Changes saved successfully');
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SALARY_UPDATION_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save changes.');
        }
    });
}

// ============================================================================
// MASS UPDATION
// ============================================================================
export function useMassUpdationOnload(payload: MassUpdationOnloadRequest) {
    return useQuery<MassUpdationOnloadResponse, Error>({
        queryKey: [HRMS_QUERY_KEYS.MASS_UPDATION_ONLOAD, payload],
        queryFn: () =>
            getMassUpdationOnload(payload).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        staleTime: 1000 * 60 * 5,
        enabled: !!payload.MI_Id && !!payload.roleId
    });
}

export function useSaveMassUpdation() {
    const queryClient = useQueryClient();
    return useMutation<MassUpdationSaveResponse, Error, MassUpdationSaveRequest>({
        mutationFn: (data: MassUpdationSaveRequest) =>
            saveMassUpdation(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                // If data is null, provide the message in a compatible object
                return res.data || { retrunMsg: res.message } as any;
            }),
        onSuccess: (data) => {
            toast.success(data?.retrunMsg || 'Mass updation completed successfully!');
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.MASS_UPDATION_ONLOAD]
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to complete mass updation.');
        }
    });
}
export function useSearchMassUpdationEmployees() {
    return useMutation<MassUpdationOnloadResponse, Error, MassUpdationSearchRequest>({
        mutationFn: (data: MassUpdationSearchRequest) =>
            searchMassUpdationEmployees(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onError: (error) => {
            toast.error(error.message || 'Failed to search employees for mass updation.');
        }
    });
}
export function useGetEmployeeDetailsBySelection() {
    return useMutation<MassUpdationOnloadResponse, Error, MassUpdationSearchRequest>({
        mutationFn: (data: MassUpdationSearchRequest) =>
            getEmployeeDetailsBySelection(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onError: (error) => {
            toast.error(error.message || 'Failed to get employee details for mass updation.');
        }
    });
}

export function useGetMassUpdationDepartments() {
    return useMutation<{ departmentdropdown: any[] }, Error, { MI_Id?: number; hrmgT_IdList?: number[] }>({
        mutationFn: (data) =>
            getMassUpdationDepartments(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onError: (error) => {
            toast.error(error.message || 'Failed to get departments for mass updation.');
        }
    });
}

export function useGetMassUpdationDesignations() {
    return useMutation<{ designationdropdown: any[] }, Error, { MI_Id?: number; hrmgT_IdList?: number[]; hrmD_IdList?: number[] }>({
        mutationFn: (data) =>
            getMassUpdationDesignations(data).then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                }
                return res.data!;
            }),
        onError: (error) => {
            toast.error(error.message || 'Failed to get designations for mass updation.');
        }
    });
}
