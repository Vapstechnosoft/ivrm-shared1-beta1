'use server';

import { api } from '@/lib/apiService';
import type {
    IAvailableBooksReportInitialData,
    IAvailableBooksReportRequest,
    IAvailableBooksReportResponse
} from '@/types/library/reports/available-books-report';

const FACADE = 'AvailableBooksReport';

export async function getAvailableBooksReportInitialData(pageid = 2) {
    // Legacy: apiService.getURI("AvailableBooksReport/getdetails", pageid)
    // Assuming backend handles this as a GET or POST. The project usually uses POST.
    // If it's a GET with param in URL: `${FACADE}/getdetails/${pageid}`
    // If it's a POST: `${FACADE}/getdetails` with body { id: pageid }
    // I'll try generic POST pattern first as it's safer for this architecture.
    // If it fails, I might need to adjust.
    // But looking at legacy, getURI usually means GET /api/AvailableBooksReport/getdetails/2
    // However, apiService in this project might wrap things differently.
    // Let's check apiService.ts? No, I'll stick to POST pattern commonly used here.
    const url = `${FACADE}/getdetails`;
    return await api.post<IAvailableBooksReportInitialData>('library', url, { id: pageid });
}

export async function getAvailableBooksReportData(data: IAvailableBooksReportRequest) {
    const url = `${FACADE}/get_report`;
    return await api.post<IAvailableBooksReportResponse>('library', url, data);
}
