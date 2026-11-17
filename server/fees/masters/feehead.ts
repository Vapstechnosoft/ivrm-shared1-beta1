'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IFeeHeadsList } from '@/types/fees/masters';
import type { IFeeHeadsListSetOrder } from '@/types/fees/masters/masters';

export async function getfeehead(searchParams?: ApiSearchparams) {
    console.info('Fetching fee heads with search params:', searchParams);
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'fmH_FeeName,fmH_SpecialFeeFlag,fmH_Order');
    const url = `/fee_head/getdata?${urlParams}`;
    return await api.get<IFeeHeadsList[]>('fees', url);
}

export async function addOrUpdateMasterfeehead(data: any) {
    const url = '/fee_head';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterfeehead(id: number) {
    const url = `/fee_head/deactivate/${id}`;
    return await api.put('fees', url);
}

export async function updateSetOrder(data: any) {
    const url = '/fee_head/change-order';

    console.info('Updating fee head set order with data:', data);
    return await api.post<any>('fees', url, data);
}

export async function getfeeheadSetorderdata() {
    const url = '/fee_head/setorder-getdata';
    return await api.get<IFeeHeadsListSetOrder[]>('fees', url);
}
