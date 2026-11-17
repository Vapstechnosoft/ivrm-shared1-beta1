'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterProgram } from '@/types/sports/masters/program';

export async function getMasterPrograms(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/ProgramMaster/getDetails?${urlParams}`;
    return await api.post<IMasterProgram[]>('sports', url, {});
}

export async function getMasterProgramDetails(id: number) {
    const url = `/ProgramMaster/EditDetails/${id}`;
    return await api.get<IMasterProgram>('sports', url);
}

export async function saveMasterProgram(data: any) {
    const SPCCPM_Id = data.spccpM_Id || 0;
    const SPCCPM_Name = encodeURIComponent(data.spccpM_Name || '');
    const SPCCPM_Description = encodeURIComponent(data.spccpM_Description || '');

    const url = `/ProgramMaster/save?SPCCPM_Id=${SPCCPM_Id}&SPCCPM_Name=${SPCCPM_Name}&SPCCPM_Description=${SPCCPM_Description}`;
    return await api.post<any>('sports', url, {});
}

export async function deactivateMasterProgram(data: any) {
    const SPCCPM_Id = data.spccpM_Id;
    const SPCCPM_ActiveFlag = data.spccpM_ActiveFlag;

    const url = `/ProgramMaster/deactivate?SPCCPM_Id=${SPCCPM_Id}&SPCCPM_ActiveFlag=${SPCCPM_ActiveFlag}`;
    return await api.post<any>('sports', url, {});
}
