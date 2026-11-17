'use server';

import { api } from '@/lib/apiService';
import type { ConsolidatedReportInstallemntDropdownList } from '@/types/fees/reports/reports';

export async function getFeeConsolidatedReportData(asmaY_Id: number, class_id: number, section_id: number, flag: string) {
    const url = `/FeeConsolidatedReport/fee-consolidated-report?asmay_id=${asmaY_Id}&class_id=${class_id}&section_id=${section_id}&flag=${flag}`;
    return await api.get<any>('fees', url);
}

export async function getInstallmentDropdownData(asmaY_Id: number) {
    const url = `/FeeConsolidatedReport/fee-installment-list?asmay_id=${asmaY_Id}`;

    console.info('getInstallmentDropdownData url:', url);
    return await api.get<ConsolidatedReportInstallemntDropdownList[]>('fees', url);
}
