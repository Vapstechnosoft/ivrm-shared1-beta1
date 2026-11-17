'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterDocumentList } from '@/types/admission/preadmission/masters';

export async function getMasterDocument(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'amsmD_DocumentName,amsmD_Description');
    const url = `/master_document?${urlParams}`;
    return await api.get<IMasterDocumentList[]>('admission', url);
}

export async function addOrUpdateMasterDocument(data: any) {
    const url = '/master_document';
    return await api.post<any>('admission', url, data);
}

export async function toggleMasterDocument(id: number) {
    const url = `/master_document/toggle/${id}`;
    return await api.put('admission', url);
}

export async function deleteMasterDocument(id: number) {
    const url = `/master_document/delete/${id}`;
    return await api.delete<any>('admission', url);
}
