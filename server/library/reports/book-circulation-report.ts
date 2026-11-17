'use server';

import { api } from '@/lib/apiService';
import type {
    IBookCirculationReportInitialData,
    IBookCirculationReportRequest,
    IBookCirculationReportResponse
} from '@/types/library/reports/book-circulation-report';

const FACADE = 'BookCirculationReport';

export async function getBookCirculationReportInitialData(pageid = 2) {
    const url = `${FACADE}/getdetails`;
    return await api.post<IBookCirculationReportInitialData>('library', url, { id: pageid });
}

export async function getBookCirculationReportData(data: IBookCirculationReportRequest) {
    const url = `${FACADE}/get_report`;
    return await api.post<IBookCirculationReportResponse>('library', url, data);
}
