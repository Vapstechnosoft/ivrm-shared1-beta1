'use client';

import { getMasterUOMs } from '@/server/sports/masters/uom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useMasterUOMs(searchParams?: { [key: string]: string | string[] | undefined }) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['master-uoms', searchParams],
        queryFn: () => getMasterUOMs(searchParams as any)
    });

    const refetchAll = () => {
        queryClient.invalidateQueries({ queryKey: ['master-uoms'] });
    };

    return {
        data,
        isLoading,
        error,
        refetchAll
    };
}
