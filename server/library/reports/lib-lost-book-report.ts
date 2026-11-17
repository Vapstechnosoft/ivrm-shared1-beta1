'use server';

import { api } from '@/lib/apiService';
import type { ILibLostBookReportInitialData, ILibLostBookReportRequest } from '@/types/library/reports/lib-lost-book-report';

const MODULE_URL = 'LostBookReportFacade';

export async function getLibLostBookReportInitialData() {
    const response = await api.get<ILibLostBookReportInitialData>('library', `${MODULE_URL}/getdetails/2`);
    return response.data;
}

export async function getLibLostBookReportSearch(data: ILibLostBookReportRequest) {
    const response = await api.post<any>('library', `${MODULE_URL}/get_report`, data);
    return response.data;
}
