'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterExam } from '@/types/exam/exam-module/masters';

export async function getMasterExam(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/exam_master?${urlParams}`;
    console.info('url', url);
    return await api.get<IMasterExam>('exam', url);
}

export async function addOrUpdateMasterExam(data: any) {
    const url = '/exam_master';
    return await api.post<any>('exam', url, data);
}

export async function toggleMasterExam(id: number) {
    const url = `/exam_master/toggle_exam_master/${id}`;
    return await api.put('exam', url);
}

export async function getMasterExamOrderData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/exam_master/exam_master_order_list?${urlParams}`;
    return await api.get<any>('exam', url);
}
export async function UpdatedOrderdExams(data: any) {
    const url = '/exam_master/set_exam_master_order_number';
    return await api.put<any>('exam', url, data);
}

export async function getExamsByCategoryandAcademicYear(asmaY_Id: number, emcA_Id: number) {
    const url = `/exam_master/exam_drop_down_by_year_and_category_list/${asmaY_Id}/${emcA_Id}`;
    return await api.get<any>('exam', url);
}
