import { getManualPeriodInsertionMasters, getSectionsByClass } from '@/server/timetable/transactions/manual-Period-insersion';
import type { ManualPeriodInsertionMasters, Section } from '@/types/timetable/Transaction/manual-Period-insersion';
import { useQuery } from '@tanstack/react-query';

const TIMETABLE_QUERY_KEYS = {
    MANUAL_PERIOD_MASTERS: 'MANUAL_PERIOD_MASTERS',
    MANUAL_PERIOD_SECTIONS: 'MANUAL_PERIOD_SECTIONS'
};

export const useManualPeriodMasters = () => {
    return useQuery<ManualPeriodInsertionMasters>({
        queryKey: [TIMETABLE_QUERY_KEYS.MANUAL_PERIOD_MASTERS],
        queryFn: async () => await getManualPeriodInsertionMasters()
    });
};

export const useSectionsByClass = (asmcL_Id: number) => {
    return useQuery<Section[]>({
        queryKey: [TIMETABLE_QUERY_KEYS.MANUAL_PERIOD_SECTIONS, asmcL_Id],
        queryFn: async () => await getSectionsByClass(asmcL_Id),
        enabled: !!asmcL_Id
    });
};
