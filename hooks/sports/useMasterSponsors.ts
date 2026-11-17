import { getMasterSponsors } from '@/server/sports/masters/sponsors';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterSponsors = (searchParams?: any) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['master-sponsors', searchParams],
            queryFn: async () => getMasterSponsors(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['master-sponsors']
            });
        }
    };
};
