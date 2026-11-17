'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterAuthorList } from '@/types/library/masters/masters';

export async function getMasterAuthorList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'lmaU_AuthorFirstName');
    const url = `/MasterAuthor/master-author-list?${urlParams}`;
    return await api.get<IMasterAuthorList[]>('library', url);
}

export async function addOrUpdateMasterAuthor(data: any) {
    const url = '/MasterAuthor/add-or-update/';
    return await api.post<any>('library', url, data);
}

export async function toggleMasterAuthor(id: number) {
    const url = `/MasterAuthor/toggle?LMAU_Id=${id}`;
    return await api.put('library', url);
}

export async function deleteMasterAuthor(id: number) {
    const url = `/MasterAuthor/delete/${id}`;
    return await api.delete('library', url);
}
