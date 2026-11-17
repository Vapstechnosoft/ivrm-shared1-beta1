'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IFeeSplitYearList,
    IFeeTermFeeHeadDueDateGridList,
    IMasterHeadDropdownList,
    IMasterInstallmentsDropdownList,
    IMasterTermDropdownList,
    IMasterTermsPeriodList
} from '@/types/fees/masters/masters';

export async function getMasterTermsPeriod(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'fmtToMonth,fmtP_Year,fromMonth,yearname,termname');
    const url = `FeeMasterTerms/GetMasterTermsPeriodList?${urlParams}`;

    return await api.get<IMasterTermsPeriodList[]>('fees', url);
}

export async function getFeeTermHeadDueDateGridList(asmay_id: number, fmt_id: number, fmh_id: number) {
    const url = `/FeeMasterTerms/GetDueDates/${fmt_id}/${fmh_id}`;
    return await api.get<IFeeTermFeeHeadDueDateGridList[]>('fees', url);
}

export async function addOrUpdateTermsPeriod(data: any) {
    const url = 'FeeMasterTerms/AddOrUpdateTermPeriod';
    return await api.post<any>('fees', url, data);
}

export async function deleteMasterTermPeriod(id: number) {
    const url = `FeeMasterTerms/delete_master-terms-period?id=${id}`;
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

export async function get_split_year(academicYearId: number) {
    const url = `/FeeMasterTerms/get-split-year/${academicYearId}`;

    console.info('Split Year URL:', url); // Debugging line to check the URL
    return await api.get<IFeeSplitYearList[]>('fees', url);
}
