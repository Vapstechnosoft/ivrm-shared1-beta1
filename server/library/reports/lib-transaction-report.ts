'use server';

import { api } from '@/lib/apiService';
import type {
    ILibTransactionReportGridData,
    ILibTransactionReportInitialData,
    ILibTransactionReportRequest
} from '@/types/library/reports/lib-transaction-report';

const FACADE = 'LibTransactionReportFacade';

// Get initial data for the report form
export async function getLibTransactionReportInitialData() {
    const url = `${FACADE}/Getdetails`;
    // API expects pagination parameters often, passing 2 as per legacy code pageid=2
    return await api.post<ILibTransactionReportInitialData>('library', url, { pageid: 2 });
}

// Get report data
export async function getLibTransactionReportSearch(data: ILibTransactionReportRequest) {
    const url = `${FACADE}/get_report`;
    return await api.post<{
        alldata: ILibTransactionReportGridData[];
        classlist?: any[]; // Legacy code references this
    }>('library', url, data);
}
