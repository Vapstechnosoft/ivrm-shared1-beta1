'use client';

import { getRoomTariffData } from '@/server/hostel/hostel-management/masters/room-tariff';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiSearchparams } from '@/types';

const ROOM_TARIFF_QUERY_KEY = ['ROOM_TARIFF_LIST'];

export const useRoomTariff = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [ROOM_TARIFF_QUERY_KEY, searchParams ?? {}],
            queryFn: async () => getRoomTariffData(),
            staleTime: 0,
            refetchOnWindowFocus: false,
        }),
        refetchAll: () => {
             return queryClient.invalidateQueries({
                 queryKey: [ROOM_TARIFF_QUERY_KEY]
             });
        }
    };
};
