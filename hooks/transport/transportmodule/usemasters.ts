import { TRANSPORT_QUERY_KEYS } from '@/constants/query-keys';
import { getMasterArea } from '@/server/transport/transport-module/masters/area';
import { getMasterDriver } from '@/server/transport/transport-module/masters/driver';
import { getExpirySettings } from '@/server/transport/transport-module/masters/expiry-settings';
import { getMasterFuelType } from '@/server/transport/transport-module/masters/fuel-type';
import { getMasterLocation } from '@/server/transport/transport-module/masters/location';
import { getMasterSession } from '@/server/transport/transport-module/masters/master-session';
import { getMasterVehicle } from '@/server/transport/transport-module/masters/master-vehicle';
import { areaDropDown, getMasterRoute, getMasterRouteArea, routeDropDown } from '@/server/transport/transport-module/masters/route';
import { getMasterRouteSchedule } from '@/server/transport/transport-module/masters/route-schedule';
import { getMasterServiceStation } from '@/server/transport/transport-module/masters/service-station';
import { getMasterVehicleType } from '@/server/transport/transport-module/masters/vehicle-type';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterArea = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_AREA, searchParams ?? {}],
            queryFn: async () => getMasterArea(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_AREA]
            });
        }
    };
};

export const useMasterDriver = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_DRIVER, searchParams ?? {}],
            queryFn: async () => getMasterDriver(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_DRIVER]
            });
        }
    };
};

export const useMasterFuelType = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_FUEL_TYPE, searchParams ?? {}],
            queryFn: async () => getMasterFuelType(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_FUEL_TYPE]
            });
        }
    };
};

export const useMasterLocation = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_LOCATION, searchParams ?? {}],
            queryFn: async () => getMasterLocation(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_LOCATION]
            });
        }
    };
};

export const useMasterRoute = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_ROUTE, searchParams ?? {}],
            queryFn: async () => getMasterRoute(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_ROUTE]
            });
        }
    };
};
export const useMasterRouteDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_ROUTE_DROPDOWN, searchParams ?? {}],
            queryFn: async () => routeDropDown(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_ROUTE_DROPDOWN]
            });
        }
    };
};

export const useMasterAreaDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_AREA_DROPDOWN_LIST, searchParams ?? {}],
            queryFn: async () => areaDropDown(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_AREA_DROPDOWN_LIST]
            });
        }
    };
};

export const useMasterRouteArea = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_ROUTE_AREA, searchParams ?? {}],
            queryFn: async () => getMasterRouteArea(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_ROUTE_AREA]
            });
        }
    };
};

export const useMasterServiceStation = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_SERVICE_STATION, searchParams ?? {}],
            queryFn: async () => getMasterServiceStation(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_SERVICE_STATION]
            });
        }
    };
};

export const useMasterSession = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_SESSION, searchParams ?? {}],
            queryFn: async () => getMasterSession(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_SESSION]
            });
        }
    };
};

export const useMasterVehicleType = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.MASTER_VEHICLE_TYPE, searchParams ?? {}],
            queryFn: async () => getMasterVehicleType(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.MASTER_VEHICLE_TYPE]
            });
        }
    };
};

export const useExpirySettings = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.EXPIRY_SETTINGS, searchParams ?? {}],
            queryFn: async () => getExpirySettings(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.EXPIRY_SETTINGS]
            });
        }
    };
};

export const useMasterRouteSchedule = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['MASTER_ROUTE_SCHEDULE', searchParams ?? {}],
            queryFn: async () => getMasterRouteSchedule(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['MASTER_ROUTE_SCHEDULE']
            });
        }
    };
};

export const useMasterVehicle = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [TRANSPORT_QUERY_KEYS.VECHILE_GRID_LIST, searchParams ?? {}],
            queryFn: async () => getMasterVehicle(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [TRANSPORT_QUERY_KEYS.VECHILE_GRID_LIST]
            });
        }
    };
};

// import { getExpirySettings } from '@/server/transport/transport-module/masters/expiry-settings';

// export const useExpirySettings = () => {
//     const queryClient = useQueryClient();

//     return {
//         ...useQuery({
//             queryKey: ['EXPIRY_SETTINGS'],
//             queryFn: async () => getExpirySettings(),
//             staleTime: 300
//         }),

//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: ['EXPIRY_SETTINGS']
//             });
//         }
//     };
// };
