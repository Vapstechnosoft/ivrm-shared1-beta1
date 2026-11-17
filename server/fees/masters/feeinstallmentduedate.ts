'use server';
import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IAcademicYearDataDetails, IMasterFeesInstallmentList } from '@/types/fees/masters';
import type { IMasterFeeInstallmentDropDown } from '@/types/fees/masters/masters';

export async function addOrUpdateInsallmentDueDate(data: any) {
    const url = '/fee_installment/Getduedates';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterfeeInstallmentDueDate(_mi_id: 30, id: number) {
    const url = `/demo/${id}`;
    return await api.put('fees', url);
}
export async function getfeeInstallmentDueDateList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/fee_installment/GetUsedInstallmentList?${urlParams}`;
    return await api.get<IMasterFeesInstallmentList>('fees', url);
}

export async function getInstallmentDropDown() {
    const url = '/fee_installment/getInstallmentList';
    return await api.get<IMasterFeeInstallmentDropDown>('fees', url);
}

export async function getInstallmentDueDateList(asmayId: number, fmiId: number) {
    const url = `/fee_installment/getInstallmentDueDateList?fmi_id=${fmiId}&asmay_id=${asmayId}`;
    return await api.get<any>('fees', url);
}

export async function deleteInstallmentDueDate(ftidd_id: number) {
    const url = `/fee_installment/deletedetailsY/${ftidd_id}`;
    console.info('Delete Installment Due Date URL:', url);
    return await api.put('fees', url);
}

export async function saveInstallmentDueDate(payload: any) {
    const url = '/fee_installment/SaveInstallmentDueDate';
    return await api.post('fees', url, payload);
}

export async function getAcademicYearDetailsData(asmayId: number) {
    const url = `/FeesCommon/academic-year-by-id?asmay_Id=${asmayId}`;
    return await api.get<IAcademicYearDataDetails[]>('fees', url);
}
