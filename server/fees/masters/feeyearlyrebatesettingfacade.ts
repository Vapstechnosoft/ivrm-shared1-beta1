'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterFeeYearlyRebateSettingFacade } from '@/types/fees/masters/masters';

export async function getMasterFeeYearlyRebateSettinFacade(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'asmaY_Year,fyrebseT_RebateTypeFlg,fyrebseT_RebateAmtOrPercentValue, fyrebseT_RebateDate'
    );
    const url = `/FeeYearlyRebateSettingFacade/getallrebates?${urlParams}`;
    return await api.get<IMasterFeeYearlyRebateSettingFacade[]>('fees', url);
}

export async function addOrUpdateMasterYearlyRebateSettingsFacade(data: any) {
    const url = '/FeeYearlyRebateSettingFacade/saverebate';
    return await api.post<any>('fees', url, data);
}

export async function getGroupListCategory(mi_id: number, asmay_id: number, data: any) {
    const url = `/fee_class_category/class_drop_down_list?mi_id=${mi_id}&asmay_id=${asmay_id}`;

    return await api.post<any>('fees', url, data);
}

export async function addOrUpdateMasterClassYearlyCategory(data: any) {
    const url = '/fee_class_category/AddOrUpdateYearlyClassCategory';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterclassYearlyCategory(id: number) {
    const url = `/fee_class_category/deletedetailsY/${id}`;
    return await api.put('fees', url);
}

export async function toggleYearlyRebateSetting(id: number) {
    const url = `FeeYearlyRebateSettingFacade/toggle_fee_rebatesetting/${id}`;
    return await api.put('fees', url);
}
