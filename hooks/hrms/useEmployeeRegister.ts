'use client';

import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import {
    deleteEmployee,
    getBankDropdown,
    getBloodGroupDropdown,
    getCasteCategoryDropdown,
    getCasteDropdown,
    getContactTypeDropdown,
    getCountryDropdown,
    getCourseDropdown,
    getDepartmentDropdown,
    getDesignationDropdown,
    getEmployeeById,
    getEmployeeList,
    getEmployeeRegisterOnload,
    getEmployeeTypeDropdown,
    getGenderDropdown,
    getGradeDropdown,
    getGroupTypeDropdown,
    getInstitutionDropdown,
    getLeaveReasonDropdown,
    getMaritalStatusDropdown,
    getPaymentModeDropdown,
    getReligionDropdown,
    getSalaryTypeDropdown,
    getScoreTypeDropdown,
    getSpecializationDropdown,
    getStateDropdown,
    getTeachingTypeDropdown,
    saveEmployee,
    saveEmployeeArrears,
    saveEmployeeDeductions,
    saveEmployeeDocument,
    saveEmployeeEarnings,
    saveEmployeeExperience,
    saveEmployeeMedical,
    saveEmployeeOtherDetails,
    saveEmployeeQualification,
    saveBankDetails,
    toggleEmployee,
    uploadStaffPhoto,
    getEmployeeSalaryDetailsByHead,
    getEarningList,
    getDeductionList,
    getArrearsList,
    updateEmployeeSalaryDetailsByHead,
    saveEmployeeSalaryDetails,
    getEmployeeEarningsDeductions
} from '@/server/hrms/hrmsConfig/employee/register';
import type { ApiSearchparams } from '@/types';
import type { IEmployeeSaveRequest } from '@/types/hrms/hrms-config/employee';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// ==================== Dropdown Hooks ====================

export function useGradeDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.GRADE_DROPDOWN],
            queryFn: async () => getGradeDropdown(),
            staleTime: 1000 * 60 * 5 // 5 minutes
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.GRADE_DROPDOWN]
            });
        }
    };
}

export function useEmployeeTypeDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'employee-type'],
            queryFn: async () => {
                console.log('📡 [HOOK] fetching Employee Type Dropdown...');
                const data = await getEmployeeTypeDropdown();
                console.log('📡 [HOOK] Employee Type Dropdown Data:', data);
                return data;
            },
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'employee-type']
            });
        }
    };
}

export function useGroupTypeDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'group-type'],
            queryFn: async () => getGroupTypeDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'group-type']
            });
        }
    };
}

export function useDepartmentDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'department'],
            queryFn: async () => getDepartmentDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'department']
            });
        }
    };
}

export function useDesignationDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'designation'],
            queryFn: async () => getDesignationDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'designation']
            });
        }
    };
}

export function useGenderDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'gender'],
            queryFn: async () => getGenderDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'gender']
            });
        }
    };
}

export function useMaritalStatusDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'marital-status'],
            queryFn: async () => getMaritalStatusDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'marital-status']
            });
        }
    };
}

export function useReligionDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'religion'],
            queryFn: async () => getReligionDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'religion']
            });
        }
    };
}

export function useCasteCategoryDropdown(religionId?: number | string) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'caste-category', religionId],
            queryFn: async () => getCasteCategoryDropdown(religionId || 0),
            enabled: !!religionId, // Only fetch if religion is selected
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'caste-category']
            });
        }
    };
}

export function useCasteDropdown(casteCategoryId?: number | string) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'caste', casteCategoryId],
            queryFn: async () => getCasteDropdown(casteCategoryId || 0),
            enabled: !!casteCategoryId, // Only fetch if caste category is selected
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'caste']
            });
        }
    };
}

export function useBankDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'bank'],
            queryFn: async () => getBankDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'bank']
            });
        }
    };
}

export function useCountryDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'country'],
            queryFn: async () => getCountryDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'country']
            });
        }
    };
}

export function useStateDropdown(country_id: number | null | undefined) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'state', country_id],
            queryFn: async () => {
                if (!country_id || country_id === 0) {
                    return Promise.resolve([]);
                }
                const response = await getStateDropdown(country_id);
                // Extract data from response (handle ApiResponse wrapper if needed)
                if (Array.isArray(response)) {
                    return response;
                }
                // Handle wrapped response
                return (response as any)?.data || (response as any)?.result || [];
            },
            enabled: !!country_id && country_id > 0,
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'state']
            });
        }
    };
}

export function useCourseDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'course'],
            queryFn: async () => getCourseDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'course']
            });
        }
    };
}

export function useSpecializationDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'specialization'],
            queryFn: async () => getSpecializationDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'specialization']
            });
        }
    };
}

export function useInstitutionDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'institution'],
            queryFn: async () => getInstitutionDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'institution']
            });
        }
    };
}

export function usePaymentModeDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'payment-mode'],
            queryFn: async () => getPaymentModeDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'payment-mode']
            });
        }
    };
}

export function useLeaveReasonDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'leave-reason'],
            queryFn: async () => getLeaveReasonDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'leave-reason']
            });
        }
    };
}

export function useBloodGroupDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'blood-group'],
            queryFn: async () => getBloodGroupDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'blood-group']
            });
        }
    };
}

export function useSalaryTypeDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'salary-type'],
            queryFn: async () => getSalaryTypeDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'salary-type']
            });
        }
    };
}

export function useTeachingTypeDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'teaching-type'],
            queryFn: async () => getTeachingTypeDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'teaching-type']
            });
        }
    };
}

export function useScoreTypeDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'score-type'],
            queryFn: async () => getScoreTypeDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'score-type']
            });
        }
    };
}

export function useContactTypeDropdown() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'contact-type'],
            queryFn: async () => getContactTypeDropdown(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'dropdown', 'contact-type']
            });
        }
    };
}

// ==================== Payroll List Hooks ====================

export function useEarningList() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'payroll', 'earnings'],
            queryFn: async () => getEarningList(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'payroll', 'earnings']
            });
        }
    };
}

export function useDeductionList() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'payroll', 'deductions'],
            queryFn: async () => getDeductionList(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'payroll', 'deductions']
            });
        }
    };
}

export function useArrearsList() {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'payroll', 'arrears'],
            queryFn: async () => getArrearsList(),
            staleTime: 1000 * 60 * 5
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'payroll', 'arrears']
            });
        }
    };
}

// ==================== Employee Onload Hook ====================

/**
 * Hook to fetch employee registration onload data
 * This fetches all initial data including dropdowns and configurations
 */
export function useEmployeeRegisterOnload(MI_Id: number, HRME_Id?: number) {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'onload', MI_Id, HRME_Id],
        queryFn: async () => {
            console.log(`📡 [HOOK] Fetching onload data for MI_Id: ${MI_Id}, HRME_Id: ${HRME_Id}`);
            const data = await getEmployeeRegisterOnload(MI_Id, HRME_Id);
            console.log('📡 [HOOK] RAW API RESPONSE:', data);

            // Explicitly check for qualification array existence in raw response
            if (data) {
                const keys = Object.keys(data);
                const qualKeys = keys.filter(k => k.toLowerCase().includes('qual') || k.toLowerCase().includes('educ'));
                console.log('📡 [HOOK] Potential Qualification Keys found in root:', qualKeys);

                if (data.data) {
                    const dataKeys = Object.keys(data.data);
                    const dataQualKeys = dataKeys.filter(k => k.toLowerCase().includes('qual') || k.toLowerCase().includes('educ'));
                    console.log('📡 [HOOK] Potential Qualification Keys found in data.data:', dataQualKeys);
                }
            }
            return data;
        },
        enabled: !!MI_Id && MI_Id > 0,
        staleTime: 1000 * 60 * 5 // 5 minutes
    });
}

// ==================== Employee CRUD Hooks ====================

/**
 * Hook to fetch employee list with search, sort, and pagination
 */
export function useEmployeeList(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, searchParams ?? {}],
            queryFn: async () => getEmployeeList(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
            });
        }
    };
}

/**
 * Hook to fetch employee by ID
 */
export function useEmployeeById(id: number | null) {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, id],
        queryFn: async () => {
            if (!id || id === 0) {
                return Promise.resolve(null);
            }
            console.log(`📡 [HOOK] Fetching Employee By ID: ${id}`);
            const data = await getEmployeeById(id);
            console.log('📡 [HOOK] RAW useEmployeeById RESPONSE:', data);
            if (data) {
                const keys = Object.keys(data);
                const qualKeys = keys.filter(k => k.toLowerCase().includes('qual') || k.toLowerCase().includes('educ'));
                console.log('📡 [HOOK - ById] Potential Qualification Keys found in root:', qualKeys);

                // Check inside potential wrappers like 'employeeDetails' or 'data'
                const possibleWrappers = ['data', 'employeeDetails', 'employeedetails', 'editEmployee'];
                possibleWrappers.forEach(wrapper => {
                    if ((data as any)[wrapper]) {
                        const wKeys = Object.keys((data as any)[wrapper]);
                        const wQualKeys = wKeys.filter(k => k.toLowerCase().includes('qual'));
                        if (wQualKeys.length > 0) console.log(`📡 [HOOK - ById] Found qualification keys inside '${wrapper}':`, wQualKeys);
                    }
                });
            }
            return data;
        },
        enabled: !!id && id > 0,
        staleTime: 1000 * 60 * 5 // 5 minutes
    });
}

/**
 * Hook to save employee
 */
export function useSaveEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IEmployeeSaveRequest) => saveEmployee(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || 'Employee saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else {
                toast.error(response.message || 'Failed to save employee');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving employee');
        }
    });
}

/**
 * Hook to save employee qualification details
 */
export function useSaveEmployeeQualification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any[]) => saveEmployeeQualification(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Qualification details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving qualification details');
        }
    });
}

/**
 * Hook to save employee experience details
 */
export function useSaveEmployeeExperience() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any[]) => saveEmployeeExperience(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Experience details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving experience details');
        }
    });
}

/**
 * Hook to toggle employee (activate/deactivate)
 */
export function useToggleEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => toggleEmployee(id),
        onSuccess: (response: any) => {
            // Some VAPS APIs don't return a success flag but if we have a response, it's a success
            if (response?.success || (response && response.success === undefined)) {
                toast.success(response?.message || 'Employee status updated successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else {
                toast.error(response?.message || 'Failed to update employee status');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while updating employee status');
        }
    });
}

/**
 * Hook to delete employee
 */
export function useDeleteEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteEmployee(id),
        onSuccess: () => {
            toast.success('Employee deleted successfully');
            queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while deleting employee');
        }
    });
}

/**
 * Hook to save employee document details
 */
export function useSaveEmployeeDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any[]) => saveEmployeeDocument(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Document details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving document details');
        }
    });
}

/**
 * Hook to save employee medical details
 */
export function useSaveEmployeeMedical() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => saveEmployeeMedical(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Medical details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving medical details');
        }
    });
}

/**
 * Hook to save employee other details
 */
export function useSaveEmployeeOtherDetails() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => saveEmployeeOtherDetails(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Other details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving other details');
        }
    });
}

/**
 * Hook to upload staff photo
 */
export function useUploadStaffPhoto() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => uploadStaffPhoto(formData),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Photo uploaded successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while uploading photo');
        }
    });
}
/**
 * Hook to save employee earning details
 */
export function useSaveEmployeeEarnings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => saveEmployeeEarnings(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Earning details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving earning details');
        }
    });
}

/**
 * Hook to save employee deduction details
 */
export function useSaveEmployeeDeductions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => saveEmployeeDeductions(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Deduction details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving deduction details');
        }
    });
}

/**
 * Hook to save employee arrear details
 */
export function useSaveEmployeeArrears() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => saveEmployeeArrears(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Arrear details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving arrear details');
        }
    });
}

/**
 * Hook to save employee bank details
 */
export function useSaveBankDetails() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => saveBankDetails(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Bank details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving bank details');
        }
    });
}

/**
 * Hook to get employee salary details calculated by head
 */
export function useGetEmployeeSalaryDetailsByHead() {
    return useMutation({
        mutationFn: (data: any) => getEmployeeSalaryDetailsByHead(data),
        onError: (error: Error) => {
            console.error('Failed to calculate salary details:', error);
        }
    });
}

/**
 * Hook to update employee salary details by head
 */
export function useUpdateEmployeeSalaryDetailsByHead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => updateEmployeeSalaryDetailsByHead(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Salary detail updated effectively');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.info(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while updating salary detail');
        }
    });
}
/**
 * Hook to save employee salary details
 */
export function useSaveEmployeeSalaryDetails() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ hrme_id, MI_Id }: { hrme_id: number; MI_Id: number }) => saveEmployeeSalaryDetails(hrme_id, MI_Id),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message || 'Salary details saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE]
                });
            } else if (response?.message) {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while saving salary details');
        }
    });
}

/**
 * Hook to fetch employee earnings and deductions
 */
export function useEmployeeEarningsDeductions(hrme_id: number | null) {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE, 'earnings-deductions', hrme_id],
        queryFn: () => getEmployeeEarningsDeductions(hrme_id!),
        enabled: !!hrme_id && hrme_id > 0
    });
}
