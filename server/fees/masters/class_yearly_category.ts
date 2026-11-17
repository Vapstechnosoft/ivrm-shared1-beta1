'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterClassYearlyList } from '@/types/fees/masters/masters';
export async function getMasterClassYearlyCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asmaY_Year,fmcC_ClassCategoryName,asmcL_ClassName');
    const url = `/fee_class_category/yearlyclasscategorylist?${urlParams}`;
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getAcademicYearDropdown() {
    const url = '/fee_class_category/academicyearlist';

    console.info('getAcademicYearDropdown', url);
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getClassCategory() {
    const url = '/fee_class_category/classcategorylist';
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getGroupListCategory(asmay_id: number, data: any) {
    const url = `/fee_class_category/class_drop_down_list?asmay_id=${asmay_id}`;

    return await api.post<any>('fees', url, data);
}

export async function addOrUpdateMasterClassYearlyCategory(data: any) {
    const url = '/fee_class_category/AddOrUpdateYearlyClassCategory';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterclassYearlyCategory(id: number) {
    const url = `/fee_class_category/deletedetailsY/${id}`;
    return await api.put('fees', url);
}
