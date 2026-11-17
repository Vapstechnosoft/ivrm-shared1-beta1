'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';

export async function getVehicleDriverMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/vehical_driver_mapping/vehicle_driver_mapping_grid_list?${urlParams}`;
    const res = await api.get<any[]>('transport', url);
    return res;
}


export async function vehicleDropDown() {
    const url = '/vehical_driver_mapping/vehicle_drop_down';
    const res = await api.get<any[]>('transport', url);
    return res;
}

export async function driverDropDown() {
    const url = '/vehical_driver_mapping/driver_drop_down';
    const res = await api.get<any[]>('transport', url);
    return res;
}

export async function sessionDropDown() {
    const url = '/vehical_driver_mapping/session_drop_down';
    const res = await api.get<any[]>('transport', url);
    return res;
}



export async function saveVehicleDriverMapping(data: any) {
    const url = '/vehical_driver_mapping/add_or_update_vehicle-driver';
    return await api.post<any>('transport', url, data);
}

export async function activeDeactiveVehicleDriverMapping(id: number) {
    const url = `/vehical_driver_mapping/active_deactive_vehicle_driver/${id}`;
    return await api.put('transport', url);
}
