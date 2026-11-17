import { fetchMasterFacilityData } from '@/server/hostel/hostel-management/masters/facility';
import { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Define a key for the query
export const MASTER_FACILITY_QUERY_KEY = 'MASTER_FACILITY_DATA';

export const useMasterFacility = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [MASTER_FACILITY_QUERY_KEY, searchParams ?? {}],
            queryFn: async () => fetchMasterFacilityData(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [MASTER_FACILITY_QUERY_KEY]
            });
        }
    };
};
