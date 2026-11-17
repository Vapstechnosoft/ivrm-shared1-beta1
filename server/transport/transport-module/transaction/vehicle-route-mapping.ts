'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';


export async function getVehicleRouteMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/vehical_route_mapping/vehicle_route_mapping_grid_list?${urlParams}`;
    const res = await api.get<any[]>('transport', url);
    return res;
}


export async function activeDeactiveVehicleRouteMapping(id: number) {
    const url = `/vehical_route_mapping/active_deactive_vehicle_route/${id}`;
    return await api.put('transport', url);
}

export async function saveVehicleRouteMapping(data: any) {
    const url = '/vehical_route_mapping/add_or_update_vehicle-route';
    return await api.post<any>('transport', url, data);
}


