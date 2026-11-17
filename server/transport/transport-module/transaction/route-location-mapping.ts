'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import { IRouteLocationMapping } from '@/types/transport/transport-module/transaction';

export async function getRouteLocationMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/route_location_mapping/route_location_grid_list?${urlParams}`;
    const res = await api.get<IRouteLocationMapping[]>('transport', url);
    return res;
}

export async function getRoutesByArea(trmA_Id: number) {
    const url = `/route_location_mapping/route_dropdown_by_area/${trmA_Id}`;
    return await api.get<any>('transport', url);
}

export async function getLocationsByRoute(trmR_Id: number) {
    const url = `/route_location_mapping/locations_dropdown_by_route/${trmR_Id}`;
    return await api.get<any>('transport', url);
}



export async function activeDeactiveRouteLocationMapping(trmrL_Id: number) {
    const url = `/route_location_mapping/active_deactive_route_location/${trmrL_Id}`;
    return await api.put<any>('transport', url);
}

export async function saveRouteLocationMapping(data: any) {
    const url = '/route_location_mapping/add_or_update_route_location';
    return await api.post<any>('transport', url, data);
}
// export async function saveRouteLocationOrder(data: any) {
//     const url = '/RouteLocationMapping/getOrder/';
//     return await api.post<any>('transport', url, data);
// }
