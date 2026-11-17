'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { Student } from '@/types/admission/preadmission/masters';

export async function getMasterStudentList(
    amst_sol: string,
    asmay_id: number,
    asmcl_id: number,
    asms_id: number,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams, 'imcC_CategoryCode,imcC_CategoryName,imcC_CategoryDesc');
    const url = `/activate_deactivate_students/${amst_sol}?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&asms_id=${asms_id}&${urlParams}`;

    return await api.get<Student[]>('admission', url);
}

export async function ActiveDeactive(data: any) {
    const url = '/activate_deactivate_students';
    return await api.put<any>('admission', url, data);
}
