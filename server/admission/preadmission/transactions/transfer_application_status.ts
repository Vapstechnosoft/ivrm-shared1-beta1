'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams, IDropdown } from '@/types';
import type { IActivePreadmissionDetails, IPreadmissionApplicationList } from '@/types/admission/preadmission/transactions';

export async function getActivePreadmissionDetails() {
    const url = '/transfer_application_status/active_preadmission_details';
    return await api.get<IActivePreadmissionDetails>('preadmission', url);
}

export async function getApplicationStatusDropdown() {
    const url = '/transfer_application_status/preadmission_application_statuses';
    return await api.get<IDropdown[]>('preadmission', url);
}

export async function getApplicationStudentList(asmay_id: number, asmcl_id: number, pasraps_id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'PASR_RegistrationNo,student_name,PASR_Sex,applied_class_name');
    const url = `/transfer_application_status/application_student_list?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&pasraps_id=${pasraps_id}&${urlParams}`;

    return await api.get<IPreadmissionApplicationList[]>('preadmission', url);
}

export async function updateStudentApplicationStatus(data: any) {
    const url = '/transfer_application_status/update_student_application_status';
    return await api.put<any>('preadmission', url, data);
}
