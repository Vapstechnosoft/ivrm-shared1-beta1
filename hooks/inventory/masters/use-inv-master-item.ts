'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getInvMasterItem } from '@/server/inventory/masters/inv-master-item';
import { ApiSearchparams } from '@/types';
import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';

export const useInvMasterItem = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_ITEM, searchParams ?? {}],
        queryFn: () => getInvMasterItem(searchParams ?? {}),
        staleTime: 0
    });

    return {
        ...query,
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_ITEM]
            });
        }
    };
};
