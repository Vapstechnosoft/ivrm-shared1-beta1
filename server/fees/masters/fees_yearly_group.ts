'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterClassYearlyList } from '@/types/fees/masters/masters';

export async function getMasterYearlyCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'asmaY_Year,fmG_GroupName,fyG_RebateApplicableFlg,fyG_PartialRebateAmtOrPercentageValue'
    );
    const url = `/fee_yearly_group/getdata?${urlParams}`;
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getGroupListCategory(searchParams?: ApiSearchparams) {
    const _urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = '/fee_yearly_group/getgrouplist';
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function MasterClassYearlyCategory(data: any) {
    const url = '/fee_class_category/classcategorylist';
    return await api.post<any>('fees', url, data);
}

export async function addOrUpdateMasterGroupYearlyCategory(data: any) {
    const url = '/fee_yearly_group';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterclassYearlyCategory(id: number) {
    const url = `/fee_yearly_group/toggle_fee_yearlygroup/${id}`;
    return await api.put('fees', url);
}
