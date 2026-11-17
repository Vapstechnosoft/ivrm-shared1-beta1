'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchInvMasterGroupData } from '@/server/inventory/masters/inv-master-group';
import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';

import { ApiSearchparams } from '@/types';

export const useInvMasterGroup = (searchParams?: ApiSearchparams) => {
    const query = useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_GROUP, searchParams],
        queryFn: () => fetchInvMasterGroupData(searchParams),
        staleTime: 0
    });

    return {
        ...query,
        refetchAll: query.refetch
    };
};
