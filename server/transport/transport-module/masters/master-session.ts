'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSession } from '@/types/transport/transport-module/masters';


export async function getMasterSession(searchParams?: ApiSearchparams) {

    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_session/session_grid_list?${urlParams}`;
    const res = await api.get<IMasterSession[]>('transport', url);
    return res;
}


export async function saveMasterSession(data: any) {
    const url = '/master_session/add_or_update_session';
    return await api.post<any>('transport', url, data);
}

export async function activeDeactiveSession(id: number) {
    const url = `/master_session/active_deactive_session/${id}`;
    return await api.put('transport', url);
}



