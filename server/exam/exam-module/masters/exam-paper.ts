'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterExamPaper } from '@/types/exam/exam-module/masters';

export async function getMasterExamPaper(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/exam_master/exam_master_paper_type_list?${urlParams}`;
    return await api.get<IMasterExamPaper>('exam', url);
}

export async function addOrUpdateMasterExamPaper(data: any) {
    const url = '/exam_master/add_or_update_exam_master_paper_type';
    return await api.post<any>('exam', url, data);
}

export async function toggleMasterExamPaper(id: number) {
    const url = `/exam_master/toggle_exam_master_paper_type/${id}`;
    return await api.put('exam', url);
}
