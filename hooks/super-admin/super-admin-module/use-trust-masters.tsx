import { getCountryList, getStateList, getTrustMasterData } from '@/server/super-admin/super-admin-module/masters/trust-master';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiSearchparams } from '@/types';

export const useTrustMasterData = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['trust_master_data', searchParams ?? {}],
            queryFn: async () => {
                const response = await getTrustMasterData(searchParams);
                return response;
            },
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['trust_master_data']
            });
        }
    };
};

export const useCountryListData = () => {
    return useQuery({
        queryKey: ['country_list_data'],
        queryFn: async () => {
            const response = await getCountryList();
            return response;
        }
    });
};

export const useStateListData = (countryId: number) => {
    return useQuery({
        queryKey: ['state_list_data', countryId],
        queryFn: async () => {
            const response = await getStateList(countryId);
            return response;
        },
        enabled: !!countryId // Only fetch if countryId is provided
    });
};
