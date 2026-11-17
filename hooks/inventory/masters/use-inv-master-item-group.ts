'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchItemGroupData } from '@/server/inventory/masters/item-group';
import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';
import { ApiSearchparams } from '@/types';

export const useInvMasterItemGroup = (searchParams?: ApiSearchparams) => {
    const query = useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_GROUP, 'item-group', searchParams],
        queryFn: () => fetchItemGroupData(searchParams),
        staleTime: 0
    });

    return {
        ...query,
        refetchAll: query.refetch
    };
};
