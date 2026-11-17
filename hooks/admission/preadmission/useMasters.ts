import { ADMISSION_QUERY_KEYS, EXAM_QUERY_KEYS } from '@/constants/query-keys';
import { getMasterStudentList } from '@/server/admission/preadmission/masters/active_deactive_student';
import { getMasterCaste, getMasterCasteCategoryDropdown } from '@/server/admission/preadmission/masters/caste';
import { getMasterCasteCategory, getMasterCasteCategoryCodeDropdown } from '@/server/admission/preadmission/masters/caste_category';
import { getMasterCategory } from '@/server/admission/preadmission/masters/category';
import { getClassSetOrder, getMasterClass } from '@/server/admission/preadmission/masters/class';
import {
    getAcademicYearDropdown,
    getClassCategorySection,
    getMasterCategoryDropdown,
    getMasterClassCategory,
    getMasterClassDropdown,
    getMasterSectionDropdown,
    getMasterUnmappedClassDropdown
} from '@/server/admission/preadmission/masters/class_category';
import { getMasterMonthDropDownList, getMasterSectionHeld } from '@/server/admission/preadmission/masters/class_held';
import { getEmployeeDrowpDown, getMasterClassTeacher, getTeacherClassSection } from '@/server/admission/preadmission/masters/class_teacher';
import { getMasterDocument } from '@/server/admission/preadmission/masters/document';
import { getMasterReference } from '@/server/admission/preadmission/masters/reference';
import { getMasterReligion } from '@/server/admission/preadmission/masters/religion';
import {
    getMasterReligionCasteCategory,
    getUnmappedCasteCategoryDropdown
} from '@/server/admission/preadmission/masters/religion_caste_category';
import { getMasterSection, getSectionSetOrder } from '@/server/admission/preadmission/masters/section';
import { getMasterSource } from '@/server/admission/preadmission/masters/source';
import { getConcessionDropdown } from '@/server/admission/preadmission/reports/report';
import { getMasterSubjectDropdownList } from '@/server/exam/exam-module/masters/subject';
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

export const useMasterCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CATEGORY, searchParams ?? {}],
            queryFn: async () => getMasterCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CATEGORY]
            });
        }
    };
};

export const useMasterSection = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_SECTION, searchParams ?? {}],
            queryFn: async () => getMasterSection(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_SECTION]
            });
        }
    };
};

export const useMasterClassCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_CATEGORY, searchParams ?? {}],
            queryFn: async () => getMasterClassCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_CATEGORY]
            });
        }
    };
};

export const useAcademicYearDropdown = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ACADEMIC_DROPDOWN],
            queryFn: async () => getAcademicYearDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ACADEMIC_DROPDOWN]
            });
        }
    };
};

export const useMasterClassDropdown = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_DROPDOWN],
            queryFn: async () => getMasterClassDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_DROPDOWN]
            });
        }
    };
};

export const useMasterSectionDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_SECTION_DROPDOWN],
            queryFn: async () => getMasterSectionDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_SECTION_DROPDOWN]
            });
        }
    };
};

export const useMasterReligion = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_RELIGION, searchParams ?? {}],
            queryFn: async () => getMasterReligion(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_RELIGION]
            });
        }
    };
};

export const useMasterCasteCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CASTE_CATEGORY, searchParams ?? {}],
            queryFn: async () => getMasterCasteCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CASTE_CATEGORY]
            });
        }
    };
};

export const useMasterCasteCategoryCodeDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CASTE_CATEGORY_CODE_DROPDOWN],
            queryFn: async () => getMasterCasteCategoryCodeDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CASTE_CATEGORY_CODE_DROPDOWN]
            });
        }
    };
};

export const useMasterCaste = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CASTE, searchParams ?? {}],
            queryFn: async () => getMasterCaste(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CASTE]
            });
        }
    };
};

export const useMasterCasteCategoryDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CASTE_CATEGORY_DROPDOWN],
            queryFn: async () => getMasterCasteCategoryDropdown(),
            staleTime: 0,
            refetchInterval: 5000
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CASTE_CATEGORY_DROPDOWN]
            });
        }
    };
};

export const useMasterDocument = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_DOCUMENT, searchParams ?? {}],
            queryFn: async () => getMasterDocument(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_DOCUMENT]
            });
        }
    };
};

export const useMasterReference = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_REFERENCE, searchParams ?? {}],
            queryFn: async () => getMasterReference(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_REFERENCE]
            });
        }
    };
};

export const useMasterSource = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_SOURCE, searchParams ?? {}],
            queryFn: async () => getMasterSource(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_SOURCE]
            });
        }
    };
};

export const useMasterReligionCasteCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_RELIGION_CASTE_CATEGORY, searchParams ?? {}],
            queryFn: async () => getMasterReligionCasteCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_RELIGION_CASTE_CATEGORY]
            });
        }
    };
};

export const useUnmappedCasteCategoryDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.UNMAPPED_CASTE_CATEGORY_DROPDOWN],
            queryFn: async () => getUnmappedCasteCategoryDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.UNMAPPED_CASTE_CATEGORY_DROPDOWN]
            });
        }
    };
};
export const useClassTeacher = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_TEACHER, searchParams ?? {}],
            queryFn: async () => getMasterClassTeacher(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_TEACHER]
            });
        }
    };
};
export const useClassTeacherEmployee = (asmaY_Id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_TEACHER_EMPLOYEE, asmaY_Id ?? {}],
            queryFn: async () => {
                if (!asmaY_Id || Number(asmaY_Id) <= 0) {
                    return { data: [] } as any;
                }
                return await getEmployeeDrowpDown(Number(asmaY_Id));
            },
            enabled: Boolean(asmaY_Id && Number(asmaY_Id) > 0),
            staleTime: 0
        }),
        refetchAll: (id?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_TEACHER_EMPLOYEE, id ?? {}]
            });
        }
    };
};
export const usegetExchangeClassSection = (asmaY_Id?: number, hrmE_Id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_EXCHANGE_CLASS_TEACHER_MAPPING, asmaY_Id ?? {}, hrmE_Id ?? {}],
            queryFn: async () => {
                if (!asmaY_Id || asmaY_Id <= 0 || !hrmE_Id || hrmE_Id <= 0) {
                    return { data: [] } as any;
                }
                return await getTeacherClassSection(asmaY_Id, hrmE_Id);
            },
            enabled: Boolean(asmaY_Id && asmaY_Id > 0 && hrmE_Id && hrmE_Id > 0),
            staleTime: 0
        }),
        refetchAll: (year?: number, emp?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_EXCHANGE_CLASS_TEACHER_MAPPING, year ?? {}, emp ?? {}]
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
export const useMasterStudentList = (
    amst_sol?: string,
    asmay_id?: number,
    asmcl_id?: number,
    asms_id?: number,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [
                ADMISSION_QUERY_KEYS.ACTIVE_DEACTIVE_STUDENTS,
                amst_sol ?? {},
                asmay_id ?? {},
                asmcl_id ?? {},
                asms_id ?? {},
                searchParams ?? {}
            ],
            queryFn: async () => {
                if (!amst_sol || !asmay_id || asmay_id <= 0 || !asmcl_id || asmcl_id <= 0 || !asms_id || asms_id <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterStudentList(amst_sol, asmay_id, asmcl_id, asms_id, searchParams);
            },
            enabled: Boolean(amst_sol && asmay_id && asmay_id > 0 && asmcl_id && asmcl_id > 0 && asms_id && asms_id > 0),
            staleTime: 0
        }),
        refetchAll: (amst_solArg?: string, year?: number, clazz?: number, section?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ACTIVE_DEACTIVE_STUDENTS, amst_solArg ?? {}, year ?? {}, clazz ?? {}, section ?? {}]
            });
        }
    };
};
export const useMasterClassCategorySection = (asmcc_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_CATEGORY_SECTION, asmcc_id ?? {}],
            queryFn: async () => {
                if (!asmcc_id || Number(asmcc_id) <= 0) {
                    return { data: [] } as any;
                }
                return await getClassCategorySection(Number(asmcc_id));
            },
            enabled: Boolean(asmcc_id && Number(asmcc_id) > 0),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_CATEGORY_SECTION]
            });
        }
    };
};

export const useMasterUnMappedClassDropdown = (asmaY_Id?: number, amC_Id?: number) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_UNMAPPED_CLASS_DROPDOWN, asmaY_Id, amC_Id],
            queryFn: async () => getMasterUnmappedClassDropdown(asmaY_Id, amC_Id),
            staleTime: 0,
            enabled: !!asmaY_Id && !!amC_Id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_UNMAPPED_CLASS_DROPDOWN]
            });
        }
    };
};
export const useConcessionDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.CONCESSION_DROPDOWN_DATA],
            queryFn: async () => getConcessionDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.CONCESSION_DROPDOWN_DATA]
            });
        }
    };
};

export const useMasterCategoryDropdown = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CATEGORY_DROPDOWN],
            queryFn: async () => getMasterCategoryDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CATEGORY_DROPDOWN]
            });
        }
    };
};

export const useMasterSubjectDropdown = (mI_Id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_DROPDOWN_LIST, mI_Id ?? {}],
            queryFn: async () => {
                if (!mI_Id || mI_Id <= 0) {
                    return { data: [] } as any;
                }
                return await getMasterSubjectDropdownList();
            },
            enabled: Boolean(mI_Id && mI_Id > 0),
            staleTime: 0
        }),
        refetchAll: (id?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_DROPDOWN_LIST, id ?? {}]
            });
        }
    };
};
