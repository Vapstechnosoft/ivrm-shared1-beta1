'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterCompetitionLevel } from '@/types/sports/masters/competition-level';

export async function getMasterCompetitionLevels(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/SportMasterCompitionLevel/getDetails?${urlParams}`;
    return await api.post<IMasterCompetitionLevel[]>('sports', url);
}

export async function getMasterCompetitionLevelDetails(id: number) {
    const url = `/SportMasterCompitionLevel/editDetails/${id}`;
    return await api.get<IMasterCompetitionLevel>('sports', url);
}

export async function saveMasterCompetitionLevel(data: any) {
    const SPCCMCL_Id = data.spccmcL_Id || 0;
    const SPCCMCL_CompitionLevel = encodeURIComponent(data.spccmcL_CompitionLevel || '');
    const SPCCMCL_CLDesc = encodeURIComponent(data.spccmcL_CLDesc || '');

    const url = `/SportMasterCompitionLevel/save?SPCCMCL_Id=${SPCCMCL_Id}&SPCCMCL_CompitionLevel=${SPCCMCL_CompitionLevel}&SPCCMCL_CLDesc=${SPCCMCL_CLDesc}`;
    return await api.post<any>('sports', url, {});
}

export async function deactivateMasterCompetitionLevel(data: any) {
    const SPCCMCL_Id = data.spccmcL_Id;
    const SPCCMCL_ActiveFlag = data.spccmcL_ActiveFlag;

    const url = `/SportMasterCompitionLevel/deactivate?SPCCMCL_Id=${SPCCMCL_Id}&SPCCMCL_ActiveFlag=${SPCCMCL_ActiveFlag}`;
    return await api.post<any>('sports', url, {});
}
