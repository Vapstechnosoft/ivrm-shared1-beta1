'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { MasterFeeOtherStudentType } from '@/types/fees/masters/masters';

export async function getFeeOtherStudent(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'fmosT_StudentName,fmosT_StudentId,fmosT_StudentEmailId,fmosT_StudentMobileNo'
    );
    const url = `/FeeMasterOtherStudent/master-other-students-list?${urlParams}`;
    return await api.get<MasterFeeOtherStudentType[]>('fees', url);
}

export async function saveFeeOtherStudent(payload: any) {
    const url = 'FeeMasterOtherStudent/add-or-update';
    return await api.post<any[]>('fees', url, payload);
}

export async function deleteFeeOtherStudent(id: number) {
    const url = `/FeeMasterOtherStudent/Toggle/${id}`;
    return await api.put<any[]>('fees', url);
}
