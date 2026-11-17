import { ADMISSION_QUERY_KEYS } from '@/constants/query-keys';
import { getAllAdmissionLists, getStudentAdmissionFormById } from '@/server/admission/admission-form/admission';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiSearchparams } from '@/types';

export const useGetAllAdmissionLists = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_FORM_GET_ALL, searchParams ?? {}],
            queryFn: async () => getAllAdmissionLists(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_FORM_GET_ALL]
            });
        }
    };
};

export const useStudentAdmissionFormById = (amstId: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.STUDENT_ADMISSION_FORM, amstId],
            queryFn: async () => getStudentAdmissionFormById(amstId),
            staleTime: 0,
            enabled: !!amstId
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.STUDENT_ADMISSION_FORM]
            });
        }
    };
};
