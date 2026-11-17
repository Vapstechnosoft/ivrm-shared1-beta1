'use server';

import { api } from '@/lib/apiService';

export async function saveMonthEndReportData(data: any) {
    const url = '/trns_monthend_report/transport_month_end_report';
    return await api.post<any>('transport', url, data);
}
