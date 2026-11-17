import { EXAM_QUERY_KEYS } from '@/constants/query-keys';
import { getExamStandard } from '@/server/exam/exam-module/configurations/exam-standard';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useExamStandard = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_STANDARD, searchParams ?? {}],
            queryFn: async () => getExamStandard(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_STANDARD]
            });
        }
    };
};
