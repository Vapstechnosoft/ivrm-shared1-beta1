'use client';

import { getRoomCategoryList } from '@/server/hostel/hostel-management/masters/room-category';
import { useQuery } from '@tanstack/react-query';

const ROOM_CATEGORY_QUERY_KEY = ['ROOM_CATEGORY_LIST'];

export const useRoomCategory = (searchParams?: { [key: string]: string | string[] | undefined }) => {
    return {
        ...useQuery({
            queryKey: [ROOM_CATEGORY_QUERY_KEY, searchParams ?? {}],
            queryFn: async () => getRoomCategoryList(),
            staleTime: 0
        }),

        refetchAll: async () => {
            // InvalidateQueries or manual refetch handled by react-query if usage component calls refetch
        },
        // Just standard useQuery return is mostly sufficient, but matching pattern
        queryKey: ROOM_CATEGORY_QUERY_KEY
    };
};
