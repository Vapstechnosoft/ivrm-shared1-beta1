'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IFeePreAdmissionTransactionDetails, Ifeetransaction } from '@/types/fees/transactions/transactions';

export async function getFeeStudentTransactionDetailsstthomas(asmaY_Id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/FeeTransactionStThomas/TransactionGrid-details?asmay_id=${asmaY_Id || 0}&${urlParams}`;
    return await api.get<Ifeetransaction[]>('fees', url);
}

export async function searchStudentNamestsstthomas(payload: any) {
    const url = '/FeeStudentTransaction/fee-stud-search-filter';
    return api.post<any>('fees', url, payload);
}

export async function getStudentDetailssstthomas(payload: any) {
    const url = '/FeeStudentTransaction/fee-stud-lst-det';
    return api.post<any>('fees', url, payload);
}

export async function getFeeHeadsstthomas(payload: any) {
    const url = '/FeeStudentTransaction/fee-term-details';
    return api.post<any>('fees', url, payload);
}

export async function saveFeeTransactionsstthomas(payload: any) {
    const url = '/FeeStudentTransaction/fee-Save-details';
    return await api.post<any[]>('fees', url, payload);
}

export async function masterconfigurationsstthomas() {
    const url = '/FeesCommon/fee-master-details';
    return await api.get<any[]>('fees', url);
}

export async function getStudentPrintDetailssstthomas(payload: any) {
    const url = '/FeeStudentTransaction/fee-print-details';
    return await api.post<IFeePreAdmissionTransactionDetails[]>('fees', url, payload);
}

export async function masterBanksstthomas() {
    const url = '/FeesCommon/bank-details';
    return await api.get<any[]>('fees', url);
}

export async function deletefeeTransactionsstthomas(payload: any) {
    const url = '/FeeStudentTransaction/fee-delete-transaction';
    return await api.post('fees', url, payload);
}

export async function updateFeeStudentTransactionDetailssstthomas(payload: any) {
    const url = '/FeeStudentTransaction/fee-edit-transaction';
    return await api.post<any[]>('fees', url, payload);
}
export async function updateFeeStudentCurrentAcademicDetailssstthomas(amst_Id: number, asmay_Id: number) {
    const url = `/FeeStudentTransaction/fee-stud-Profile?AMST_Id=${amst_Id}&ASMAY_Id=${asmay_Id}`;
    return await api.get<any[]>('fees', url);
}
