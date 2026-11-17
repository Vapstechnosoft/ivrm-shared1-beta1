'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IYearlyCategorySubjectMapping, IYearlyCategorySubjectMappingViewDetails } from '@/types/exam/exam-module/exam-mapping';

export async function getYearlyCategorySubjectMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `category_subject_mapping/?${urlParams}`;
    const response = await api.get<IYearlyCategorySubjectMapping>('exam', url);

    return {
        ...response
    };
}

export async function getYearlyCategorySubjectMappingDetails(eyc_Id: number, eycg_id: number, asmay_id: number) {
    const url = `/category_subject_mapping/yearly_category_subject_view_by_ids/${eyc_Id}/${eycg_id}/${asmay_id}`;
    return await api.get<IYearlyCategorySubjectMappingViewDetails>('exam', url);
}

export async function addOrUpdateYearlyCategorySubjectMapping(data: any) {
    const url = '/category_subject_mapping';
    return await api.post<any>('exam', url, data);
}

export async function toggleYearlyCategorySubjectMapping(eycg_id: number) {
    const url = `/category_subject_mapping/toggle_yearly_category_subjects/${eycg_id}`;
    return await api.put('exam', url);
}
