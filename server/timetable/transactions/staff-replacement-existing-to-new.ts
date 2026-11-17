'use server';

import { api } from '@/lib/apiService';
import type {
    Category,
    Class,
    Section,
    Staff,
    StaffReplacementExistingToNewMasters,
    Subject
} from '@/types/timetable/Transaction/staff-replacement-existing-to-new';

export async function getStaffReplacementExistingToNewMasters(): Promise<StaffReplacementExistingToNewMasters> {
    try {
        const [categories, classes, staff, subjects] = await Promise.all([
            api.get<Category[]>('timetable', '/TimeTableCommon/GetCategoryDetails'),
            api.get<Class[]>('timetable', '/TimeTableCommon/GetClassData'),
            api.get<Staff[]>('timetable', '/TimeTableCommon/GetStaffDetails'),
            api.get<Subject[]>('timetable', '/TimeTableCommon/subject-details')
        ]);

        return {
            categories: categories.data ?? (categories as unknown as Category[]),
            classes: classes.data ?? (classes as unknown as Class[]),
            staff: staff.data ?? (staff as unknown as Staff[]),
            subjects: subjects.data ?? (subjects as unknown as Subject[])
        };
    } catch (error) {
        console.error('Error fetching staff replacement masters:', error);
        return { categories: [], classes: [], staff: [], subjects: [] };
    }
}

export async function getSectionsByClass(asmcL_Id: number): Promise<Section[]> {
    try {
        const response = await api.get<Section[]>('timetable', `/TimeTableCommon/GetSectionData/${asmcL_Id}`);
        return response.data ?? (response as unknown as Section[]);
    } catch (error) {
        console.error('Error fetching sections:', error);
        return [];
    }
}

/**
 * Fetches timetable data for staff replacement
 * Based on category, staff, class, section, and subject filters
 */
export async function getTimetableData(payload: {
    ttmC_Id: string;
    hrmE_Id_From: string;
    hrmE_Id_To: string;
    asmcL_Id?: string;
    asms_Id?: string;
    ismS_Id?: string;
}) {
    try {
        const { ttmC_Id, hrmE_Id_From, asmcL_Id, asms_Id, ismS_Id } = payload;

        // Construct URL with optional parameters
        // Adjust this endpoint based on your actual API
        const url = `StaffReplacementFacade/GetTimetableData/${ttmC_Id}/${hrmE_Id_From}/${asmcL_Id || 0}/${asms_Id || 0}/${ismS_Id || 0}`;

        const response = await api.get<any>('timetable', url);

        // Handle different response structures
        if (response?.data && response.data && Array.isArray(response.data)) {
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
