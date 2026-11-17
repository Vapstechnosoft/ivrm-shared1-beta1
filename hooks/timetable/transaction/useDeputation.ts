import { TIMETABLE_QUERY_KEYS } from '@/constants/Timetable-query-keys';
import { getAbsentStaffList, getDeputationMasters } from '@/server/timetable/transactions/deputation';
import { useQuery } from '@tanstack/react-query';

export const useDeputationMasters = () => {
    return useQuery({
        queryKey: [TIMETABLE_QUERY_KEYS.DEPUTATION_MASTERS],
        queryFn: async () => await getDeputationMasters()
    });
};

export const useAbsentStaffList = (payload: { asmaY_Id: number; ttmD_Date: string; absent_Staff_Flag: boolean }) => {
    return useQuery({
        queryKey: [TIMETABLE_QUERY_KEYS.DEPUTATION_ABSENT_STAFF, payload],
        queryFn: async () => await getAbsentStaffList(payload),
        enabled: !!payload.asmaY_Id && !!payload.ttmD_Date
    });
};
