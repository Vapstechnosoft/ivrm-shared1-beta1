'use server';

import { api } from '@/lib/apiService';
import type { IRackReportInitialData, IRackReportRequest, IRackReportResponse } from '@/types/library/reports/rack-report';

const FACADE = 'RackReport';

export async function getRackReportInitialData(pageid = 2) {
    const url = `${FACADE}/getdetails`;
    return await api.post<IRackReportInitialData>('library', url, { id: pageid });
}

export async function getRackReportData(data: IRackReportRequest) {
    const url = `${FACADE}/get_report`;
    return await api.post<IRackReportResponse>('library', url, data);
}
