import { ADMISSION_QUERY_KEYS, PREADMISSION_QUERY_KEYS } from '@/constants/query-keys';
import {
    getPreadmissionClassDropdown1,
    getadmissionSectionDropdown
} from '@/server/admission/preadmission/reports/student_yearly_attendance';
import { getAdmissionClassDropdown } from '@/server/admission/preadmission/section/sections';
import {
    getCasteDropdown,
    getCountryDropdown,
    getGenderDropdown,
    getPreadmissionClassDropdown,
    getPreadmissionDocumentDropdown,
    getReferenceDropdown,
    getReligionDropdown,
    getSourceDropdown,
    getStateDropdown,
    getStudentApplicationForm,
    getStudentApplicationList,
    getDistrictDropdown
} from '@/server/admission/preadmission/transactions/application_form';
import { getDocumentView, getDocumentpdf } from '@/server/admission/preadmission/transactions/document-view';
import { getExportPreadmissionStudentList } from '@/server/admission/preadmission/transactions/export_preadmission';
import { getPreadmissionStatusCountReport } from '@/server/admission/preadmission/transactions/preadmission_reports';
import {
    getActivePreadmissionDetails,
    getApplicationStatusDropdown,
    getApplicationStudentList
} from '@/server/admission/preadmission/transactions/transfer_application_status';
import {
    getPreadmissionAdmissionStatusDropdown,
    getPreadmissionStudentList
} from '@/server/admission/preadmission/transactions/transfer_preadmission_status';
import type { ApiSearchparams } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useReligionDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.RELIGION_DROPDOWN],
            queryFn: async () => getReligionDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.RELIGION_DROPDOWN]
            });
        }
    };
};

export const useCasteDropdown = (religion_id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.CASTE_DROPDOWN, religion_id],
            queryFn: async () => getCasteDropdown(religion_id),
            staleTime: 0,
            enabled: !!religion_id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.CASTE_DROPDOWN]
            });
        }
    };
};

export const useCountryDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.COUNTRY_DROPDOWN],
            queryFn: async () => getCountryDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.COUNTRY_DROPDOWN]
            });
        }
    };
};


export const useStateDropdown = (country_id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.STATE_DROPDOWN, country_id],
            queryFn: async () => getStateDropdown(country_id),
            staleTime: 0,
            enabled: !!country_id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.STATE_DROPDOWN]
            });
        }
    };
};

export const useDistrictDropdown = (state_id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['district_dropdown', state_id],
            queryFn: async () => getDistrictDropdown(state_id),
            staleTime: 0,
            enabled: !!state_id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['district_dropdown']
            });
        }
    };
};


export const useGenderDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.GENDER_DROPDOWN],
            queryFn: async () => getGenderDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.GENDER_DROPDOWN]
            });
        }
    };
};

export const useSourceDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.SOURCE_DROPDOWN],
            queryFn: async () => getSourceDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.SOURCE_DROPDOWN]
            });
        }
    };
};

export const useReferenceDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.REFERENCE_DROPDOWN],
            queryFn: async () => getReferenceDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.REFERENCE_DROPDOWN]
            });
        }
    };
};




export const usePreadmissionDocumentsDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_DOCUMENTS_DROPDOWN],
            queryFn: async () => getPreadmissionDocumentDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_DOCUMENTS_DROPDOWN]
            });
        }
    };
};

export const usePreadmissionClassDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_CLASS_DROPDOWN],
            queryFn: async () => getPreadmissionClassDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_CLASS_DROPDOWN]
            });
        }
    };
};

export const useActivePreadmissionDetails = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.ACTIVE_PREADMISSION_DETAILS],
            queryFn: async () => getActivePreadmissionDetails(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.ACTIVE_PREADMISSION_DETAILS]
            });
        }
    };
};

export const useStudentApplicationList = (asmay_id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.STUDENT_APPLICATION_LIST, asmay_id, searchParams ?? {}],
            queryFn: async () => getStudentApplicationList(asmay_id, searchParams),
            staleTime: 0,
            enabled: !!asmay_id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.STUDENT_APPLICATION_LIST]
            });
        }
    };
};

export const useApplicationStatusDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.APPLICATION_STATUS_DROPDOWN],
            queryFn: async () => getApplicationStatusDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.APPLICATION_STATUS_DROPDOWN]
            });
        }
    };
};

export const useApplicationStudentList = (asmay_id: number, asmcl_id: number, pasraps_id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.APPLICATION_STUDENT_LIST, asmay_id, asmcl_id, pasraps_id, searchParams ?? {}],
            queryFn: async () => getApplicationStudentList(asmay_id, asmcl_id, pasraps_id, searchParams),
            staleTime: 0,
            enabled: !!asmay_id && !!pasraps_id && asmcl_id !== undefined
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.APPLICATION_STUDENT_LIST]
            });
        }
    };
};

export const usePreadmissionAdmissionStatusDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_ADMISSION_STATUS_DROPDOWN],
            queryFn: async () => getPreadmissionAdmissionStatusDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_ADMISSION_STATUS_DROPDOWN]
            });
        }
    };
};

export const usePreadmissionStudentList = (asmay_id: number, asmcl_id: number, pamst_id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_STUDENT_LIST, asmay_id, asmcl_id, pamst_id, searchParams ?? {}],
            queryFn: async () => getPreadmissionStudentList(asmay_id, asmcl_id, pamst_id, searchParams),
            staleTime: 0,
            enabled: !!asmay_id && !!pamst_id && asmcl_id !== undefined
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_STUDENT_LIST]
            });
        }
    };
};

export const useExportPreadmissionStudentList = (asmay_id: number, asmcl_id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.EXPORT_PREADMISSION_STUDENT_LIST, asmay_id, asmcl_id, searchParams ?? {}],
            queryFn: async () => getExportPreadmissionStudentList(asmay_id, asmcl_id, searchParams),
            staleTime: 0,
            enabled: !!asmay_id && asmcl_id !== undefined
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.EXPORT_PREADMISSION_STUDENT_LIST]
            });
        }
    };
};

export const usePreadmissionStatusCountReport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_STATUS_COUNT_REPORT],
            queryFn: async () => getPreadmissionStatusCountReport(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.PREADMISSION_STATUS_COUNT_REPORT]
            });
        }
    };
};

export const useDocumentView = (asmay_id: number, asmcl_id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.DOCUMENT_VIEW, asmay_id, asmcl_id, searchParams ?? {}],
            queryFn: async () => getDocumentView(asmay_id, asmcl_id, searchParams),
            staleTime: 0,
            enabled: !!asmay_id && asmcl_id !== undefined
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.DOCUMENT_VIEW]
            });
        }
    };
};

export const useDocumentDownload = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pasr_id: number) => getDocumentpdf(pasr_id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.DOCUMENT_DOWNLOAD]
            });
        }
    });
};

export const useStudentApplicationForm = (pasr_id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.STUDENT_APPLICATION_FORM, pasr_id],
            queryFn: async () => getStudentApplicationForm(pasr_id),
            staleTime: 0,
            enabled: !!pasr_id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.STUDENT_APPLICATION_FORM]
            });
        }
    };
};

export const useAdmissionClassDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_DROPDOWN],
            queryFn: async () => getAdmissionClassDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_DROPDOWN]
            });
        }
    };
};
export const usePreadmissionClassDropdown1 = () => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_CLASS_DROPDOWN1],
            queryFn: async () => getPreadmissionClassDropdown1(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_CLASS_DROPDOWN1]
            });
        }
    };
};
export const useadmissionSectionDropdown = (asmcl_id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_SECTION_DROPDOWN, asmcl_id ?? {}],
            queryFn: async () => {
                if (!asmcl_id || Number(asmcl_id) <= 0) {
                    return { data: [] } as any;
                }
                return await getadmissionSectionDropdown(Number(asmcl_id));
            },
            staleTime: 0,
            enabled: Boolean(asmcl_id && Number(asmcl_id) > 0)
        }),
        refetchAll: (id?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_SECTION_DROPDOWN, id ?? {}]
            });
        }
    };
};
