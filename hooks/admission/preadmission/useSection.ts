import { ADMISSION_QUERY_KEYS } from '@/constants/query-keys';

import { getClassSetOrder, getMasterClass } from '@/server/admission/preadmission/masters/class';

import { getMasterMonthDropDownList, getMasterSectionHeld } from '@/server/admission/preadmission/masters/class_held';

import { getSectionSetOrder } from '@/server/admission/preadmission/masters/section';
import {
    getMasterChangeClassStudents,
    getMasterChangeSectionTable,
    getMasterNewSectionStudents,
    getMasterStudentList,
    getMasterStudentRoles,
    getMasterStudents,
    getMasterYearLossSection
} from '@/server/admission/preadmission/section/sections';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterClass = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS, searchParams ?? {}],
            queryFn: async () => getMasterClass(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS]
            });
        }
    };
};

export const useclassSetOrder = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_SET_ORDER],
            queryFn: async () => getClassSetOrder(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_SET_ORDER]
            });
        }
    };
};
export const useSectionSetOrder = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_SECTION_SET_ORDER],
            queryFn: async () => getSectionSetOrder(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_SECTION_SET_ORDER]
            });
        }
    };
};

export const useMasterSectionHeld = (asmcl_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_HELD, asmcl_id ?? {}],
            queryFn: async () => {
                if (!asmcl_id || Number(asmcl_id) <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterSectionHeld(Number(asmcl_id));
            },
            enabled: Boolean(asmcl_id && Number(asmcl_id) > 0),
            staleTime: 0
        }),
        refetchAll: (id?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_HELD, id ?? {}]
            });
        }
    };
};

export const useMasterMonthDropDownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_MONTH_DROPDOWN_LIST],
            queryFn: async () => getMasterMonthDropDownList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_MONTH_DROPDOWN_LIST]
            });
        }
    };
};

export const useMasterStudents = (asmay_id?: number, asmcl_id?: number, asms_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_STUDENTS, asmay_id ?? {}, asmcl_id ?? {}, asms_id ?? {}],
            queryFn: async () => {
                if (!asmay_id || asmay_id <= 0 || !asmcl_id || asmcl_id <= 0 || !asms_id || asms_id <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterStudents(asmay_id, asmcl_id, asms_id);
            },
            enabled: Boolean(asmay_id && asmay_id > 0 && asmcl_id && asmcl_id > 0 && asms_id && asms_id > 0),
            staleTime: 0
        }),
        refetchAll: (year?: number, emp?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_STUDENTS, year ?? {}, emp ?? {}]
            });
        }
    };
};

export const useMasterYearLossSection = (asmay_id?: number, asmcl_id?: number, asms_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_YEAR_LOSS_SECTION, asmay_id ?? {}, asmcl_id ?? {}, asms_id ?? {}],
            queryFn: async () => {
                if (!asmay_id || asmay_id <= 0 || !asmcl_id || asmcl_id <= 0 || !asms_id || asms_id <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterYearLossSection(asmay_id, asmcl_id, asms_id);
            },
            enabled: Boolean(asmay_id && asmay_id > 0 && asmcl_id && asmcl_id > 0 && asms_id && asms_id > 0),
            staleTime: 0
        }),
        refetchAll: (year?: number, emp?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_YEAR_LOSS_SECTION, year ?? {}, emp ?? {}]
            });
        }
    };
};

export const useMasterChangeSectionTable = (searchParams?: ApiSearchparams, asmay_id?: number, asmcl_id?: number, asms_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CHANGE_SECTION_TABLE, searchParams ?? {}, asmay_id ?? {}, asmcl_id ?? {}, asms_id ?? {}],
            queryFn: async () => {
                if (!asmay_id || asmay_id <= 0 || !asmcl_id || asmcl_id <= 0 || !asms_id || asms_id <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterChangeSectionTable(searchParams ?? {}, asmay_id, asmcl_id, asms_id);
            },
            enabled: Boolean(asmay_id && asmay_id > 0 && asmcl_id && asmcl_id > 0 && asms_id && asms_id > 0),
            staleTime: 0
        }),
        refetchAll: (year?: number, emp?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CHANGE_SECTION_TABLE, year ?? {}, emp ?? {}]
            });
        }
    };
};

export const useMasterNewSectionStudents = (asmay_id?: number, asmcl_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_STUDENTS, asmay_id ?? {}, asmcl_id ?? {}],
            queryFn: async () => {
                if (!asmay_id || asmay_id <= 0 || !asmcl_id || asmcl_id <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterNewSectionStudents(asmay_id, asmcl_id);
            },
            enabled: Boolean(asmay_id && asmay_id > 0 && asmcl_id && asmcl_id > 0),
            staleTime: 0
        }),
        refetchAll: (year?: number, emp?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_STUDENTS, year ?? {}, emp ?? {}]
            });
        }
    };
};

export const useMasterStudentList = (asmay_id?: number, asmcl_id?: number, asms_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_STUDENT_LIST, asmay_id ?? {}, asmcl_id ?? {}, asms_id ?? {}],
            queryFn: async () => {
                if (!asmay_id || asmay_id <= 0 || !asmcl_id || asmcl_id <= 0 || !asms_id || asms_id <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterStudentList(asmay_id, asmcl_id, asms_id);
            },
            enabled: Boolean(asmay_id && asmay_id > 0 && asmcl_id && asmcl_id > 0 && asms_id && asms_id > 0),
            staleTime: 0
        }),
        refetchAll: (year?: number, emp?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_STUDENT_LIST, year ?? {}, emp ?? {}]
            });
        }
    };
};

export const useMasterUpdateStudentRoles = (asmay_id?: number, asmcl_id?: number, asms_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_STUDENT_ROLES, asmay_id ?? {}, asmcl_id ?? {}, asms_id ?? {}],
            queryFn: async () => {
                if (!asmay_id || asmay_id <= 0 || !asmcl_id || asmcl_id <= 0 || !asms_id || asms_id <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterStudentRoles(asmay_id, asmcl_id, asms_id);
            },
            enabled: Boolean(asmay_id && asmay_id > 0 && asmcl_id && asmcl_id > 0 && asms_id && asms_id > 0),
            staleTime: 0
        }),
        refetchAll: (year?: number, emp?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_STUDENT_ROLES, year ?? {}, emp ?? {}]
            });
        }
    };
};

export const useMasterChangeClassStudents = (asmay_id?: number, asmcl_id?: number, asms_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CHANGE_CLASS_STUDENTS, asmay_id ?? {}, asmcl_id ?? {}, asms_id ?? {}],
            queryFn: async () => {
                if (!asmay_id || asmay_id <= 0 || !asmcl_id || asmcl_id <= 0 || !asms_id || asms_id <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterChangeClassStudents(asmay_id, asmcl_id, asms_id);
            },
            enabled: Boolean(asmay_id && asmay_id > 0 && asmcl_id && asmcl_id > 0 && asms_id && asms_id > 0),
            staleTime: 0
        }),
        refetchAll: (year?: number, emp?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CHANGE_CLASS_STUDENTS, year ?? {}, emp ?? {}]
            });
        }
    };
};
