'use client';

import { getMasterHouses } from '@/server/sports/masters/house';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useMasterHouses() {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['master-houses'],
        queryFn: () => getMasterHouses()
    });

    const refetchAll = () => {
        queryClient.invalidateQueries({ queryKey: ['master-houses'] });
    };

    return {
        data,
        isLoading,
        error,
        refetchAll
    };
}
