'use server';

import { api } from '@/lib/apiService';
import type { ILibraryMonthEndReportInitialData, ILibraryMonthEndReportRequest } from '@/types/library/reports/library-month-end-report';

const MODULE_URL = 'LibraryMonthEndReport';

export async function getLibraryMonthEndReportInitialData() {
    const response = await api.get<ILibraryMonthEndReportInitialData>('library', `${MODULE_URL}/getdetails/2`);
    return response.data;
}

export async function getLibraryMonthEndReportSearch(data: ILibraryMonthEndReportRequest) {
    const response = await api.post<any>('library', `${MODULE_URL}/savedata`, data);
    return response.data;
}
