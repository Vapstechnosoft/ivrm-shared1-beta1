'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterGroupList } from '@/types/fees/masters/masters';

export async function getMasterGroup(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'fmG_GroupName,fmG_Remarks,fmG_CompulsoryFlag');
    const url = `/fee_group/getdata?${urlParams}`;
    return await api.get<IMasterGroupList[]>('fees', url);
}

export async function addOrUpdateMasterGroup(data: any) {
    const url = '/fee_group';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterGroup(id: number) {
    const url = `/fee_group/toggle_master_feegroup/${id}`;
    return await api.put('fees', url);
}
