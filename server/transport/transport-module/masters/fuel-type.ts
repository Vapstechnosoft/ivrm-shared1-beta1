'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterFuelType } from '@/types/transport/transport-module/masters';


export async function getMasterFuelType(searchParams?: ApiSearchparams) {

    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_fuel/fuel_type_grid_list?${urlParams}`;
    const res = await api.get<IMasterFuelType[]>('transport', url);
    return res;
}


export async function saveMasterFuelType(data: any) {
    const url = '/master_fuel/add_or_update_fuel_type';
    return await api.post<any>('transport', url, data);
}

export async function activeDeactiveMasterFuelType(id: number) {
    const url = `/master_fuel/active_deactive_fuel_type/${id}`;
    return await api.put('transport', url);
}


