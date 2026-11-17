import { getMasterHouseDesignations } from '@/server/sports/masters/house-designation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterHouseDesignation = (searchParams?: any) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['master-house-designation', searchParams],
            queryFn: async () => getMasterHouseDesignations(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['master-house-designation']
            });
        }
    };
};
