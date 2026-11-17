'use server';

import { api } from '@/lib/apiService';
import type {
    AcademicYear,
    Category,
    Class,
    ManualPeriodInsertionMasters,
    Section,
    Staff,
    Subject
} from '@/types/timetable/Transaction/manual-Period-insersion';

export async function getManualPeriodInsertionMasters(): Promise<ManualPeriodInsertionMasters> {
    try {
        const [years, categories, classes, staff, subjects] = await Promise.all([
            api.get<AcademicYear[]>('timetable', '/TimeTableCommon/GetAcademicYearData'),
            api.get<Category[]>('timetable', '/TimeTableCommon/GetCategoryDetails'),
            api.get<Class[]>('timetable', '/TimeTableCommon/GetClassData'),
            api.get<Staff[]>('timetable', '/TimeTableCommon/GetStaffDetails'),
            api.get<Subject[]>('timetable', '/TimeTableCommon/subject-details')
        ]);

        return {
            years: years.data ?? (years as unknown as AcademicYear[]),
            categories: categories.data ?? (categories as unknown as Category[]),
            classes: classes.data ?? (classes as unknown as Class[]),
            staff: staff.data ?? (staff as unknown as Staff[]),
            subjects: subjects.data ?? (subjects as unknown as Subject[])
        };
    } catch (error) {
        console.error('Error fetching manual period insertion masters:', error);
        return { years: [], categories: [], classes: [], staff: [], subjects: [] };
    }
}

export async function getSectionsByClass(asmcL_Id: number): Promise<Section[]> {
    try {
        // Assuming the endpoint follows the pattern of GetClassData
        const response = await api.get<Section[]>('timetable', `/TimeTableCommon/GetSectionData/${asmcL_Id}`);
        return response.data ?? (response as unknown as Section[]);
    } catch (error) {
        console.error('Error fetching sections:', error);
        return [];
    }
}
