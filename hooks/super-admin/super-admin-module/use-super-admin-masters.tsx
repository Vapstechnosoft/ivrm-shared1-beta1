import { SUPER_ADMIN_QUERY_KEYS } from '@/constants/query-keys';
import {
    UpdatedOrderdSuperAdminMasters,
    getSuperAdminMaster,
    getSuperAdminMasterOrderData
} from '@/server/super-admin/super-admin-module/masters/super-admin';
import type { ISuperAdminMasterOrder } from '@/types/super-admin/super-admin-module/masters';
import type { ApiSearchparams } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSuperAdminMaster = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [SUPER_ADMIN_QUERY_KEYS.SUPER_ADMIN_MASTER, searchParams ?? {}],
            queryFn: async () => getSuperAdminMaster(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [SUPER_ADMIN_QUERY_KEYS.SUPER_ADMIN_MASTER]
            });
        }
    };
};

export const useMasterOrderedSuperAdminDropdownList = () => {
    return useQuery({
        queryKey: [SUPER_ADMIN_QUERY_KEYS.SUPER_ADMIN_MASTER_ORDER],
        queryFn: () => getSuperAdminMasterOrderData(),
        staleTime: 0
    });
};

export const useUpdateSuperAdminMasterOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ISuperAdminMasterOrder[]) => UpdatedOrderdSuperAdminMasters(data),
        onSuccess: (data) => {
            if (data.status === 200) {
                toast.success('Order Updated Successfully');
                queryClient.invalidateQueries({
                    queryKey: [SUPER_ADMIN_QUERY_KEYS.SUPER_ADMIN_MASTER]
                });
            } else {
                toast.error('Failed to update order');
            }
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        }
    });
};
