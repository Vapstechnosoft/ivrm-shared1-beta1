'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterReligionCategoryMappingList } from '@/types/hrms/hrms-config/master';

/**
 * Get religion category mapping list with search, sort, and pagination
 * GET /api/MasterReligionCategory_Mapping
 */
export async function getReligionCategoryMappingList(searchParams?: ApiSearchparams) {
    const searchableColumns = 'ivrmmR_Name,imcC_CategoryName';
    const urlParams = getSearchParamsUrl(searchParams ?? {}, searchableColumns);
    const url = `/api/MasterReligionCategory_Mapping?${urlParams}`;
    return await api.get<IMasterReligionCategoryMappingList[]>('hrms', url);
}

/**
 * Save or Update religion category mapping
 * POST /api/MasterReligionCategory_Mapping
 */
export async function saveReligionCategoryMapping(data: any) {
    const url = '/api/MasterReligionCategory_Mapping';
    return await api.post<any>('hrms', url, data);
}

/**
 * Get religion category mapping by ID
 * GET /api/MasterReligionCategory_Mapping/get_religion_category_mapping_by_id/{id}
 */
export async function getReligionCategoryMappingById(id: number) {
    const url = `/api/MasterReligionCategory_Mapping/get_religion_category_mapping_by_id/${id}`;
    return await api.get<any>('hrms', url);
}


/**
 * Toggle religion category mapping (activate/deactivate)
 * PUT /api/MasterReligionCategory_Mapping/toggle_religion_category/{id}
 */
export async function toggleReligionCategoryMapping(id: number) {
    const url = `/api/MasterReligionCategory_Mapping/toggle_religion_category/${id}`;
    return await api.put<any>('hrms', url);
}

/**
 * Get Religion Dropdown
 * GET /api/MasterDropDown/get_religion_drop_down
 */
export async function getReligionDropdown() {
    const url = '/api/MasterDropDown/get_religion_drop_down';
    return await api.get<any>('hrms', url);
}

/**
 * Get Caste Category Dropdown
 * GET /api/MasterDropDown/get_caste_category_drop_down
 */
export async function getCasteCategoryDropdown() {
    const url = '/api/MasterDropDown/get_caste_category_drop_down';
    return await api.get<any>('hrms', url);
}
