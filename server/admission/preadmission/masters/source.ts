'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSourceList } from '@/types/admission/preadmission/masters';

export async function getMasterSource(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'pamS_SourceName,pamS_SourceDesc');
    const url = `/master_source?${urlParams}`;
    return await api.get<IMasterSourceList[]>('admission', url);
}

export async function addOrUpdateMasterSource(data: any) {
    const url = '/master_source';
    return await api.post<any>('admission', url, data);
}
export async function deleteMasterSource(id: number) {
    const url = `/master_source/delete/${id}`;
    return await api.delete<any>('admission', url);
}
