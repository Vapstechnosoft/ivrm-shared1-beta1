'use server';

import { api } from '@/lib/apiService';

/**
 * Fetches initial data for the birthday report (Academic Years)
 */
export async function getBirthdayReportInitialData() {
    const url = 'studentbirthday/getYear/1';
    return await api.get<any>('alumni', url);
}

/**
 * Fetches birthday report details based on filters
 * @param data Filter criteria
 */
export async function getBirthdayReportDetails(data: any) {
    return await api.post<any>('alumni', 'studentbirthday/getdetails', data);
}
