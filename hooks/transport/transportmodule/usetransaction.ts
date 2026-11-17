import { TRANSPORT_QUERY_KEYS } from '@/constants/query-keys';
import { routeDropDown } from '@/server/transport/transport-module/masters/route';
import { getRouteLocationMapping } from '@/server/transport/transport-module/transaction/route-location-mapping';
import {
    driverDropDown,
    getVehicleDriverMapping,
    sessionDropDown,
    vehicleDropDown
} from '@/server/transport/transport-module/transaction/vehicle-driver-mapping';
import { getVehicleRouteMapping } from '@/server/transport/transport-module/transaction/vehicle-route-mapping';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useRouteLocationMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.ROUTE_LOCATION_MAPPING, searchParams ?? {}],
            queryFn: async () => getRouteLocationMapping(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.ROUTE_LOCATION_MAPPING]
            });
        }
    };
};

export const useVehicleDriverMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.VEHICLE_DRIVER_MAPPING, searchParams ?? {}],
            queryFn: async () => getVehicleDriverMapping(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.VEHICLE_DRIVER_MAPPING]
            });
        }
    };
};
export const useVehicleDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.VEHICLE_DROPDOWN, searchParams ?? {}],
            queryFn: async () => vehicleDropDown(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.VEHICLE_DROPDOWN]
            });
        }
    };
};
export const useDriverDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.DRIVER_DROPDOWN, searchParams ?? {}],
            queryFn: async () => driverDropDown(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.DRIVER_DROPDOWN]
            });
        }
    };
};

export const useSessionDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.SESSION_DROPDOWN, searchParams ?? {}],
            queryFn: async () => sessionDropDown(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.SESSION_DROPDOWN]
            });
        }
    };
};

export const useVehicleRouteMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.VEHICLE_ROUTE_MAPPING, searchParams ?? {}],
            queryFn: async () => getVehicleRouteMapping(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.VEHICLE_ROUTE_MAPPING]
            });
        }
    };
};
export const useRouteDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.ROUTE_DROPDOWN, searchParams ?? {}],
            queryFn: async () => routeDropDown(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.ROUTE_DROPDOWN]
            });
        }
    };
};
