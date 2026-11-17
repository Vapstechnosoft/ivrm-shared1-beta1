'use server';

import { api } from '@/lib/apiService';
import type { AcademicYear, Category, GenerationMasters } from '@/types/timetable/Transaction/time-table-generation';

export async function getGenerationMasters(): Promise<GenerationMasters> {
    try {
        const [years, categories] = await Promise.all([
            api.get<AcademicYear[]>('timetable', '/TimeTableCommon/GetAcademicYearData'),
            api.get<Category[]>('timetable', '/TimeTableCommon/GetCategoryDetails')
        ]);

        return {
            years: years.data ?? (years as unknown as AcademicYear[]),
            categories: categories.data ?? (categories as unknown as Category[]),
            TotalNoOfPeriods: [],
            TotalNoOfPeriodsAllotted: [],
            TotalNoOfperiodNotallotted: []
        };
    } catch (error) {
        console.error('Error fetching manual period insertion masters:', error);
        return {
            years: [],
            categories: [],
            TotalNoOfPeriods: [],
            TotalNoOfPeriodsAllotted: [],
            TotalNoOfperiodNotallotted: []
        };
    }
}

// export async function getSectionsByClass(asmcL_Id: number): Promise<Section[]> {
//     try {
//         // Assuming the endpoint follows the pattern of GetClassData
//         const response = await api.get<Section[]>('timetable', `/TimeTableCommon/GetSectionData/${asmcL_Id}`);
//         return response.data ?? (response as unknown as Section[]);
//     } catch (error) {
//         console.error('Error fetching sections:', error);
//         return [];
//     }
// }
