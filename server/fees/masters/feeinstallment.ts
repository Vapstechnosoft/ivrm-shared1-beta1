'use server';
import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { FeeInstallmentNameList, IMasterFeesInstallmentList } from '@/types/fees/masters/masters';

export async function addOrUpdateInstallment(data: any) {
    const url = '/fee_installment/SaveInstallment';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterfeeInstallment(id: number) {
    const url = `/fee_installment/Deactivate/${id}`;
    return await api.put('fees', url);
}

export async function getfeeInstallment(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/fee_installment/getdata?${urlParams}`;
    return await api.get<IMasterFeesInstallmentList[]>('fees', url);
}

export async function getfeeInstallmentyId(fmi_id: number) {
    const url = `/fee_installment/getpagedetails/${fmi_id}`;
    return await api.get<IMasterFeesInstallmentList[]>('fees', url);
}
export async function getfeeInstallmentsByFmiId(fmi_id: number) {
    const url = `/fee_installment/getInstallmentnameList/${fmi_id}`;
    return await api.get<FeeInstallmentNameList[]>('fees', url);
}
