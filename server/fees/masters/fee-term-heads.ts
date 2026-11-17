'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IMasterHeadDropdownList,
    IMasterInstallmentsDropdownList,
    IMasterTermDropdownList,
    IMasterTermFeeHeadList
} from '@/types/fees/masters/masters';

export async function getFeeTermHeadList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'termname,headname,installmentname');
    const url = `/FeeMasterTerms/fee_term_heads?${urlParams}`;

    return await api.get<IMasterTermFeeHeadList[]>('fees', url);
}

export async function addOrUpdateFeeTermHead(data: any) {
    const url = '/FeeMasterTerms/TermHeadInstallmentMaping';
    return await api.post<any>('fees', url, data);
}

export async function deleteFeeTermHead(mi_id: number, id: number) {
    const url = `/FeeMasterTerms/delete_mapped_term_heads?fmtfh_Id=${id}`;
    console.info('deleted url', url);

    return await api.post('fees', url);
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
