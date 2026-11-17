import { TIMETABLE_QUERY_KEYS } from '@/constants/Timetable-query-keys';
import {
    getSectionsByClass,
    getStaffPeriodDetails,
    getStaffPeriodTransferMasters
} from '@/server/timetable/transactions/staffPeriodTransfer';
import type { Section, StaffPeriodTransferMasters } from '@/types/timetable/Transaction/staffPeriodTransfer';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch all initial master data (Years, Classes, Staff, etc.)
 */
export const useStaffPeriodTransferMasters = () => {
    return useQuery<StaffPeriodTransferMasters>({
        queryKey: [TIMETABLE_QUERY_KEYS.STAFF_TRANSFER_MASTERS],
        queryFn: async () => await getStaffPeriodTransferMasters()
    });
};

/**
 * Hook to fetch Sections dynamically based on Class ID selection
 */
export const useSectionsByClass = (asmcL_Id: number) => {
    return useQuery<Section[]>({
        queryKey: [TIMETABLE_QUERY_KEYS.STAFF_TRANSFER_SECTIONS, asmcL_Id],
        queryFn: async () => await getSectionsByClass(asmcL_Id),
        enabled: !!asmcL_Id // Only runs if a class ID is selected
    });
};

/**
 * Hook to fetch specific period details for a selected staff member
 */
export const useStaffPeriodDetails = (payload: {
    asmaY_Id: number;
    hrmE_Id: number;
    asmcL_Id: number;
    asms_Id: number;
    ismS_Id: number;
}) => {
    return useQuery({
        queryKey: [TIMETABLE_QUERY_KEYS.STAFF_PERIOD_DETAILS, payload],
        queryFn: async () => await getStaffPeriodDetails(payload),
        enabled: !!payload.asmaY_Id && !!payload.hrmE_Id
    });
};
