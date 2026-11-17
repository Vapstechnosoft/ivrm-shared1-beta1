'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterRouteSchedule } from '@/types/transport/transport-module/masters';

export async function getMasterRouteSchedule(searchParams?: ApiSearchparams) {

    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_route_schedule/route_schedule_grid_list?${urlParams}`;
    const res = await api.get<IMasterRouteSchedule[]>('transport', url);
    return res;
}

export async function activeDeactiveRouteSchedule(id: number) {
    const url = `/master_route_schedule/active_deactive_route_schedule/${id}`;
    return await api.put('transport', url);
}


export async function saveMasterRouteSchedule(data: any) {
    const url = '/master_route_schedule/add_or_update_route_schedule';
    return await api.post<any>('transport', url, data);
}

