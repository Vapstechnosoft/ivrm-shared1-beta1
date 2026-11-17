'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserGroupData } from '@/server/inventory/masters/user-group'; // Create this file
import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';
import { ApiSearchparams } from '@/types';

export const useInvMasterUserGroup = (searchParams?: ApiSearchparams) => {
    const query = useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_GROUP, 'user-group', searchParams],
        queryFn: () => fetchUserGroupData(searchParams),
        staleTime: 0
    });

    return {
        ...query,
        refetchAll: query.refetch
    };
};
