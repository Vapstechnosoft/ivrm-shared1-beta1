'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterCasteCategoryDropDown, IMasterReligionCasteCategoryList } from '@/types/admission/preadmission/masters';

export async function getMasterReligionCasteCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'imcC_CategoryName,ivrmmR_Name');
    const url = `/master_religion_caste_category?${urlParams}`;
    return await api.get<IMasterReligionCasteCategoryList[]>('admission', url);
}

export async function addMasterReligionCasteCategory(data: any) {
    const url = '/master_religion_caste_category';
    return await api.post<any>('admission', url, data);
}

export async function toggleMasterReligionCasteCategory(id: number) {
    const url = `/master_religion_caste_category/toggle/${id}`;
    return await api.put('admission', url);
}

export async function getUnmappedCasteCategoryDropdown() {
    const url = '/master_religion_caste_category/unmapped_master_caste_category_drop_down_list';
    return await api.get<IMasterCasteCategoryDropDown[]>('admission', url);
}
