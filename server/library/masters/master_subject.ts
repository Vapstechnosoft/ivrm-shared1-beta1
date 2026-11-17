'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSubjectList, IParentSubjectDropdownList } from '@/types/library/masters/masters';

export async function getMasterSubjectList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'lmS_SubjectName');
    const url = `/MasterSubject/master-subject-list?${urlParams}`;
    return await api.get<IMasterSubjectList[]>('library', url);
}

export async function addOrUpdateMasterSubject(data: any) {
    const url = '/MasterSubject/add-or-update/';
    return await api.post<any>('library', url, data);
}

export async function toggleMasterSubject(id: number) {
    const url = `/MasterSubject/toggle/${id}`;
    return await api.put('library', url);
}

export async function deleteMasterSubject(id: number) {
    const url = `/MasterSubject/Delete?id=${id}`;
    return await api.delete('library', url);
}

export async function getparentsubjectdropdown() {
    const url = '/MasterSubject/parent-subject-dropdown';
    return await api.get<IParentSubjectDropdownList[]>('library', url);
}
