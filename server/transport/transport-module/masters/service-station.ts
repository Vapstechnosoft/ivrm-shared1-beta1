'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterServiceStation } from '@/types/transport/transport-module/masters';


export async function getMasterServiceStation(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_service_station/service_station_grid_list?${urlParams}`;
    const res = await api.get<IMasterServiceStation[]>('transport', url);
    return res;
}

export async function saveMasterServiceStation(data: any) {
    const url = '/master_service_station/add_or_update_service_station';
    return await api.post<any>('transport', url, data);
}

export async function activeDeactiveServiceStation(id: number) {
    const url = `/master_service_station/active_deactive_service_station/${id}`;
    return await api.put('transport', url);
}
