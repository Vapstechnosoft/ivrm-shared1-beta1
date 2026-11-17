'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IYearlyCategoryDatesMapping } from '@/types/exam/exam-module/exam-mapping';
import type { IAcademicYear } from '@/types/exam/exam-module/masters';

export async function getYearlyCategoryDatesMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `yearly_category_dates_mapping/?${urlParams}`;
    const response = await api.get<IYearlyCategoryDatesMapping>('exam', url);

    return {
        ...response
    };
}

export async function addOrUpdateYearlyCategoryDatesMapping(data: any) {
    const url = '/yearly_category_dates_mapping';
    return await api.post<any>('exam', url, data);
}

// server/exam/exam-module/exam-mapping/yearly-category-dates-mapping.ts
export async function getCategoryDropDownByAcademicYearlist(asmay_id: number) {
    if (!asmay_id) throw new Error('Academic Year ID is required');
    const url = `/exam_master_category/exam_category_drop_down_by_academic_year_list/${asmay_id}`;
    return await api.get<IAcademicYear>('exam', url);
}
