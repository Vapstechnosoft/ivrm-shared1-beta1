'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IPreadmissionApplicationList } from '@/types/admission/preadmission/transactions';

export async function getExportPreadmissionStudentList(asmay_id: number, asmcl_id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'PASR_RegistrationNo,student_name,PASR_Sex,applied_class_name');
    const url = `/export_preadmission/export_admission_student_list?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&${urlParams}`;
    return await api.get<IPreadmissionApplicationList[]>('preadmission', url);
}

export async function exportPreadmissionToAdmission(asmay_id: number, data: any) {
    const url = `/export_preadmission/export_preadmission_to_admission/${asmay_id}`;
    return await api.put<any>('preadmission', url, data);
}
