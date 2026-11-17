'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterCategoryList } from '@/types/library/masters/masters';

export async function getMasterCategoryList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'lmC_CategoryName,lmC_CategoryCode');
    const url = `/MasterCategory/master-books-category-list?${urlParams}`;

    return await api.get<IMasterCategoryList[]>('library', url);
}

export async function addOrUpdateMasterCategory(data: any) {
    const url = '/MasterCategory/add-or-update/';
    return await api.post<any>('library', url, data);
}

export async function toggleMasterCategory(id: number) {
    const url = `/MasterCategory/deactivate/${id}`;
    return await api.put('library', url);
}

export async function deleteMasterCategory(id: number) {
    const url = `/MasterCategory/toggle-master-category?id=${id}`;
    return await api.delete('fees', url);
}
