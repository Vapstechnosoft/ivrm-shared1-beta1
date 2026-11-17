import { getMasterPrograms } from '@/server/sports/masters/program';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterPrograms = (searchParams?: any) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['master-programs', searchParams],
            queryFn: async () => getMasterPrograms(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['master-programs']
            });
        }
    };
};
