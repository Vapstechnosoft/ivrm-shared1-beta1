'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSubSubject } from '@/types/exam/exam-module/masters';

// ✅ Get Master SubSubjects
export async function getMasterSubSubject(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_sub_subject?${urlParams}`;
    return await api.get<IMasterSubSubject>('exam', url);
}

export async function getMasterSubSubjectDropdownList() {
    const url = '/master_sub_subject/sub_subject_drop_down_list';
    return await api.get<IMasterSubSubject>('exam', url);
}

// ✅ Add or Update Master SubSubject
export async function addOrUpdateMasterSubSubject(data: any) {
    const url = '/master_sub_subject';
    return await api.post<any>('exam', url, data);
}

// ✅ Toggle Master SubSubject
export async function toggleMasterSubSubject(id: number) {
    const url = `/master_sub_subject/toggle/${id}`;
    return await api.put('exam', url);
}

export async function getMasterSubSubjectOrderData() {
    const url = '/master_sub_subject/master_sub_subject_order_list';
    return await api.get('exam', url);
}

export async function UpdatedOrderdSubSubjects(data: any) {
    const url = '/master_sub_subject/set_master_sub_subject_order_number';
    return await api.put<any>('exam', url, data);
}
