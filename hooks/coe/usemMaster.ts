import { COE_QUERY_KEYS } from "@/constants/query-keys";
import { getCoeInitialData, getMasterEventCoe } from "@/server/coe/masters/masterevent";
import { ApiSearchparams } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useMasterEventCoe = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [COE_QUERY_KEYS.MASTER_EVENT_COE, searchParams ?? {}],
            queryFn: async () => getMasterEventCoe(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [COE_QUERY_KEYS.MASTER_EVENT_COE]
            });
        }
    };
};

export const useMasterCoeInitialData = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [COE_QUERY_KEYS.MASTER_EVENT_COE_INITIAL_DATA, searchParams ?? {}],
            queryFn: async () => getCoeInitialData(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [COE_QUERY_KEYS.MASTER_EVENT_COE_INITIAL_DATA]
            });
        }
    };
};

export const EventDropdown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [COE_QUERY_KEYS.EVENT_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getCoeInitialData(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [COE_QUERY_KEYS.EVENT_DROPDOWN]
            });
        }
    };
}; 