'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

export async function getMasterRackDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    // Trying RackDetailsFacade as RackDetails failed.
    const url = `/RackDetailsFacade/getdetails/2?${urlParams}`;
    const response = await api.get<any[]>('library', url);
    return response;
}

export async function addOrUpdateMasterRack(data: any) {
    const url = 'RackDetailsFacade/Savedata';
    return await api.post<any>('library', url, data);
}

export async function deactivateMasterRack(data: any) {
    const url = 'RackDetailsFacade/deactiveY';
    return await api.post<any>('library', url, data);
}
