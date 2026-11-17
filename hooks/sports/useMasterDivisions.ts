import { getMasterDivisions } from '@/server/sports/masters/division';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterDivisions = (searchParams?: any) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['master-divisions', searchParams],
            queryFn: async () => getMasterDivisions(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['master-divisions']
            });
        }
    };
};
