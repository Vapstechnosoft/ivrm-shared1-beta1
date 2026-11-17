'use client';

import { useQuery } from '@tanstack/react-query';
import { getFloorList } from '@/server/hostel/hostel-management/masters/floor';
import { ApiSearchparams } from '@/types';

export const useMasterFloor = (searchParams?: ApiSearchparams) => {
    return useQuery({
        queryKey: ['master-floor', searchParams],
        queryFn: () => getFloorList(searchParams),
        staleTime: 5 * 60 * 1000, 
    });
};
