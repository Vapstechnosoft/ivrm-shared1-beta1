'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterDriver } from '@/types/transport/transport-module/masters';


export async function getMasterDriver(searchParams?: ApiSearchparams) {
    console.info('searchParams', searchParams);
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_driver/driver_grid_list?${urlParams}`;
    const res = await api.get<any>('transport', url);
    return res;
}


export async function saveMasterDriver(data: any) {
    const url = '/master_driver/add_or_update_driver';
    return await api.post<any>('transport', url, data);
}


export async function activeDeactiveMasterDriver(id: number) {
    const url = `/master_driver/active_deactive_driver/${id}`;
    return await api.put('transport', url);
}





export async function checkDriverCodeDuplicate(data: any) {
    const url = '/MasterDriver/checkdrivercode';
    return await api.post<any>('transport', url, data);
}

export async function checkDriverDLDuplicate(data: any) {
    const url = '/MasterDriver/checkdriverdl';
    return await api.post<any>('transport', url, data);
}

export async function checkDriverBadgeDuplicate(data: any) {
    const url = '/MasterDriver/checkdriverbno';
    return await api.post<any>('transport', url, data);
}
