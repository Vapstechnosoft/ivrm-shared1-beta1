'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterDivision } from '@/types/sports/masters/division';

export async function getMasterDivisions(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/SportMasterDivision/Getdetails?${urlParams}`;
    return await api.post<IMasterDivision[]>('sports', url, {});
}

export async function getMasterDivisionDetails(id: number) {
    const url = `/SportMasterDivision/editDetails/${id}`;
    return await api.get<IMasterDivision>('sports', url);
}

export async function saveMasterDivision(data: any) {
    const SPCCMD_Id = data.spccmD_Id || 0;
    const SPCCMD_DivisionName = encodeURIComponent(data.spccmD_DivisionName || '');
    const SPCCMD_DivisionDescription = encodeURIComponent(data.spccmD_DivisionDescription || '');

    const url = `/SportMasterDivision/save?SPCCMD_Id=${SPCCMD_Id}&SPCCMD_DivisionName=${SPCCMD_DivisionName}&SPCCMD_DivisionDescription=${SPCCMD_DivisionDescription}`;
    return await api.post<any>('sports', url, {});
}

export async function deactivateMasterDivision(data: any) {
    const SPCCMD_Id = data.spccmD_Id;
    const SPCCMD_ActiveFlag = data.spccmD_ActiveFlag;

    const url = `/SportMasterDivision/deactivate?SPCCMD_Id=${SPCCMD_Id}&SPCCMD_ActiveFlag=${SPCCMD_ActiveFlag}`;
    return await api.post<any>('sports', url, {});
}
