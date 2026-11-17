import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRoomList, getFloorsByHostel, getRoomCategoryByHostel, getRoomDetails } from '@/server/hostel/hostel-management/masters/room';
import { ApiSearchparams } from '@/types';

export const useMasterRoom = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: ['master-room-list', searchParams],
            queryFn: () => getRoomList(searchParams),
            refetchOnWindowFocus: false,
        }),
        refetchAll: () => {
             return queryClient.invalidateQueries({
                 queryKey: ['master-room-list']
             });
         }
    };
};

export const useFloorsByHostel = (hostelId: string) => {
    return useQuery({
        queryKey: ['floors-by-hostel', hostelId],
        queryFn: () => getFloorsByHostel(Number(hostelId)),
        enabled: !!hostelId && hostelId !== '0',
        select: (data) => data?.data?.floor_list || [],
        staleTime: 0 // Always fetch fresh to act as dropdown dependency
    });
};

export const useRoomCategoryByHostel = (hostelId: string) => {
    return useQuery({
        queryKey: ['room-categories-by-hostel', hostelId],
        queryFn: () => getRoomCategoryByHostel(Number(hostelId)),
        enabled: !!hostelId && hostelId !== '0',
        select: (data) => data?.data?.room_catlist || [],
        staleTime: 0
    });
};

// Note: If distinct fetching by floor is required for room category, add useRoomCategoryByFloor
