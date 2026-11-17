'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getInvMasterUOM } from '@/server/inventory/masters/inv-master-uom';
import { ApiSearchparams } from '@/types';
import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';

export const useInvMasterUom = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_UOM, searchParams ?? {}],
        queryFn: () => getInvMasterUOM(searchParams ?? {}),
        staleTime: 0
    });

    return {
        ...query,
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_UOM]
            });
        }
    };
};
