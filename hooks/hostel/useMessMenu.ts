import { getMessMenuData } from '@/server/hostel/hostel-management/masters/menu';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Define a key for the query
export const MESS_MENU_QUERY_KEY = 'MESS_MENU_DATA';

export const useMessMenu = (searchParams?: { [key: string]: string | string[] | undefined }) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [MESS_MENU_QUERY_KEY, searchParams ?? {}],
            queryFn: async () => getMessMenuData(),
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [MESS_MENU_QUERY_KEY]
            });
        }
    };
};
