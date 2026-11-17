'use client';

import { getInstitutionSubscriptionData } from '@/server/super-admin/super-admin-module/institution/institution-subscription';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiSearchparams } from '@/types';

export const useInstitutionSubscriptionData = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['institution_subscription_data', searchParams ?? {}],
            queryFn: async () => {
                const response = await getInstitutionSubscriptionData(searchParams);
                return response;
            },
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['institution_subscription_data']
            });
        }
    };
};
