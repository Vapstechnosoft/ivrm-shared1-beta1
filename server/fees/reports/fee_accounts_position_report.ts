'use server';

import { api } from '@/lib/apiService';

export async function onChangeofCustomFeeGroup(fmggId: number[]) {
    const url = `/FeeAccountsPosition/get-fee-group-list?${fmggId.map((id) => `FMGG_Id=${id}`).join('&')}`;
    return await api.get<any[]>('fees', url);
}

export async function getFeeAccountsPositionReport(asmayId: number, type: number) {
    const url = `/ClassCategoryReportFacade/get-class-category-report?asmay_id=${asmayId}&type=${type}`;
    return await api.get<any[]>('fees', url);
}
