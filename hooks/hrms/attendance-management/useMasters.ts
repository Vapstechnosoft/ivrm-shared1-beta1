'use client';
import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import {
    addOrUpdateEmployeeMissingLog,
    deleteEmployeeMissingLog,
    getEmployeeMissingLogs
} from '@/server/hrms/attendance-management/masters/employee-missing-logs';
import {
    addOrUpdateEmployeeShiftMapping,
    deleteEmployeeShiftMapping,
    getEmployeeShiftMapping,
    getEmployeeShiftMappingDepartments,
    getEmployeeShiftMappingDesignations,
    getEmployeeShiftMappingDropdowns,
    getEmployeeShiftMappingEmployeesFiltered,
    getEmployeeShiftMappingEmployeesOld,
    getEmployeeShiftMappingGroupTypes,
    getEmployeeShiftMappingHolidayTypes,
    getEmployeeShiftMappingShiftDetails,
    getEmployeeShiftMappingShiftNames,
    getEmployeeShiftMappingShiftNamesList
} from '@/server/hrms/attendance-management/masters/employee-shift-mapping';
import {
    addOrUpdateMasterDriverShift,
    deleteMasterDriverShift,
    getMasterDriverShift
} from '@/server/hrms/attendance-management/masters/master-driver-shift';
import {
    addOrUpdateMasterHoliday,
    deleteMasterHoliday,
    getHolidayDatesForDays,
    getMasterHoliday
} from '@/server/hrms/attendance-management/masters/master-holiday';
import { addOrUpdateMasterShift, deleteMasterShift, getMasterShift } from '@/server/hrms/attendance-management/masters/master-shift';
import {
    addOrUpdateShiftSettingMaster,
    deleteShiftSettingMaster,
    getShiftSettingMaster
} from '@/server/hrms/attendance-management/masters/shift-setting-master';
import type { ApiSearchparams } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
export const useMasterShift = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.MASTER_SHIFT],
            queryFn: async () => getMasterShift(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.MASTER_SHIFT]
            });
        }
    };
};
export const useSaveMasterShift = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Parameters<typeof addOrUpdateMasterShift>[0]) => addOrUpdateMasterShift(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_SHIFT]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save master shift');
        }
    });
};
export const useDeleteMasterShift = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteMasterShift(id),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_SHIFT]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete master shift');
        }
    });
};
export const useMasterHoliday = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    const queryResult = useQuery({
        queryKey: [HRMS_QUERY_KEYS.MASTER_HOLIDAY, searchParams ?? {}],
        queryFn: async () => {
            const result = await getMasterHoliday(searchParams);
            return result;
        },
        staleTime: 0
    });
    return {
        ...queryResult,
        refetchAll: () => {
            const result = queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.MASTER_HOLIDAY]
            });
            result.then(() => {}).catch((error) => {});
            return result;
        }
    };
};
export const useSaveMasterHoliday = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Parameters<typeof addOrUpdateMasterHoliday>[0]) => addOrUpdateMasterHoliday(data),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response?.message || 'Master holiday saved successfully');
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_HOLIDAY]
                });
            } else {
                toast.error(response?.message || 'Save operation failed');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save master holiday');
        }
    });
};
export const useDeleteMasterHoliday = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteMasterHoliday(id),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_HOLIDAY]
                });
            } else {
                toast.error(response?.message || 'Delete operation failed');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete master holiday');
        }
    });
};

// Hook to get dates for selected days
export const useHolidayDatesForDays = (request?: { calendarYear: string; holidayType: string; selectedDays: string[] }, enabled = true) => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.MASTER_HOLIDAY, 'dates', request],
        queryFn: async () => {
            if (!request || !request.calendarYear || !request.holidayType || !request.selectedDays || request.selectedDays.length === 0) {
                return { data: [], success: true };
            }
            return await getHolidayDatesForDays(request);
        },
        enabled:
            enabled &&
            !!request &&
            !!request.calendarYear &&
            !!request.holidayType &&
            !!request.selectedDays &&
            request.selectedDays.length > 0,
        staleTime: 0
    });
};
export const useShiftSettingMaster = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    const queryResult = useQuery({
        queryKey: [HRMS_QUERY_KEYS.SHIFT_SETTING_MASTER, searchParams ?? {}],
        queryFn: async () => {
            const result = await getShiftSettingMaster(searchParams);
            return result;
        },
        staleTime: 0
    });
    return {
        ...queryResult,
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.SHIFT_SETTING_MASTER]
            });
        }
    };
};
export const useSaveShiftSettingMaster = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Parameters<typeof addOrUpdateShiftSettingMaster>[0]) => addOrUpdateShiftSettingMaster(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.SHIFT_SETTING_MASTER]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save shift setting');
        }
    });
};
export const useDeleteShiftSettingMaster = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteShiftSettingMaster(id),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.SHIFT_SETTING_MASTER]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete shift setting');
        }
    });
};
export const useEmployeeShiftMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, searchParams ?? {}],
            queryFn: async () => getEmployeeShiftMapping(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING]
            });
        }
    };
};
export const useSaveEmployeeShiftMapping = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Parameters<typeof addOrUpdateEmployeeShiftMapping>[0]) => addOrUpdateEmployeeShiftMapping(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save employee shift mapping');
        }
    });
};
export const useDeleteEmployeeShiftMapping = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteEmployeeShiftMapping(id),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete employee shift mapping');
        }
    });
};
export const useEmployeeShiftMappingDropdowns = (data?: any) => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'dropdowns', data],
        queryFn: async () => getEmployeeShiftMappingDropdowns(data),
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};
export const useEmployeeShiftMappingShiftNames = (data?: any) => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'shiftNames', data],
        queryFn: async () => getEmployeeShiftMappingShiftNames(data),
        enabled: !!data, // Only fetch when data is provided
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};

export const useEmployeeShiftMappingEmployees = (data?: any) => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'employees', data],
        queryFn: async () => getEmployeeShiftMappingEmployeesOld(data),
        enabled: !!data, // Only fetch when data is provided
        staleTime: 2 * 60 * 1000 // Cache for 2 minutes
    });
};

export const useEmployeeShiftMappingGroupTypes = () => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'groupTypes'],
        queryFn: async () => getEmployeeShiftMappingGroupTypes(),
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};

export const useEmployeeShiftMappingHolidayTypes = () => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'holidayTypes'],
        queryFn: async () => getEmployeeShiftMappingHolidayTypes(),
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};

export const useEmployeeShiftMappingShiftNamesList = () => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'shiftNamesList'],
        queryFn: async () => getEmployeeShiftMappingShiftNamesList(),
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};

export const useEmployeeShiftMappingShiftDetails = (id?: number) => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'shiftDetails', id],
        queryFn: async () => getEmployeeShiftMappingShiftDetails(id!),
        enabled: !!id && id > 0, // Only fetch when id is provided and valid
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};

export const useEmployeeShiftMappingDepartments = (groupTypeIds?: number[]) => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'departments', groupTypeIds],
        queryFn: async () => getEmployeeShiftMappingDepartments(groupTypeIds || []),
        enabled: !!groupTypeIds && groupTypeIds.length > 0, // Only fetch when group type IDs are provided
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};

export const useEmployeeShiftMappingDesignations = (departmentIds?: number[]) => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'designations', departmentIds],
        queryFn: async () => getEmployeeShiftMappingDesignations(departmentIds || []),
        enabled: !!departmentIds && departmentIds.length > 0, // Only fetch when department IDs are provided
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};

export const useEmployeeShiftMappingEmployeesFiltered = (groupTypeIds?: number[], departmentIds?: number[], designationIds?: number[]) => {
    return useQuery({
        queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_SHIFT_MAPPING, 'employees', groupTypeIds, departmentIds, designationIds],
        queryFn: async () => getEmployeeShiftMappingEmployeesFiltered(groupTypeIds || [], departmentIds || [], designationIds || []),
        enabled:
            (!!groupTypeIds && groupTypeIds.length > 0) ||
            (!!departmentIds && departmentIds.length > 0) ||
            (!!designationIds && designationIds.length > 0), // Only fetch when at least one filter is provided
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
};
export const useMasterDriverShift = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.MASTER_DRIVER_SHIFT],
            queryFn: async () => getMasterDriverShift(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.MASTER_DRIVER_SHIFT]
            });
        }
    };
};
export const useSaveMasterDriverShift = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Parameters<typeof addOrUpdateMasterDriverShift>[0]) => addOrUpdateMasterDriverShift(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_DRIVER_SHIFT]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save master driver shift');
        }
    });
};
export const useDeleteMasterDriverShift = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteMasterDriverShift(id),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.MASTER_DRIVER_SHIFT]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete master driver shift');
        }
    });
};
export const useEmployeeMissingLogs = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_MISSING_LOGS],
            queryFn: async () => getEmployeeMissingLogs(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_MISSING_LOGS]
            });
        }
    };
};
export const useSaveEmployeeMissingLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Parameters<typeof addOrUpdateEmployeeMissingLog>[0]) => addOrUpdateEmployeeMissingLog(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_MISSING_LOGS]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save employee missing log');
        }
    });
};
export const useDeleteEmployeeMissingLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteEmployeeMissingLog(id),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_MISSING_LOGS]
                });
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete employee missing log');
        }
    });
};
