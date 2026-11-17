'use server';
import { api } from '@/lib/apiService';

export async function getFeeReceiptimportCommon(asmay_Id: number, date: string) {
    const url = `/FeesCommon/FeeReceiptImportDelete/${asmay_Id}/${date}`;
    return await api.get<any[]>('fees', url);
}

export async function deleteFeeReceiptimportCommon(payload: any) {
    const url = '/FeesCommon/FeeReceiptImportDeleteStthomas';
    return await api.post<any[]>('fees', url, payload);
}
