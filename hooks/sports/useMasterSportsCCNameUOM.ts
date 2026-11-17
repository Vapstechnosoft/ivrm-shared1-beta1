import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMasterSportsCCNameUOMs } from '@/server/sports/masters/sports-cc-name-uom';

export const useMasterSportsCCNameUOM = (searchParams?: any) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['master-sports-cc-name-uom', searchParams ?? {}],
        queryFn: async () => getMasterSportsCCNameUOMs(),
        staleTime: 0
    });

    return {
        ...query,
        refetchAll: async () => {
            return await queryClient.invalidateQueries({
                queryKey: ['master-sports-cc-name-uom']
            });
        }
    };
};
