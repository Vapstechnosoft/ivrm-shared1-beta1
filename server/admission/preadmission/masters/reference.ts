'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterReferenceList } from '@/types/admission/preadmission/masters';

export async function getMasterReference(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'pamR_ReferenceName,pamR_ReferenceDesc');
    const url = `/master_reference?${urlParams}`;
    return await api.get<IMasterReferenceList[]>('admission', url);
}

export async function addOrUpdateMasterReference(data: any) {
    const url = '/master_reference';
    return await api.post<any>('admission', url, data);
}
export async function deleteMasterReference(id: number) {
    const url = `/master_reference/delete/${id}`;
    return await api.delete<any>('admission', url);
}
