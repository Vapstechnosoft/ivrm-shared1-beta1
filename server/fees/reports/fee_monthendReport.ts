'use server';

import { api } from '@/lib/apiService';
import type { IFeeMonthsListDropdown } from '@/types/fees/reports/reports';

export async function getfeeMonths() {
    const url = '/FeeMonthEndReport/get-month-list';
    return await api.get<IFeeMonthsListDropdown[]>('fees', url);
}

export async function getFeeMonthEndReportData(asmaY_Id: number, year: number, month: number, userentry: number, settlement: number) {
    const url = `/FeeMonthEndReport/get-monthend-report?asmay_id=${asmaY_Id}&year=${year}&month_id=${month}&userentry=${userentry}&settlement=${settlement}`;

    console.info('Fetching Fee Month End Report Data from URL:', url);
    return await api.get<any>('fees', url);
}
