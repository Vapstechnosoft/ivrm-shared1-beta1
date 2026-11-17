import { TIMETABLE_QUERY_KEYS } from '@/constants/Timetable-query-keys';
import {
    getSectionsByClass,
    getStaffReplacementExistingToNewMasters,
    getTimetableData
} from '@/server/timetable/transactions/staff-replacement-existing-to-new';
import { useQuery } from '@tanstack/react-query';

export const useStaffReplacementExistingToNewMasters = () => {
    return useQuery({
        queryKey: [TIMETABLE_QUERY_KEYS.STAFF_REPLACEMENT_MASTERS],
        queryFn: getStaffReplacementExistingToNewMasters
    });
};

export const useSectionsByClass = (asmcL_Id: number) => {
    return useQuery({
        queryKey: [TIMETABLE_QUERY_KEYS.STAFF_REPLACEMENT_SECTIONS, asmcL_Id],
        queryFn: () => getSectionsByClass(asmcL_Id),
        enabled: !!asmcL_Id
    });
};

export const useTimetableData = (payload: any) => {
    return useQuery({
        queryKey: [TIMETABLE_QUERY_KEYS.STAFF_REPLACEMENT_PERIOD_DETAILS, payload],
        queryFn: () => getTimetableData(payload),
        enabled: !!payload && !!payload.ttmC_Id && !!payload.hrmE_Id_From
    });
};
