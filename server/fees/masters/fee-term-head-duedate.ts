'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IFeeTermFeeHeadDueDateGridList,
    IMasterHeadDropdownList,
    IMasterInstallmentsDropdownList,
    IMasterTermDropdownList,
    IMasterTermFeeHeadDueDateList
} from '@/types/fees/masters/masters';

export async function getFeeTermHeadDueDateList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'termname,headnamed,yearname,fdate1,tdate1,aplc1,ddate1');
    const url = `/FeeMasterTerms/GetMasterTermFeeHeadDueDateList?${urlParams}`;

    return await api.get<IMasterTermFeeHeadDueDateList[]>('fees', url);
}

export async function getFeeTermHeadDueDateGridList(asmay_id: number, fmt_id: number, fmh_id: number) {
    const url = `/FeeMasterTerms/GetDueDates/${fmt_id}/${fmh_id}/${asmay_id}`;
    return await api.get<IFeeTermFeeHeadDueDateGridList[]>('fees', url);
}

export async function addOrUpdateFeeTermHeadDueDate(data: any) {
    const url = '/FeeMasterTerms/AddOrUpdateMasterTermFeeHeadDueDate';
    return await api.post<any>('fees', url, data);
}

export async function deleteFeeTermHeadDueDate(id: number) {
    const url = `/FeeMasterTerms/delete_term_feehead_duedates?fmtfhdd_Id=${id}`;
    console.info('deleted url', url);

    return await api.delete('fees', url);
}

export async function getheadsdropdown(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/FeeMasterTerms/fee_head_Dropdown?${urlParams}`;
    return await api.get<IMasterHeadDropdownList[]>('fees', url);
}

export async function getinstallmentsdropdown(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/FeeMasterTerms/fee_installment_Dropdown?${urlParams}`;
    return await api.get<IMasterInstallmentsDropdownList[]>('fees', url);
}

export async function gettermsdropdown(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/FeeMasterTerms/fee_term_Dropdown?${urlParams}`;
    return await api.get<IMasterTermDropdownList[]>('fees', url);
}
