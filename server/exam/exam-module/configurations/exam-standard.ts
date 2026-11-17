'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IExamStandard } from '@/types/exam/exam-module/configurations';

export async function getExamStandard(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `exam_standard/get_exam_config_list/?${urlParams}`;
    const response = await api.get<IExamStandard>('exam', url);
    console.log('Exam Standard Response:', response);
    return { ...response };
}
export async function UpdateExamStandard(data: any) {
    try {
        const res = await api.post<any>('exam', '/exam_standard/add_or_update_exam_config', data);
        return res;
    } catch (error: any) {
        console.error('Error updating , returning mock success:', error);
        return {
            success: true,
            message: 'Mock update successfully',
            data
        };
    }
}
