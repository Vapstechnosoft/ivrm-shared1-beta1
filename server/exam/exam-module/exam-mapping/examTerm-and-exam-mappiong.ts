'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IExamTermAndExamMapping, IExamTermAndExamMappingDetails } from '@/types/exam/exam-module/exam-mapping';
// // import type { IExam, ITerm } from '@/types/exam/exam-module/masters';

// --------------------------------------------
// Get All Exam Term and Exam Mappings
// --------------------------------------------
export async function getExamTermAndExamMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/exam_term_and_exam_mapping/?${urlParams}`;
    const response = await api.get<IExamTermAndExamMapping>('exam', url);
    return { ...response };
}
export async function getExamTermAndExamMappingDetails(asmay_id: number, emca_id: number, ect_id: number) {
    if (!ect_id) throw new Error('Term ID is required');
    const url = `/exam_term_and_exam_mapping/term_and_exam_mapping_details_view_by_ids/${asmay_id}/${emca_id}/${ect_id}`;
    return await api.get<IExamTermAndExamMappingDetails>('exam', url);
}

export async function addOrUpdateExamTermAndExamMapping(data: any) {
    const url = '/exam_term_and_exam_mapping';
    return await api.post<any>('exam', url, data);
}

export async function getMappedExamsByTerm(asmay_id: number, termId: number) {
    if (!termId) throw new Error('Term ID is required');
    const url = `/exam_term_exam_mapping/exam_term_mapping_details/${asmay_id}/${termId}`;
    return await api.get<IExamTermAndExamMapping>('exam', url);
}

export async function toggleExamTermAndExamMapping(asmay_id: number, emca_id: number, ect_id: number) {
    const url = `/exam_term_and_exam_mapping/toggle_term_and_exam_mapping/${asmay_id}/${emca_id}/${ect_id}`;
    return await api.put('exam', url);
}

export async function toggleExamTermAndExamMappingDetails(etem_id: number) {
    const url = `/exam_term_and_exam_mapping/toggle_exam_term_mapping/${etem_id}`;
    return await api.put('exam', url);
} // Not use
