import { HOSTEL_QUERY_KEYS } from '@/constants/query-keys';
import { getCountries, getEmployees, getFacilities, getHostelList, getHostelPhotos, getStates, getHostelDropdownList } from '@/server/hostel/hostel-management/masters/hostel';
import { getMessList } from '@/server/hostel/hostel-management/masters/mess';
import { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';


export const useMasterHostel = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HOSTEL_QUERY_KEYS.MASTER_HOSTEL_GRID, searchParams ?? {}],
            queryFn: async () => getHostelList(searchParams),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HOSTEL_QUERY_KEYS.MASTER_HOSTEL_GRID]
            });
        }
    };
};

export const useHostelDropdownList = () => {
    return useQuery({
        queryKey: ['hostel-dropdown'],
        queryFn: () => getHostelDropdownList(),
        select: (data) => data?.data || [],
        staleTime: Infinity,
    });
};

export const useMessDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HOSTEL_QUERY_KEYS.MASTER_MESS_DROPDOWN_LIST],
            queryFn: async () => getMessList(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HOSTEL_QUERY_KEYS.MASTER_MESS_DROPDOWN_LIST]
            });
        }
    };
};

export const useWardenDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HOSTEL_QUERY_KEYS.MASTER_EMPLOYEE_DROPDOWN_LIST],
            queryFn: async () =>getEmployees(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HOSTEL_QUERY_KEYS.MASTER_EMPLOYEE_DROPDOWN_LIST]
            });
        }
    };
};

export const useCountryDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HOSTEL_QUERY_KEYS.MASTER_COUNTRY_DROPDOWN_LIST],
            queryFn: async () =>getCountries(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HOSTEL_QUERY_KEYS.MASTER_COUNTRY_DROPDOWN_LIST]
            });
        }
    };
};


export const useStateDropdownList = (countryId: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HOSTEL_QUERY_KEYS.MASTER_STATE_DROPDOWN_LIST],
            queryFn: async () =>getStates(countryId),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HOSTEL_QUERY_KEYS.MASTER_STATE_DROPDOWN_LIST]
            });
        }
    };
};

export const useFacilityDropdownList = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HOSTEL_QUERY_KEYS.MASTER_FACILITY_DROPDOWN_LIST],
            queryFn: async () =>getFacilities(),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HOSTEL_QUERY_KEYS.MASTER_FACILITY_DROPDOWN_LIST]
            });
        }
    };
};

export const usePhotoList = (hostelId: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HOSTEL_QUERY_KEYS.MASTER_PHOTO_LIST],
            queryFn: async () =>getHostelPhotos(hostelId),
            staleTime: 300
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HOSTEL_QUERY_KEYS.MASTER_PHOTO_LIST]
            });
        }
    };
};









