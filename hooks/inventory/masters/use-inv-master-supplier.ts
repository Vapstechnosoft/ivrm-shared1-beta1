import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';
import { getInvMasterSupplier } from '@/server/inventory/masters/inv-master-supplier';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useInvMasterSupplier = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_SUPPLIER, searchParams ?? {}],
        queryFn: async () => getInvMasterSupplier(searchParams ?? {}),
        staleTime: 0
    });

    return {
        ...query,
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_SUPPLIER]
            });
        }
    };
};
