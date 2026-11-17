'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IModeOfPaymentList } from '@/types/fees/masters';

export async function getModeOfPayment(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'ivrmmoD_ModeOfPayment,fpgD_MerchantId,saltKey,authorisationKey');
    const url = `/ModeOfPaymentFacade/getdata?${urlParams}`;
    return await api.get<IModeOfPaymentList[]>('fees', url);
}

export async function addOrUpdateModeOfPayment(data: any) {
    const url = '/ModeOfPaymentFacade';
    return await api.post<any>('fees', url, data);
}

export async function toggleModeOfPayment(id: number) {
    const url = `/ModeOfPaymentFacade/paymentDecative/${id}`;
    return await api.put('fees', url);
}
