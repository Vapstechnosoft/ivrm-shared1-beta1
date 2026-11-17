'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IFeePreAdmissionTransactionDetails, Ifeetransaction } from '@/types/fees/transactions/transactions';

export async function getFeeStudentTransactionDetails(asmaY_Id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/FeeStudentTransaction/fee-details?ASMAY_Id=${asmaY_Id || 0}&${urlParams}`;
    return await api.post<Ifeetransaction[]>('fees', url);
}

export async function searchStudentName(payload: any) {
    const url = '/FeeStudentTransaction/fee-stud-search-filter';
    return api.post<any>('fees', url, payload);
}

export async function getStudentDetails(payload: any) {
    const url = '/FeeStudentTransaction/fee-stud-lst-det';
    return api.post<any>('fees', url, payload);
}

export async function getFeeHead(payload: any) {
    const url = '/FeeStudentTransaction/fee-term-details';
    return api.post<any>('fees', url, payload);
}

export async function saveFeeTransaction(payload: any) {
    const url = '/FeeStudentTransaction/fee-Save-details';
    return await api.post<any[]>('fees', url, payload);
}

export async function masterconfiguration() {
    const url = '/FeesCommon/fee-master-details';
    return await api.get<any[]>('fees', url);
}

export async function getStudentPrintDetails(payload: any) {
    const url = '/FeeStudentTransaction/fee-print-details';
    return await api.post<IFeePreAdmissionTransactionDetails[]>('fees', url, payload);
}

export async function masterBank() {
    const url = '/FeesCommon/bank-details';
    return await api.get<any[]>('fees', url);
}

export async function deletefeeTransaction(payload: any) {
    const url = '/FeeStudentTransaction/fee-delete-transaction';
    return await api.post('fees', url, payload);
}

export async function updateFeeStudentTransactionDetails(payload: any) {
    const url = '/FeeStudentTransaction/fee-edit-transaction';
    return await api.post<any[]>('fees', url, payload);
}
export async function updateFeeStudentCurrentAcademicDetails(amst_Id: number, asmay_Id: number) {
    const url = `/FeeStudentTransaction/fee-stud-Profile?AMST_Id=${amst_Id}&ASMAY_Id=${asmay_Id}`;
    return await api.get<any[]>('fees', url);
}
