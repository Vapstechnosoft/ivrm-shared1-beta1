import { EXAM_QUERY_KEYS } from '@/constants/query-keys';
import { getCoScholasticActivityAreaMapping } from '@/server/exam/exam-module/exam-mapping/co-scholastic-activitiy-area-mapping';
import {
    getClassTeacherDropdwonList,
    getEmployeeDropdwonList,
    getExamLoginPrivileges,
    getLoginPrivilegesDetails,
    getUserDropdwonList
} from '@/server/exam/exam-module/exam-mapping/exam-login-privilages';
import { getExamMarksProcessCondition } from '@/server/exam/exam-module/exam-mapping/exam-marks-process-condition';
import {
    getExamSubjectGroupMapping,
    getExamSubjectGroupMappingDetails
} from '@/server/exam/exam-module/exam-mapping/exam-subject-group-mapping';
import {
    getExamSubjectWizard,
    getExamSubjectWizardDetails,
    getSubExamsMappedList,
    getSubSubjectsAndSubExamsMappedList,
    getSubSubjectsMappedList
} from '@/server/exam/exam-module/exam-mapping/exam-subject-wizard';
import {
    getExamTermAndExamMapping,
    getExamTermAndExamMappingDetails
} from '@/server/exam/exam-module/exam-mapping/examTerm-and-exam-mappiong';
import { getHallTicketGeneratedList, getHallTicketStudentList } from '@/server/exam/exam-module/exam-mapping/hallTicket-generation';
import {
    getPromotionalSettingDetails,
    getPromotionalSettings,
    viewIndividualSubjectGroups,
    viewSubjectsGroupExams
} from '@/server/exam/exam-module/exam-mapping/promotional-setting';

import { getYearlyCategoryDatesMapping } from '@/server/exam/exam-module/exam-mapping/yearly-category-dates-mapping';
import { getYearlyCategorySubjectMapping } from '@/server/exam/exam-module/exam-mapping/yearly-category-subject-mapping';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useYearlyCategorySubjectMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.YEARLY_CATEGORY_SUBJECT_MAPPING, searchParams ?? {}],
            queryFn: async () => getYearlyCategorySubjectMapping(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.YEARLY_CATEGORY_SUBJECT_MAPPING]
            });
        }
    };
};

export const useExamLoginPrivileges = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_LOGIN_PRIVILAGES, searchParams ?? {}],
            queryFn: async () => getExamLoginPrivileges(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_LOGIN_PRIVILAGES]
            });
        }
    };
};

export const useExamLoginPrivilegesDetails = (elp_id: number, asmcl_id: number, asms_id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_LOGIN_PRIVILAGES_DETAILS, elp_id, asmcl_id, asms_id],
            queryFn: async () => getLoginPrivilegesDetails(elp_id, asmcl_id, asms_id),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_LOGIN_PRIVILAGES_DETAILS]
            });
        }
    };
};

export const useYearlyCategoryDateMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.YEARLY_CATEGORY_DATES_MAPPING, searchParams ?? {}],
            queryFn: async () => getYearlyCategoryDatesMapping(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.YEARLY_CATEGORY_DATES_MAPPING]
            });
        }
    };
};

export const useExamSubjectGroupMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_SUBJECT_GROUP_MAPPING, searchParams ?? {}],
            queryFn: async () => getExamSubjectGroupMapping(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_SUBJECT_GROUP_MAPPING]
            });
        }
    };
};
export const useExamSubjectGroupMappingDetails = (compulsary_flag: string, asmay_id: number, esG_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_SUBJECT_GROUP_MAPPING_DETAILS],
            queryFn: async () => getExamSubjectGroupMappingDetails(compulsary_flag, asmay_id, esG_Id),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_SUBJECT_GROUP_MAPPING_DETAILS]
            });
        }
    };
};

export const useExamTermAndExamMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_TERM_AND_EXAM_MAPPING, searchParams ?? {}],
            queryFn: async () => getExamTermAndExamMapping(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_TERM_AND_EXAM_MAPPING]
            });
        }
    };
};

export const useExamTermAndExamMappingDetails = (asmay_id: number, emca_id: number, ect_id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_TERM_AND_EXAM_MAPPING_DETAILS],
            queryFn: async () => getExamTermAndExamMappingDetails(asmay_id, emca_id, ect_id),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_TERM_AND_EXAM_MAPPING_DETAILS]
            });
        }
    };
};

export const useExamSubjectWizard = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_SUBJECT_WIZARD, searchParams ?? {}],
            queryFn: async () => getExamSubjectWizard(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_SUBJECT_WIZARD]
            });
        }
    };
};

export const useExamSubjectWizardDetails = (ecycE_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_SUBJECT_WIZARD_DETAILS],
            queryFn: async () => getExamSubjectWizardDetails(ecycE_Id),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_SUBJECT_WIZARD_DETAILS]
            });
        }
    };
};

export const useSubExamsMappedList = (eyceS_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.SUB_EXAMS_MAPPED_VIEW, eyceS_Id],
            queryFn: async () => getSubExamsMappedList(eyceS_Id),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.SUB_EXAMS_MAPPED_VIEW]
            });
        }
    };
};

export const useSubSubjectsMappedList = (eyceS_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.SUB_SUBJECTS_MAPPED_VIEW, eyceS_Id],
            queryFn: async () => getSubSubjectsMappedList(eyceS_Id),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.SUB_SUBJECTS_MAPPED_VIEW]
            });
        }
    };
};

export const useSubSubjectsAndSubExamsMappedList = (eyceS_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.SUB_BOTH_MAPPED_VIEW, eyceS_Id],
            queryFn: async () => getSubSubjectsAndSubExamsMappedList(eyceS_Id),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.SUB_BOTH_MAPPED_VIEW]
            });
        }
    };
};

export const useCoScholasticActivityAreaMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_ACTIVITY_AREA_MAPPING, searchParams ?? {}],
            queryFn: async () => getCoScholasticActivityAreaMapping(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_ACTIVITY_AREA_MAPPING]
            });
        }
    };
};

export const useExamMarksProcessCondition = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_MARKS_PROCESS_CONDITION, searchParams ?? {}],
            queryFn: async () => getExamMarksProcessCondition(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_MARKS_PROCESS_CONDITION]
            });
        }
    };
};

export const useHallTicketGeneratedList = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_HALL_TICKET_GENERATED_DATA, searchParams ?? {}],
            queryFn: async () => getHallTicketGeneratedList(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_HALL_TICKET_GENERATED_DATA]
            });
        }
    };
};

export const usegetHallTicketStudentList = (params: any, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_HALL_TICKET_STUDENT_LIST, searchParams ?? {}],
            queryFn: async () => getHallTicketStudentList(params),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_HALL_TICKET_STUDENT_LIST]
            });
        }
    };
};

export const usePromotionalSetting = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.PROMOTIONAL_SETTING_GRID, searchParams ?? {}],
            queryFn: async () => getPromotionalSettings(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.PROMOTIONAL_SETTING_GRID]
            });
        }
    };
};

export const usePromotionalSettingDetails = (emp_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.PROMOTIONAL_SETTING_DETAILS, emp_Id, searchParams ?? {}],
            queryFn: async () => getPromotionalSettingDetails(emp_Id),
            enabled: !!emp_Id,
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.PROMOTIONAL_SETTING_DETAILS]
            });
        }
    };
};

export const usePromotionalGroupMappings = (subjectId: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.PROMOTIONAL_GROUP_DETAILS, subjectId, searchParams ?? {}],
            queryFn: async () => viewIndividualSubjectGroups(subjectId),
            enabled: !!subjectId,
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.PROMOTIONAL_GROUP_DETAILS]
            });
        }
    };
};

export const usePromotionalGroupMappedExams = (groupId: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.PROMOTIONAL_GROUP_MAPPED_EXAMS_DETAILS, groupId, searchParams ?? {}],
            queryFn: async () => viewSubjectsGroupExams(groupId),
            enabled: !!groupId,
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.PROMOTIONAL_GROUP_MAPPED_EXAMS_DETAILS]
            });
        }
    };
};

export const useClassTeacherDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.CLASS_TEACHER_DROPDOWN_LIST],
            queryFn: async () => getClassTeacherDropdwonList(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.CLASS_TEACHER_DROPDOWN_LIST]
            });
        }
    };
};

export const useUserDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.USER_DROPDOWN_LIST_KEY],
            queryFn: async () => getUserDropdwonList(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.USER_DROPDOWN_LIST_KEY]
            });
        }
    };
};
export const useEmployeeDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EMPLOYEE_DROPDOWN_LIST],
            queryFn: async () => getEmployeeDropdwonList(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EMPLOYEE_DROPDOWN_LIST]
            });
        }
    };
};
