'use server';

import { api } from '@/lib/apiService';
import type { Staff, StaffReplacementInUnallocatedMasters } from '@/types/timetable/Transaction/staff-replacement-in-unallocated-period';

export async function getStaffReplacementUnallocatedPeriodNewMasters(): Promise<StaffReplacementInUnallocatedMasters> {
    try {
        const [staff] = await Promise.all([api.get<Staff[]>('timetable', '/TimeTableCommon/GetStaffDetails')]);

        return {
            staff: staff.data ?? (staff as unknown as Staff[])
        };
    } catch (error) {
        console.error('Error fetching staff replacement masters:', error);
        return { staff: [] };
    }
}
/**
 * Fetches timetable data for staff replacement
 * Based on category, staff, class, section, and subject filters
 */
export async function getTimetableData(payload: {
    hrmE_Id: string;
}) {
    try {
        const { hrmE_Id } = payload;

        // Construct URL with optional parameters
        // Adjust this endpoint based on your actual API
        const url = `StaffReplacementFacade/GetTimetableData/${hrmE_Id}| 0}`;

        const response = await api.get<any>('timetable', url);

        // Handle different response structures
        if (response.data && response.data && Array.isArray(response.data)) {
            return response.data;
        }

        if (response.data && response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        // Return empty array if no data
        return [];
    } catch (error) {
        console.error('Error fetching timetable data:', error);
        return [];
    }
}
