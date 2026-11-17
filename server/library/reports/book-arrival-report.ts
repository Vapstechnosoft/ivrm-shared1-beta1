'use server';

import { api } from '@/lib/apiService';
import type {
    IBookArrivalReportInitialData,
    IBookArrivalReportRequest,
    IBookArrivalReportResponse
} from '@/types/library/reports/book-arrival-report';

const FACADE = 'BookArrivalReport';

export async function getBookArrivalReportInitialData(pageid = 2) {
    const url = `${FACADE}/getdetails`;
    // Consistent with previous implementation, assuming generic POST for init data or adapting if legacy requires specific input
    return await api.post<IBookArrivalReportInitialData>('library', url, { id: pageid });
}

export async function getBookArrivalReportData(data: IBookArrivalReportRequest) {
    const url = `${FACADE}/get_report`;
    return await api.post<IBookArrivalReportResponse>('library', url, data);
}
