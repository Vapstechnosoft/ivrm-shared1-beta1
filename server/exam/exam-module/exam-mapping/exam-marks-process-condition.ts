'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IExamMarksProcessCondition } from '@/types/exam/exam-module/exam-mapping';

export async function getExamMarksProcessCondition(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/exam_marks_process_condition?${urlParams}`;
    return await api.get<IExamMarksProcessCondition>('exam', url);
}

export async function addOrUpdateExamMarksProcessCondition(data: any) {
    const url = '/exam_marks_process_condition';
    return await api.post<any>('exam', url, data);
}
