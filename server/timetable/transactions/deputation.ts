'use server';

import { api } from '@/lib/apiService';
import { getTimeTableAcademicYearDetails } from '@/server/timetable/masters/categoryclassmapping';
import { revalidatePath } from 'next/cache';

// Fetches the initial dropdown data for the form
export async function getDeputationMasters() {
    try {
        const academicYearsResponse = await getTimeTableAcademicYearDetails();
        const academicYears = academicYearsResponse.data || [];

        let otherMasters = { staffList: [] };
        try {
            // Fetch other masters using the API service
            const response = await api.get<any>('timetable', 'DeputationNewFacade/GetDeputationMasters');
            if (response?.data && response.data) {
                otherMasters = response.data;
            }
        } catch (e) {
            console.warn('DeputationNewFacade/GetDeputationMasters failed or not needed', e);
        }

        return {
            ...otherMasters,
            academicYears: academicYears // Overwriting or adding academicYears from the common source
        };
    } catch (error) {
        console.error('Master Fetch Error:', error);
        return { academicYears: [], staffList: [] };
    }
}

// Saves the deputation entry
// Saves the deputation entry
export async function saveDeputation(payload: any) {
    try {
        const response = await api.post<any>('timetable', 'DeputationNewFacade/SaveDeputation', payload);
        const result = response.data;
        revalidatePath('/timetable/transactions/deputation');

        // MOCK DATA RETURN - As per user request to display tables after save
        // In a real scenario, this data might come from `result` or a separate fetch
        return {
            ...result,
            absentStaffTimeTable: result.absentStaffTimeTable || [
                { period: '1', classSubject: 'V ICSE-C/KANNADA' },
                { period: '2', classSubject: 'III ICSE-B/KANNADA' }
            ],
            absentDetails: result.absentDetails || [
                {
                    staffName: 'ARCHANA N G',
                    absentOn: payload.ttmD_Date ? new Date(payload.ttmD_Date).toLocaleDateString('en-GB') : '15/12/2025',
                    weeklyCount: 0,
                    monthlyCount: 0,
                    yearlyCount: 0
                }
            ]
        };
    } catch (error) {
        return { success: false, message: 'Failed to save deputation.' };
    }
}

// Fetches absent staff details based on selection
export async function getAbsentStaffList(payload: any) {
    try {
        const { asmaY_Id, ttmD_Date, absent_Staff_Flag } = payload;

        // Ensure date is formatted as yyyy-MM-dd
        const formattedDate = ttmD_Date ? new Date(ttmD_Date).toISOString().split('T')[0] : '';

        // Construct the URL dynamically
        const url = `DeputationNewFacade/getabsentstaff/${asmaY_Id}/${formattedDate}/${absent_Staff_Flag}`;

        const response = await api.get<any>('timetable', url);

        // The backend returns { success: true, message: "...", data: [...], total: ... }
        if (response?.data && response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        if (response?.data && response.data) {
            return response.data; // Fallback for other structures
        }

        // MOCK DATA RETURN if API fails or is not implemented yet
        return [
            { hrmE_Id: 1211, staffName: 'ASHA CHM (Mock Data)' },
            { hrmE_Id: 1238, staffName: 'VIJAYAKUMAR B (Mock Data)' }
        ];
    } catch (error) {
        console.error('Fetch Absent Staff Error:', error);
        return [];
    }
}
