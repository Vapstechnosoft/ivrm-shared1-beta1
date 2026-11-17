'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterEvent } from '@/types/sports/masters/events';

export async function getMasterEvents(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/MasterEvents/getDetails?${urlParams}`;
    return await api.post<IMasterEvent[]>('sports', url, {});
}

export async function getMasterEventDetails(id: number) {
    const url = `/MasterEvents/EditDetails/${id}`;
    return await api.get<IMasterEvent>('sports', url);
}

export async function saveMasterEvent(data: any) {
    const SPCCME_Id = data.spccmE_Id || 0;
    const SPCCME_EventName = encodeURIComponent(data.spccmE_EventName || '');
    const SPCCME_EventNameDesc = encodeURIComponent(data.spccmE_EventNameDesc || '');

    const url = `/MasterEvents/save?SPCCME_Id=${SPCCME_Id}&SPCCME_EventName=${SPCCME_EventName}&SPCCME_EventNameDesc=${SPCCME_EventNameDesc}`;
    return await api.post<any>('sports', url, {});
}

export async function deactivateMasterEvent(data: any) {
    const SPCCME_Id = data.spccmE_Id;
    const SPCCME_ActiveFlag = data.spccmE_ActiveFlag;

    const url = `/MasterEvents/deactivate?SPCCME_Id=${SPCCME_Id}&SPCCME_ActiveFlag=${SPCCME_ActiveFlag}`;
    return await api.post<any>('sports', url, {});
}
