'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IPreadmissionAdmissionStatusDropdown, IPreadmissionApplicationList } from '@/types/admission/preadmission/transactions';

export async function getPreadmissionAdmissionStatusDropdown() {
    const url = '/transfer_preadmission_status/preadmission_admission_statuses';
    return await api.get<IPreadmissionAdmissionStatusDropdown[]>('preadmission', url);
}

export async function getPreadmissionStudentList(asmay_id: number, asmcl_id: number, pamst_id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'PASR_RegistrationNo,student_name,PASR_Sex,applied_class_name,current_status');
    const url = `/transfer_preadmission_status/preadmission_student_list?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&pamst_id=${pamst_id}&${urlParams}`;
    return await api.get<IPreadmissionApplicationList[]>('preadmission', url);
}

export async function updateStudentPreadmissionStatus(data: any) {
    const url = '/transfer_preadmission_status/update_student_preadmission_status';
    return await api.put<any>('preadmission', url, data);
}
