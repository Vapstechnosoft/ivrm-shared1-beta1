import { TIMETABLE_QUERY_KEYS } from '@/constants/Timetable-query-keys';
import { getBreakTimeSettingsDetails } from '@/server/timetable/masters/breaktimesettings';
import {
    getCategoryClassMappingDetails,
    getTimeTableAcademicYearDetails,
    getTimeTableCategoryDropDownDetails,
    getuseTimeTableClassDropdownDataDetails
} from '@/server/timetable/masters/categoryclassmapping';
import { getMasterCategoryDetails } from '@/server/timetable/masters/masterCategory';
import { getMasterBuildingDetails } from '@/server/timetable/masters/masterbuilding';
import { getMasterDayDetails } from '@/server/timetable/masters/masterday';
import {
    getAcademicYearDropDropDownMasterDayClasswise,
    getCategoryDropDownMasterDayClasswise,
    getClassDropDownMasterDayClasswise,
    getDayDropDownMasterDayClasswise,
    getMasterDayClassWiseDetails
} from '@/server/timetable/masters/masterdayclasswise';
import { CategorydropDownData, getMasterPeriodDetails } from '@/server/timetable/masters/masterperiod';
import { getAllPeriodDetails } from '@/server/timetable/masters/periodallocation';
import { getPeriodDistributionDetails } from '@/server/timetable/masters/perioddistribution';
import { getAllPeriodTimeSettings } from '@/server/timetable/masters/periodtimesetting';
import { getStaffAbbreviationDetails, getStaffDropDown } from '@/server/timetable/masters/staffabbreviation';
import { getSubjectAbbreviationDetails, getsubjectDropDown } from '@/server/timetable/masters/subjectabbreviation';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterDay = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_DAY, searchParams ?? {}],
            queryFn: async () => getMasterDayDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_DAY]
            });
        }
    };
};

export const useMasterBuilding = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_BUILDING, searchParams ?? {}],
            queryFn: async () => getMasterBuildingDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_BUILDING]
            });
        }
    };
};

export const useStaffAbbreviation = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_STAFF_ABBREVIATION, searchParams ?? {}],
            queryFn: async () => getStaffAbbreviationDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_STAFF_ABBREVIATION]
            });
        }
    };
};

export const useSSubjectAbbreviation = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_SUBJECT_ABBREVIATION, searchParams ?? {}],
            queryFn: async () => getSubjectAbbreviationDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_SUBJECT_ABBREVIATION]
            });
        }
    };
};

export const useStaffDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_STAFF_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getStaffDropDown(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_STAFF_DROPDOWN]
            });
        }
    };
};

export const useSubjectDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_SUBJECT_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getsubjectDropDown(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_SUBJECT_DROPDOWN]
            });
        }
    };
};
export const useTimeTableMasterCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_TIMETABLE_CATEGORY, searchParams ?? {}],
            queryFn: async () => getMasterCategoryDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_TIMETABLE_CATEGORY]
            });
        }
    };
};

export const useTimeTableCategoryClassMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_TIMETABLE_CATEGORY_CLASS_MAPPING, searchParams ?? {}],
            queryFn: async () => getCategoryClassMappingDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_TIMETABLE_CATEGORY_CLASS_MAPPING]
            });
        }
    };
};

export const useTimeTableAcademicYear = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_TT_ACADEMICYEAR, searchParams ?? {}],
            queryFn: async () => getTimeTableAcademicYearDetails(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_TT_ACADEMICYEAR]
            });
        }
    };
};

export const useTimeTableCategoryDropDownData = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_CATEGORY_DROPDOWNDATA_TT, searchParams ?? {}],
            queryFn: async () => getTimeTableCategoryDropDownDetails(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_CATEGORY_DROPDOWNDATA_TT]
            });
        }
    };
};

export const useTimeTableClassDropdownData = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_TT_CLASSDROPDOWN, searchParams ?? {}],
            queryFn: async () => getuseTimeTableClassDropdownDataDetails(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_TT_CLASSDROPDOWN]
            });
        }
    };
};

export const usePeriodAllocation = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_PERIOD_ALLOCATION, searchParams ?? {}],
            queryFn: async () => getAllPeriodDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_PERIOD_ALLOCATION]
            });
        }
    };
};

// export const useBreakTimeSettings = (searchParams?: ApiSearchparams) => {
//     const queryClient = useQueryClient();

//     return {
//         ...useQuery({
//             queryKey: [TIMETABLE_QUERY_KEYS.MASTER_BREAK_TIME_SETTINGS, searchParams ?? {}],
//             queryFn: async () => getBreakTimeSettingsDetails(searchParams),
//             staleTime: 0
//         }),

//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: [TIMETABLE_QUERY_KEYS.MASTER_BREAK_TIME_SETTINGS]
//             });
//         }
//     };
// };

export const useMasterPeriodDetails = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.MASTER_PERIOD_DETAILSDATA, searchParams ?? {}],
            queryFn: async () => getMasterPeriodDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.MASTER_PERIOD_DETAILSDATA]
            });
        }
    };
};

export const useBreakTimeSettingDetails = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.TT_BREAKTIME_STTINGS, searchParams ?? {}],
            queryFn: async () => getBreakTimeSettingsDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.TT_BREAKTIME_STTINGS]
            });
        }
    };
};

export const usePeriodDistributionDetails = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.TT_PERIOD_DISTRIBUTIONDETAILS, searchParams ?? {}],
            queryFn: async () => getPeriodDistributionDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.TT_PERIOD_DISTRIBUTIONDETAILS]
            });
        }
    };
};

export const useMasterDayClasswiseDetails = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.TT_MASTER_DAYCLASSWISE_DETAILS, searchParams ?? {}],
            queryFn: async () => getMasterDayClassWiseDetails(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.TT_MASTER_DAYCLASSWISE_DETAILS]
            });
        }
    };
};

export const usePeriodTimeSettingDetails = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.TT_PERIODTIME_SETTINGSDATA, searchParams ?? {}],
            queryFn: async () => getAllPeriodTimeSettings(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.TT_PERIODTIME_SETTINGSDATA]
            });
        }
    };
};

export const useAcademicYearDropDownMasterDayClasswise = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.ACADEMIC_YEAR_DROPDOWN_MASTERDAYCLASSWISE, searchParams ?? {}],
            queryFn: async () => getAcademicYearDropDropDownMasterDayClasswise(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.ACADEMIC_YEAR_DROPDOWN_MASTERDAYCLASSWISE]
            });
        }
    };
};

export const useCategtoryDropDownMasterDayClasswise = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.CATEGORY_DROPDOWN_MASTERDAYCLASSWISE, searchParams ?? {}],
            queryFn: async () => getCategoryDropDownMasterDayClasswise(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.CATEGORY_DROPDOWN_MASTERDAYCLASSWISE]
            });
        }
    };
};

export const useClassDropDownMasterDayClasswise = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.CLASS_DROPDOWN_MASTERDAYCLASSWISE, searchParams ?? {}],
            queryFn: async () => getClassDropDownMasterDayClasswise(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.CLASS_DROPDOWN_MASTERDAYCLASSWISE]
            });
        }
    };
};

export const useDayDropDownMasterDayClasswise = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.DAYS_DROPDOWN_MASTERDAYCLASSWISE, searchParams ?? {}],
            queryFn: async () => getDayDropDownMasterDayClasswise(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.DAYS_DROPDOWN_MASTERDAYCLASSWISE]
            });
        }
    };
};

export const useCategoryDropDownMasterPeriod = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.CATEGORY_DROPDOWN_MASTERPERIOD, searchParams ?? {}],
            queryFn: async () => CategorydropDownData(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.CATEGORY_DROPDOWN_MASTERPERIOD]
            });
        }
    };
};
