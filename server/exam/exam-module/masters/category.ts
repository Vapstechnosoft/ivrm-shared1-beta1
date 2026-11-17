'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterCategory } from '@/types/exam/exam-module/masters';

export async function getExamMasterCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/exam_master_category?${urlParams}`;
    return await api.get<IMasterCategory>('exam', url);
}

export async function getExamMasterCategoryDropdownList() {
    const url = 'exam_master_category/exam_master_category_drop_down_list';
    return await api.get<IMasterCategory[]>('exam', url);
}

export async function addOrUpdateExamMasterCategory(data: any) {
    const url = '/exam_master_category';
    return await api.post<any>('exam', url, data);
}

export async function toggleMasterExamCategory(id: number) {
    const url = `/exam_master_category/toggle_exam_master_category/${id}`;
    return await api.put('exam', url);
}
