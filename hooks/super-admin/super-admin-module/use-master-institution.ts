import { getCountryDropdown, getInstitutionDropdown, getMasterInstitutionData, getStateDropdown } from '@/server/super-admin/super-admin-module/institution/master-institution';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiSearchparams } from '@/types';

export const useMasterInstitutionData = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['master_institution_data', searchParams ?? {}],
            queryFn: async () => {
                const response = await getMasterInstitutionData(searchParams);
                return response;
            },
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['master_institution_data']
            });
        }
    };
};

export const useCountryDropdown = () => {
    return useQuery({
        queryKey: ['country_dropdown_data'],
        queryFn: async () => {
            const response = await getCountryDropdown();
            return response;
        },
        staleTime: 1000 * 60 * 60 // 1 hour as countries don't change often
    });
};

export const useStateDropdown = (ivrmmC_Id?: number) => {
    return useQuery({
        queryKey: ['state_dropdown_data', ivrmmC_Id],
        queryFn: async () => {
            if (!ivrmmC_Id) return null;
            const response = await getStateDropdown(ivrmmC_Id);
            return response;
        },
        enabled: !!ivrmmC_Id,
        staleTime: 1000 * 60 * 60 // 1 hour
    });
};

export const useInstitutionSubscriptionDropdown = () => {
    return useQuery({
        queryKey: ['institution_subscription_dropdown_data'],
        queryFn: async () => {
            const response = await getInstitutionDropdown();
            return response;
        },
        staleTime: 1000 * 60 * 60 // 1 hour
    });
};
