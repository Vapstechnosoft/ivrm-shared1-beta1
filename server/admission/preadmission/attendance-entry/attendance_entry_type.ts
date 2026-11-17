'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IAttendanceEntryTypeList } from '@/types/admission/preadmission/attendance_entry';

export async function getAttendanceEntryType(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asmcL_ClassName,asaeT_EntryType');
    const url = `/attendance_entry_type?${urlParams}`;
    return await api.get<IAttendanceEntryTypeList[]>('admission', url);
}

export async function getClassDropdownList(_asmaY_Id: number) {
    const url = '/master_class_category/master_class_drop_down_list';
    return await api.get('admission', url);
}

export async function saveAttendanceEntryType(data: any) {
    const url = '/attendance_entry_type';
    return await api.post<any>('admission', url, data);
}

export async function updateAttendanceEntryType(data: any) {
    const url = '/attendance_entry_type';
    return await api.put<any>('admission', url, data);
}

export async function deleteAttendanceEntryType(id: number) {
    const url = `/attendance_entry_type/${id}`;
    return await api.delete<any>('admission', url);
}
