'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterLanguageList } from '@/types/library/masters/masters';

export async function getMasterLanguageList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'lmL_LanguageName');
    const url = `/MasterLanguage/master-language-list?${urlParams}`;
    return await api.get<IMasterLanguageList[]>('library', url);
}

export async function addOrUpdateMasterLanguage(data: any) {
    const url = '/MasterLanguage/add-or-update/';
    return await api.post<any>('library', url, data);
}

export async function toggleMasterLanguage(id: number) {
    const url = `/MasterLanguage/toggle/${id}`;
    return await api.put('library', url);
}

export async function deleteMasterLanguage(id: number) {
    const url = `/MasterLanguage/delete/${id}`;
    return await api.delete('library', url);
}
