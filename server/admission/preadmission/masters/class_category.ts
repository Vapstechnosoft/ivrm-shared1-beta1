'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IAcademicYearDropDown,
    IMasterCategoryDropDown,
    IMasterClassCategoryList,
    IMasterClassCategorySectionList,
    IMasterClassDropDown,
    IMasterSectionDropDown
} from '@/types/admission/preadmission/masters';

export async function getMasterClassCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asmaY_Year,amC_Name,asmcL_ClassName');
    const url = `/master_class_category?${urlParams}`;
    return await api.get<IMasterClassCategoryList[]>('admission', url);
}

export async function getAcademicYearDropdown() {
    const url = '/master_class_category/academic_year_drop_down_list';
    return await api.get<IAcademicYearDropDown[]>('admission', url);
}

export async function getMasterClassDropdown() {
    const url = '/master_class_category/master_class_drop_down_list';
    return await api.get<IMasterClassDropDown[]>('admission', url);
}
export async function getMasterUnmappedClassDropdown(asmaY_Id?: number, amC_Id?: number) {
    const url = `/master_class_category/unmapped_class_drop_down_list?asmay_id=${asmaY_Id}&amc_id=${amC_Id}`;
    return await api.get<IMasterClassDropDown[]>('admission', url);
}

export async function getMasterSectionDropdown() {
    const url = '/master_class_category/master_section_drop_down_list';
    return await api.get<IMasterSectionDropDown[]>('admission', url);
}

export async function addMasterClassCategory(data: any) {
    const url = '/master_class_category';
    return await api.post<any>('admission', url, data);
}

export async function toggleMasterClassCategory(id: number) {
    const url = `/master_class_category/toggle/${id}`;
    return await api.put('admission', url);
}

export async function getClassCategorySection(id: number) {
    const url = `/master_class_category/category_class_section_details/${id}`;
    return await api.get<IMasterClassCategorySectionList>('admission', url);
}
export async function toggleMasterClassCategorySection(id: number) {
    const url = `/master_class_category/toggle_section/${id}`;
    return await api.put('admission', url);
}
export async function getMasterCategoryDropdown() {
    const url = '/master_class_category/master_category_drop_down_list';
    return await api.get<IMasterCategoryDropDown[]>('admission', url);
}
