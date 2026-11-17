'use server';
import { api } from '@/lib/apiService';

export async function savefeeReceiptimportCommon(payload: any) {
    const url = '/FeeReceiptImport/fee-import-com-Savedata';
    return await api.post<any[]>('fees', url, payload);
}
