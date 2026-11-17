'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSubject } from '@/types/exam/exam-module/masters';

export async function getMasterSubject(searchParams?: ApiSearchparams) {
    console.info('searchParams', searchParams);
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_subject?${urlParams}`;
    const res = await api.get<IMasterSubject[]>('exam', url);
    return res;
}
export async function getMasterSubjectDropdownList() {
    const url = '/master_subject/master_subject_drop_down_list';
    const res = await api.get<IMasterSubject[]>('exam', url);
    return res;
}

export async function addOrUpdateMasterSubject(data: any) {
    const url = '/master_subject';
    return await api.post<any>('exam', url, data);
}

export async function toggleMasterSubject(id: number) {
    const url = `/master_subject/toggle/${id}`;
    return await api.put('exam', url);
}

export async function getMasterSubjectOrderData() {
    const url = '/master_subject/master_subject_order_list';
    return await api.get('exam', url);
}

export async function UpdatedOrderdSubjects(data: any) {
    const url = '/master_subject/set_master_subject_order_number';
    return await api.put<any>('exam', url, data);
}
