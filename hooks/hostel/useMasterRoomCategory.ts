'use client';

import { useQuery } from '@tanstack/react-query';
import { getRoomCategoryList } from '@/server/hostel/hostel-management/masters/room-category';
import { ApiSearchparams } from '@/types';

export const useMasterRoomCategory = (searchParams?: ApiSearchparams) => {
    return useQuery({
        queryKey: ['master-room-category', searchParams],
        queryFn: () => getRoomCategoryList(searchParams),
        staleTime: 5 * 60 * 1000, 
    });
};
