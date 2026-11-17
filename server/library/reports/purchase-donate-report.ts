'use server';

import { api } from '@/lib/apiService';
import type {
    IPurchaseDonateReportInitialData,
    IPurchaseDonateReportRequest,
    IPurchaseDonateReportResponse
} from '@/types/library/reports/purchase-donate-report';

const FACADE = 'PurchaseDonateReport';

export async function getPurchaseDonateReportInitialData(pageid = 2) {
    const url = `${FACADE}/getdetails`;
    return await api.post<IPurchaseDonateReportInitialData>('library', url, { id: pageid });
}

export async function getPurchaseDonateReportData(data: IPurchaseDonateReportRequest) {
    const url = `${FACADE}/getdata`;
    return await api.post<IPurchaseDonateReportResponse>('library', url, data);
}
