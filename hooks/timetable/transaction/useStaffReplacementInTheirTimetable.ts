import { TIMETABLE_QUERY_KEYS } from '@/constants/Timetable-query-keys';
import { getStaffReplacementExistingToNewMasters } from '@/server/timetable/transactions/staff-replacement-In-their-timeTable';
import { useQuery } from '@tanstack/react-query';

export const useStafReplacementInThierTimetableMasters = () => {
    return useQuery({
        queryKey: [TIMETABLE_QUERY_KEYS.STAFF_REPLACEMENT_IN_THIER_TIMETABLE],
        queryFn: async () => await getStaffReplacementExistingToNewMasters()
    });
};
