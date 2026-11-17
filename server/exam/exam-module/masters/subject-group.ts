'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSubjectGroup, IMasterSubjectGroupDetails } from '@/types/exam/exam-module/masters';

// 1️⃣ Get all Master Subject Groups
export async function getMasterSubjectGroup(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_subject_group?${urlParams}`;
    return await api.get<IMasterSubjectGroup>('exam', url);
}

// 2️⃣ Get details for a single Master Subject Group
export async function getMasterSubjectGroupDetails(groupId: number) {
    const url = `/master_subject_group/subject_group_details_view_by_id/${groupId}`;
    return await api.get<IMasterSubjectGroupDetails>('exam', url);
}

// 3️⃣ Add or Update Master Subject Group
export async function addOrUpdateMasterSubjectGroup(data: any) {
    const url = '/master_subject_group';
    return await api.post<any>('exam', url, data);
}

// 4️⃣ Toggle Master Subject Group Status
export async function toggleMasterSubjectGroup(id: number) {
    const url = `/master_subject_group/toggle/${id}`;
    return await api.put('exam', url);
}

export async function getAllMasterSubjectDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/master_subject_group/master_subject_active_list?${urlParams}`;
    return await api.get<IMasterSubjectGroupDetails>('exam', url);
}

export async function getMasterSubjectGroupDetailsById(groupId: number) {
    const url = `/master_subject_group/GetSubjectGroupDetailsViewById/${groupId}`;
    return await api.get<IMasterSubjectGroupDetails>('exam', url);
}

export async function getSubjectsGroupDropDownByList() {
    const url = '/master_subject_group/subjects_group_drop_down_by_list';
    return await api.get<IMasterSubjectGroupDetails>('exam', url);
}
