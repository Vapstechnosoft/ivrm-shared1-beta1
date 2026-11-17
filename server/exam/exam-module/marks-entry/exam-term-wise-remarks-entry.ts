'use server';

import { api } from '@/lib/apiService';

/* ---------------------------------------------
 * 1) GET – Dropdown Term Names By IDs
 * --------------------------------------------- */
export async function getDropdownTermNamesByIds(asmay_id: number, asmcl_id: number, asms_id: number) {
    const url = `exam_term_wise_remarks_/dropdown_term_names_by_ids/${asmay_id}/${asmcl_id}/${asms_id}`;
    return await api.get<any>('exam', url);
}

/* ---------------------------------------------
 * 2) POST – Get Student List For Remarks
 * --------------------------------------------- */
export async function getStudentListForTermWiseRemarks(data: {
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    ecT_Id: number;
    // mI_Id: number;
}) {
    const url = 'exam_term_wise_remarks_/get_student_list_for_remarks';
    return await api.post<any>('exam', url, data);
}

/* ---------------------------------------------
 * 3) POST – Add / Update Term Wise Remarks
 * --------------------------------------------- */
export async function addOrUpdateTermWiseRemarks(data: {
    // mI_Id: number;
    asmcL_Id: number;
    asmaY_Id: number;
    asmS_Id: number;
    indiorfinal: string;
    ecT_Id: number;
    studentTerm_Remarks: {
        amsT_Id: number;
        ecterE_Remarks: string;
    }[];
}) {
    const url = 'exam_term_wise_remarks_/add_or_update_termwise_remarks';
    return await api.post<any>('exam', url, data);
}
