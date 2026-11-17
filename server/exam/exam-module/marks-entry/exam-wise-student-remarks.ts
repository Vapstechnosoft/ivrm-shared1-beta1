'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IExamWiseRemarksGrid, IExamWiseStudentRemarksStudent } from '@/types/exam/exam-module/exam-mapping';

// -------------------------------
// 1) GET – Student Data Grid
// -------------------------------
export async function getExamWiseRemarksDataGrid(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `exam_master_remark/student_exam_remarks_grid?${urlParams}`;
    return await api.get<IExamWiseRemarksGrid>('exam', url);
}

// -------------------------------
// 2) GET – Search Student Details
// -------------------------------
export async function getStudentDetails(asmaY_Id: number, asmcL_Id: number, asmS_Id: number, emE_Id: number) {
    const queryString = new URLSearchParams({
        ASMAY_Id: asmaY_Id.toString(),
        ASMCL_Id: asmcL_Id.toString(),
        ASMS_Id: asmS_Id.toString(),
        EME_Id: emE_Id.toString()
        // MI_Id: MI_Id.toString()
    }).toString();
    const query = `exam_master_remark/search_student_exam_remarks_deatils?${queryString}`;
    const response = await api.get<IExamWiseStudentRemarksStudent[]>('exam', query);
    return response;
}

export async function addOrUpdateExamStudentRemarks(data: any) {
    const url = 'exam_master_remark/add_or_update_exam_student_remarks';
    return await api.post<any>('exam', url, data);
}
