'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterTermsDropDownList, IMasterTermsList } from '@/types/fees/masters/masters';

export async function getFeeTermList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'fmT_Name');
    const url = `/FeeMasterTerms/fee_terms?${urlParams}`;

    return await api.get<IMasterTermsList[]>('fees', url);
}

export async function addOrUpdateFeeTerm(data: any) {
    const url = '/FeeMasterTerms/SaveTerm';
    return await api.post<any>('fees', url, data);
}

export async function toggleFeeTerm(id: number) {
    const url = `/FeeMasterTerms/toggle_fee_term/${id}`;
    return await api.put('fees', url);
}

export async function getmasterFeeTermDropList() {
    const url = '/FeesCommon/fee-term-details';

    return await api.get<IMasterTermsDropDownList[]>('fees', url);
}
