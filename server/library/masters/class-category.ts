'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

export async function getMasterClassCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    // Using MasterClassCategoryFacade/getdetails as per legacy code and recent fix patterns
    const url = `/MasterClassCategoryFacade/getdetails/2?${urlParams}`;
    const response = await api.get<any[]>('library', url);
    return response;
}

export async function addOrUpdateMasterClassCategory(data: any) {
    const url = 'MasterClassCategoryFacade/Savedata';
    return await api.post<any>('library', url, data);
}

export async function deactivateMasterClassCategory(data: any) {
    const url = 'MasterClassCategoryFacade/deactiveY';
    return await api.post<any>('library', url, data);
}
