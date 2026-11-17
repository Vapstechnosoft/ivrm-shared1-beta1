'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterRoute, IRouteAreaMapping } from '@/types/transport/transport-module/masters';


export async function getMasterRoute(searchParams?: ApiSearchparams) {

    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_route/route_grid_list?${urlParams}`;
    const res = await api.get<any[]>('transport', url);
    return res;
}



export async function activeDeactiveRoute(id: number) {
    const url = `/master_route/active_deactive_route/${id}`;
    return await api.put('transport', url);
}


export async function saveMasterRoute(data: any) {
    const url = '/master_route/add_or_update_route';
    return await api.post<any>('transport', url, data);
}

export async function routeDropDown() {
    const url = '/master_route/route_drop_down';
    const res = await api.get<any[]>('transport', url);
    return res;
}

export async function areaDropDown() {
    const url = '/master_route/area_drop_down';
    const res = await api.get<any[]>('transport', url);
    return res;
}


export async function getMasterRouteArea(searchParams?: ApiSearchparams) {

    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_route/route_area_grid_list?${urlParams}`;
    const res = await api.get<any[]>('transport', url);
    return res;
}

export async function saveRouteAreaMapping(data: any) {
    const url = '/master_route/add_or_update_route_area';
    return await api.post<any>('transport', url, data);
}


export async function activeDeactiveRouteArea(id: number) {
    const url = `/master_route/active_deactive_route_area/${id}`;
    return await api.put('transport', url);
}



// export async function saveRouteOrder(data: any) {
//     const url = '/MasterRoute/saveorder';
//     return await api.post<any>('transport', url, data);
// }

// export async function getStudentListRe(data: any) {
//     const url = '/MasterRoute/getstudentlistre';
//     return await api.post<any>('transport', url, data);
// }
