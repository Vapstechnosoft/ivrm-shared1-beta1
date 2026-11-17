'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterEventVenue } from '@/types/sports/masters/venue';

export async function getMasterVenues(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    // The user specified /api/MasterEventVenue/getDetails but the common pattern in this project seems to be /api/MasterEventVenue/getDetails
    // However, the previous code had /MasterEventVenue/loadgrid/1. 
    // The user request says: /api/MasterEventVenue/getDetails
    const url = `/MasterEventVenue/getDetails?${urlParams}`;
    return await api.post<IMasterEventVenue[]>('sports', url, {});
}

export async function getMasterVenueDetails(id: number) {
    const url = `/MasterEventVenue/EditDetails/${id}`;
    return await api.get<IMasterEventVenue>('sports', url);
}

export async function saveMasterVenue(data: any) {
    const SPCCMEV_Id = data.spccmeV_Id || 0;
    const SPCCMEV_EventVenue = encodeURIComponent(data.spccmeV_EventVenue || '');
    const SPCCMEV_EventVenueDesc = encodeURIComponent(data.spccmeV_EventVenueDesc || '');

    const url = `/MasterEventVenue/save?SPCCMEV_Id=${SPCCMEV_Id}&SPCCMEV_EventVenue=${SPCCMEV_EventVenue}&SPCCMEV_EventVenueDesc=${SPCCMEV_EventVenueDesc}`;
    return await api.post<any>('sports', url, {});
}

export async function deactivateMasterVenue(data: any) {
    const SPCCMEV_Id = data.spccmeV_Id;
    const SPCCMEV_ActiveFlag = data.spccmeV_ActiveFlag;

    const url = `/MasterEventVenue/deactivate?SPCCMEV_Id=${SPCCMEV_Id}&SPCCMEV_ActiveFlag=${SPCCMEV_ActiveFlag}`;
    return await api.post<any>('sports', url, {});
}
