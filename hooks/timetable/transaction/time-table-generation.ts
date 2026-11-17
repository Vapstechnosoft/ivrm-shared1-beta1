import { TIMETABLE_QUERY_KEYS } from '@/constants/Timetable-query-keys';
import { getGenerationMasters } from '@/server/timetable/transactions/time-table-generation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGenerationMasters = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TIMETABLE_QUERY_KEYS.TT_GENERATION_MASTERS],
            queryFn: async () => getGenerationMasters(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TIMETABLE_QUERY_KEYS.TT_GENERATION_MASTERS]
            });
        }
    };
};
