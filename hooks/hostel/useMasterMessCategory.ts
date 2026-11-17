'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessCategoryList } from '@/server/hostel/hostel-management/masters/mess-category';
import { ApiSearchparams } from '@/types';

export const useMasterMessCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['master-mess-category', searchParams],
            queryFn: () => getMessCategoryList(searchParams),
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['master-mess-category']
            });
        }
    };
};
