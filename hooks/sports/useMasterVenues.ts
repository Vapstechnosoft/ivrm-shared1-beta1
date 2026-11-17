import { getMasterVenues } from '@/server/sports/masters/venue';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterVenues = (searchParams?: any) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['master-venues', searchParams],
            queryFn: async () => getMasterVenues(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['master-venues']
            });
        }
    };
};
