import { getMasterEvents } from '@/server/sports/masters/events';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterEvents = (searchParams?: any) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['master-events', searchParams],
            queryFn: async () => getMasterEvents(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['master-events']
            });
        }
    };
};
