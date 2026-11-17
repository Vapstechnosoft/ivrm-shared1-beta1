import { fetchMessData } from '@/server/hostel/hostel-management/masters/mess';
import { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Define a key for the query
export const MASTER_MESS_QUERY_KEY = 'MASTER_MESS_DATA';

export const useMasterMess = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [MASTER_MESS_QUERY_KEY, searchParams ?? {}],
            queryFn: async () => fetchMessData(searchParams),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [MASTER_MESS_QUERY_KEY]
            });
        }
    };
};
