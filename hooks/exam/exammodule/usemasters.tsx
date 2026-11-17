import { EXAM_QUERY_KEYS } from '@/constants/query-keys';
import { getExamMasterCategory, getExamMasterCategoryDropdownList } from '@/server/exam/exam-module/masters/category';

import { getExamMasterCategoryMapping } from '@/server/exam/exam-module/masters/category-class-mapping';
import { getCoScholasticActivities } from '@/server/exam/exam-module/masters/co-scholastic-activity';
import {
    getCoScholasticActivity,
    getCoScholasticActivityArea,
    getCoScholasticArea
} from '@/server/exam/exam-module/masters/co-scholastic-area';

import { getCategoryMappedSections } from '@/server/exam/exam-module/masters/category-class-mapping';

import { getMasterExam, getMasterExamOrderData } from '@/server/exam/exam-module/masters/exam';
import { getMasterExamPaper } from '@/server/exam/exam-module/masters/exam-paper';
import { getGradeDetailsById, getMasterGrade, getMasterGradeDropdownList } from '@/server/exam/exam-module/masters/grade';
import { getMasterLifeSkillAreas, getMasterLifeSkillMappings, getMasterLifeSkills } from '@/server/exam/exam-module/masters/life-skills';
import { getMasterSubExam, getMasterSubExamDropdownList } from '@/server/exam/exam-module/masters/sub-exam';
import { getMasterSubject, getMasterSubjectDropdownList } from '@/server/exam/exam-module/masters/subject';
import {
    getAllMasterSubjectDetails,
    getMasterSubjectGroup,
    getMasterSubjectGroupDetails,
    getSubjectsGroupDropDownByList
} from '@/server/exam/exam-module/masters/subject-group';
import { getMasterSubSubject, getMasterSubSubjectDropdownList } from '@/server/exam/exam-module/masters/sus-subject';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterSubject = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT, searchParams ?? {}],
            queryFn: async () => getMasterSubject(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT]
            });
        }
    };
};

export const useGetMasterSubjectDropdownList = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_DROPDOWN_LIST, searchParams ?? {}],
            queryFn: async () => getMasterSubjectDropdownList(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_DROPDOWN_LIST]
            });
        }
    };
};

export const useMasterExam = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_EXAM, searchParams ?? {}],
            queryFn: async () => getMasterExam(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_EXAM]
            });
        }
    };
};

export const useMasterOrderedExamDropdownList = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_EXAM_ORDERED_DROPDOWN_LIST, searchParams ?? {}],
            queryFn: async () => getMasterExamOrderData(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_EXAM_ORDERED_DROPDOWN_LIST]
            });
        }
    };
};

export const useMasterExamPaper = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_EXAM_PAPER, searchParams ?? {}],
            queryFn: async () => getMasterExamPaper(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_EXAM_PAPER]
            });
        }
    };
};

export const useMasterSubExam = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUB_EXAM, searchParams ?? {}],
            queryFn: async () => getMasterSubExam(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUB_EXAM]
            });
        }
    };
};

export const useMasterSubExamDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUB_EXAM_DROPDOWN_LIST],
            queryFn: async () => getMasterSubExamDropdownList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUB_EXAM_DROPDOWN_LIST]
            });
        }
    };
};

export const useMasterSubSubject = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUB_SUBJECT_EX, searchParams ?? {}],
            queryFn: async () => getMasterSubSubject(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUB_SUBJECT_EX]
            });
        }
    };
};

export const useMasterSubSubjectDropdownList = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUB_SUBJECT_EX_DROPDOWN_LIST, searchParams ?? {}],
            queryFn: async () => getMasterSubSubjectDropdownList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUB_SUBJECT_EX_DROPDOWN_LIST]
            });
        }
    };
};

export const useMasterGrade = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_GRADE_EX, searchParams ?? {}],
            queryFn: async () => getMasterGrade(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_GRADE_EX]
            });
        }
    };
};

export const useMasterGradeDropdownList = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_GRADE_DROPDOWN_LIST, searchParams ?? {}],
            queryFn: async () => getMasterGradeDropdownList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_GRADE_DROPDOWN_LIST]
            });
        }
    };
};

export const useMasterGradeDetails = (gradeId: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_GRADE_DETAILS, gradeId],
            queryFn: async () => getGradeDetailsById(gradeId),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_GRADE_DETAILS]
            });
        }
    };
};

export const useMasterSubjectGroup = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_GROUP_, searchParams ?? {}],
            queryFn: async () => getMasterSubjectGroup(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_GROUP_]
            });
        }
    };
};

export const useMasterSubjectGroupDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_GROUP_DROPDOWN_LIST],
            queryFn: async () => getSubjectsGroupDropDownByList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_GROUP_DROPDOWN_LIST]
            });
        }
    };
};

// ✅ Fetch details for a single Master Subject Group
export const useMasterSubjectGroupDetails = (subjectGroupId: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_GROUP_DETAILS, subjectGroupId],
            queryFn: async () => getMasterSubjectGroupDetails(subjectGroupId),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_SUBJECT_GROUP_DETAILS]
            });
        }
    };
};

export const useMasterGetAllSubjectGroupDetails = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_ALL_SUBJECT_GROUP_DETAILS, searchParams ?? {}],
            queryFn: async () => getAllMasterSubjectDetails(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_ALL_SUBJECT_GROUP_DETAILS]
            });
        }
    };
};

// MASTER CATEGORY --------------------------------------

export const useMasterCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_CATEGORY, searchParams ?? {}],
            queryFn: async () => getExamMasterCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_CATEGORY]
            });
        }
    };
};
export const useMasterCategoryDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_CATEGORY_DROPDOWN_LIST],
            queryFn: async () => getExamMasterCategoryDropdownList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_CATEGORY_DROPDOWN_LIST]
            });
        }
    };
};

export const useMasterCategoryClassMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_CATEGORY_CLASS_MAPPING, searchParams ?? {}],
            queryFn: async () => getExamMasterCategoryMapping(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_CATEGORY_CLASS_MAPPING]
            });
        }
    };
};

export const useMasterCategoryMappedSections = (academicYear: number, category: number, className: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.MASTER_CATEGORY_CLASS_MAPPED_SECTIONS],
            queryFn: async () => getCategoryMappedSections(academicYear, category, className),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.MASTER_CATEGORY_CLASS_MAPPED_SECTIONS]
            });
        }
    };
};
export const useCoScholasticArea = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    searchParams?.sort_direction;
    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_AREA, searchParams ?? {}],
            queryFn: async () => getCoScholasticArea(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_AREA]
            });
        }
    };
};
export const useCoScholasticActivityDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_ACTIVITY_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getCoScholasticActivity(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_ACTIVITY_DROPDOWN]
            });
        }
    };
};
export const useCoScholasticActivityAreaDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_AREA_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getCoScholasticActivityArea(searchParams),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_AREA_DROPDOWN]
            });
        }
    };
};

export const useCoScholasticActivity = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_ACTIVITY, searchParams ?? {}],
            queryFn: async () => getCoScholasticActivities(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.CO_SCHOLASTIC_ACTIVITY]
            });
        }
    };
};

export const useMasterLifeSkills = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    searchParams?.sort_direction;
    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.LIFE_SKILLS, searchParams ?? {}],
            queryFn: async () => getMasterLifeSkills(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.LIFE_SKILLS]
            });
        }
    };
};

export const useMasterLifeSkillArea = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    searchParams?.sort_direction;
    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.LIFE_SKILLS_AREA, searchParams ?? {}],
            queryFn: async () => getMasterLifeSkillAreas(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.LIFE_SKILLS_AREA]
            });
        }
    };
};

export const useMasterLifeSkillAreaMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    searchParams?.sort_direction;
    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.LIFE_SKILLS_AREA_MAPPING, searchParams ?? {}],
            queryFn: async () => getMasterLifeSkillMappings(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.LIFE_SKILLS_AREA_MAPPING]
            });
        }
    };
};
