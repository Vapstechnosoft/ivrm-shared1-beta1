import { INVENTORY_QUERY_KEYS } from '@/constants/query-keys';
import { getInvMasterTax, getInvMasterTaxDetails, getLedgerUnder } from '@/server/inventory/masters/inv-master-tax';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useInvMasterTax = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_TAX, searchParams ?? {}],
        queryFn: async () => getInvMasterTax(searchParams ?? {}),
        staleTime: 0
    });

    return {
        ...query,
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_TAX]
            });
        }
    };
};

export const useInvMasterTaxDetails = (id: number) => {
    return useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_TAX, 'details', id],
        queryFn: async () => getInvMasterTaxDetails(id),
        enabled: !!id
    });
};

export const useLedgerUnder = (famled_id: number) => {
    return useQuery({
        queryKey: [INVENTORY_QUERY_KEYS.INV_MASTER_TAX, 'ledger_under', famled_id],
        queryFn: async () => getLedgerUnder(famled_id),
        enabled: !!famled_id
    });
};
