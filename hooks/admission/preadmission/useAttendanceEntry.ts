import { getAttendanceEntryType, getClassDropdownList } from '@/server/admission/preadmission/attendance-entry/attendance_entry_type';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useAttendanceEntryType = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['ATTENDANCE_ENTRY_TYPE', searchParams ?? {}],
            queryFn: async () => getAttendanceEntryType(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['ATTENDANCE_ENTRY_TYPE']
            });
        }
    };
};

export const useClassDropdownList = (asmaY_Id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['CLASS_DROPDOWN_LIST', asmaY_Id],
            queryFn: async () => getClassDropdownList(asmaY_Id!),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['CLASS_DROPDOWN_LIST']
            });
        }
    };
};
