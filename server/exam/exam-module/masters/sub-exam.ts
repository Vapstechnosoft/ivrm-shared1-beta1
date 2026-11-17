'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSubExam } from '@/types/exam/exam-module/masters';

export async function getMasterSubExam(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_sub_exam?${urlParams}`;
    return await api.get<IMasterSubExam>('exam', url);
}

export async function getMasterSubExamDropdownList() {
    const url = '/master_sub_exam/sub_exam_drop_down_list';
    return await api.get<IMasterSubExam>('exam', url);
}
export async function addOrUpdateMasterSubExam(data: any) {
    const url = '/master_sub_exam';
    return await api.post<any>('exam', url, data);
}

export async function toggleMasterSubExam(id: number) {
    const url = `/master_sub_exam/toggle_master_sub_exam/${id}`;
    return await api.put('exam', url);
}

export async function getMasterSubExamOrderData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_sub_exam/master_sub_exam_order_list?${urlParams}`;
    return await api.get<any>('exam', url);
}
export async function UpdatedOrderdSubExams(data: any) {
    const url = '/master_sub_exam/set_master_sub_exam_order_number';
    return await api.put<any>('exam', url, data);
}
