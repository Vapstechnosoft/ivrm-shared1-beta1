import { EXAM_QUERY_KEYS } from '@/constants/query-keys';
import { getExamWiseRemarksDataGrid } from '@/server/exam/exam-module/marks-entry/exam-wise-student-remarks';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useExamWiseRemarksDataGrid = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [EXAM_QUERY_KEYS.EXAM_WISE_REMARKS_DATA_GRID, searchParams ?? {}],
            queryFn: async () => getExamWiseRemarksDataGrid(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [EXAM_QUERY_KEYS.EXAM_WISE_REMARKS_DATA_GRID]
            });
        }
    };
};
