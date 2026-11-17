'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams, IDropdown } from '@/types';
import type { IMasterCasteCategoryList } from '@/types/admission/preadmission/masters';

export async function getMasterCasteCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'imcC_CategoryCode,imcC_CategoryName,imcC_CategoryDesc');
    const url = `/master_caste_category?${urlParams}`;
    return await api.get<IMasterCasteCategoryList[]>('admission', url);
}

export async function getMasterCasteCategoryCodeDropdown() {
    const url = '/master_caste_category/caste_category_code_drop_down_list';
    return await api.get<IDropdown[]>('admission', url);
}

export async function addOrUpdateMasterCasteCategory(data: any) {
    const url = '/master_caste_category';
    return await api.post<any>('admission', url, data);
}
export async function deleteCasteCategory(id: number) {
    const url = `/master_caste_category/delete/${id}`;
    return await api.delete<any>('admission', url);
}
