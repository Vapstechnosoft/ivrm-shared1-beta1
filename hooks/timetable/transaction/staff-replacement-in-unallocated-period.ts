import { TIMETABLE_QUERY_KEYS } from '@/constants/Timetable-query-keys';
import { getStaffReplacementUnallocatedPeriodNewMasters } from '@/server/timetable/transactions/staff-replacement-in-unallocated-period';
import { useQuery } from '@tanstack/react-query';

export const useStafReplacementInThierTimetableMasters = () => {
    return useQuery({
        queryKey: [TIMETABLE_QUERY_KEYS.STAFF_REPLACEMENT_IN_THIER_TIMETABLE],
        queryFn: async () => await getStaffReplacementUnallocatedPeriodNewMasters()
    });
};
