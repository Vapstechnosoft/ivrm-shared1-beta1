'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

export async function getMasterTimeSlab(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/MasterTimeSlab/getdetails/2?${urlParams}`;
    const response = await api.get<any[]>('library', url);
    return response;
}

export async function addOrUpdateMasterTimeSlab(data: any) {
    const url = '/MasterTimeSlab/Savedata';
    return await api.post<any>('library', url, data);
}

export async function deactivateMasterTimeSlab(data: any) {
    const url = '/MasterTimeSlab/deactiveY';
    return await api.post<any>('library', url, data);
}
