'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterLocation } from '@/types/transport/transport-module/masters';


export async function getMasterLocation(searchParams?: ApiSearchparams) {

    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_location/location_grid_list?${urlParams}`;
    const res = await api.get<IMasterLocation[]>('transport', url);
    return res;
}



export async function activeDeactiveMasterLocation(id: number) {
    const url = `/master_location/active_deactive_location/${id}`;
    return await api.put('transport', url);
}


export async function saveMasterLocation(data: any) {
    const url = '/master_location/add_or_update_location';
    return await api.post<any>('transport', url, data);
}


