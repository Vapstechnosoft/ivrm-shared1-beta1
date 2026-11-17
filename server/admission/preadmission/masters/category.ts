'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterCategoryList } from '@/types/admission/preadmission/masters';

export async function getMasterCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'amC_Name,amC_Type,amC_Address,');
    const url = `/master_category?${urlParams}`;
    return await api.get<IMasterCategoryList[]>('admission', url);
}

export async function addOrUpdateMasterCategory(data: any) {
    const url = '/master_category';
    return await api.post<any>('admission', url, data);
}

export async function toggleMasterCategory(id: number) {
    const url = `/master_category/toggle/${id}`;
    return await api.put('admission', url);
}
