'use server';

import { api } from '@/lib/apiService';

export async function getAuditReport(data: any) {
    const url = '/FeeDailycollection/auditreport';
    return await api.post<any>('fees', url, data);
}
