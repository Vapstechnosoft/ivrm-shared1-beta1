import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';
import { getInvMasterStore } from '@/server/inventory/masters/inv-master-store';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useInvMasterStore = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_STORE, searchParams ?? {}],
        queryFn: async () => getInvMasterStore(searchParams ?? {}),
        staleTime: 0
    });

    return {
        ...query,
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_STORE]
            });
        }
    };
};
