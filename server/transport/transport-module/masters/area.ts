'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterArea } from '@/types/transport/transport-module/masters';


export async function getMasterArea(searchParams?: ApiSearchparams) {
    console.info('searchParams', searchParams);
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_area/area_grid_list?${urlParams}`;
    console.info('master_area', url);
    const res = await api.get<IMasterArea[]>('transport', url);
    return res;
}


export async function activeDeactiveMasterArea(id: number) {
    const url = `/master_area/active_deactive_area/${id}`;
    return await api.put('transport', url);
}


export async function saveMasterArea(data: any) {
    const url = '/master_area/add_or_update_area';
    return await api.post<any>('transport', url, data);
}


