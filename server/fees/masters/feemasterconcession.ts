'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterConcessionList } from '@/types/fees/masters';

export async function getMasterConcession(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'fmcC_ConcessionName,fmcC_ConcessionApplLimit');
    const url = `FeeMasterConcession/FeeMasterConcessionList?${urlParams}`;
    return await api.get<IMasterConcessionList[]>('fees', url);
}

export async function addOrUpdateMasterConcession(data: any) {
    const url = 'FeeMasterConcession/AddOrUpdateConcession';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterConcession(mi_id: number, id: number) {
    const url = `FeeMasterConcession/ToggleConcession/${id}`;
    return await api.put('fees', url);
}

export async function deleteMasterConcession(id: number) {
    const url = `/FeeMasterConcession/DeleteConcession/${id}`;
    return await api.delete('fees', url);
}
