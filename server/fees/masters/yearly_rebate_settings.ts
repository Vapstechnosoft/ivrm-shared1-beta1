'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterYearlyRebateSettingsList } from '@/types/fees/masters/masters';

export async function getMasterYearlyRebateSettings(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/fee_class_category/yearlyclasscategorylist?${urlParams}`;
    return await api.get<IMasterYearlyRebateSettingsList[]>('fees', url);
}

export async function addOrUpdateMasterYearlyRebateSettings(data: any) {
    const url = '/fee_yearly_group';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterYearlyRebateSettings(mi_id: number, id: number) {
    const url = `/fee_yearly_group/toggle_fee_yearlygroup/${mi_id}/${id}`;
    return await api.put('fees', url);
}
