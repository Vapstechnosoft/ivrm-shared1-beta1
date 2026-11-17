'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IspecialFeeHeadDropdownList, IspecialFeeHeadList } from '@/types/fees/masters';

export async function getfeespeecialheadList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'fmsfH_Name,fmH_Name');
    const url = `FeeSpecialHead/fee-special-head-list?${urlParams}`;
    return await api.get<IspecialFeeHeadList[]>('fees', url);
}

export async function addOrUpdateSpecialfeehead(data: any) {
    const url = 'FeeSpecialHead/add-or-update';
    return await api.post<any>('fees', url, data);
}

export async function toggleSpecialfeehead(id: number) {
    const url = `FeeSpecialHead/toggle/${id}`;
    return await api.put('fees', url);
}

export async function getFeeSpecialHeadDropdown() {
    const url = 'FeeSpecialHead/fee-special-head-dropdown';
    return await api.get<IspecialFeeHeadDropdownList[]>('fees', url);
}
