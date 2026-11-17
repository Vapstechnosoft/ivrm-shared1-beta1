'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterVehicleType } from '@/types/transport/transport-module/masters';


export async function getMasterVehicleType(searchParams?: ApiSearchparams) {

    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_vehicle_type/vehicle_type_grid_list?${urlParams}`;
    const res = await api.get<IMasterVehicleType[]>('transport', url);
    return res;
}


export async function saveMasterVehicleType(data: any) {
    const url = '/master_vehicle_type/add_or_update_vehicle_type';
    return await api.post<any>('transport', url, data);
}

export async function activeDeactiveVehicleType(id: number) {
    const url = `/master_vehicle_type/active_deactive_vehicle_type/${id}`;
    return await api.put('transport', url);
}