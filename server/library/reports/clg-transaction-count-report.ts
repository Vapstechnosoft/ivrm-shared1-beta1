'use server';

import { api } from '@/lib/apiService';
import type {
    ICLGTransactionCountReportInitialData,
    ICLGTransactionCountReportRequest
} from '@/types/library/reports/clg-transaction-count-report';

const MODULE_URL = 'LibTransactionReportFacade';

export async function getCLGTransactionCountReportInitialData() {
    const response = await api.get<ICLGTransactionCountReportInitialData>('library', `${MODULE_URL}/Getdetails/2`);
    return response.data;
}

export async function getCLGTransactionCountReportSearch(data: ICLGTransactionCountReportRequest) {
    const response = await api.post<any>('library', `${MODULE_URL}/CLGget_report`, data);
    return response.data;
}
