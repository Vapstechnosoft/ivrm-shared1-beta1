'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterAcademicYearMasterList, IMasterSetOrderList } from '@/types/admission/preadmission/configaration';

export async function getPreAdmissionYear(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'asmaY_Year,asmaY_AcademicYearCode,asmaY_Order,asmaY_From_Date,asmaY_Cut_Of_Date,asmaY_To_Date'
    );
    const url = `/configuration/academic_year?${urlParams}`;
    return await api.get<IMasterAcademicYearMasterList[]>('preadmission', url);
}

export async function getPreAdmissionSetOrder() {
    const url = '/configuration/academic_year_set_order_list';
    return await api.get<IMasterSetOrderList[]>('preadmission', url);
}

export async function addOrUpdatePreAdmissionYear(data: any) {
    const url = '/configuration/academic_year';
    return await api.post<any>('preadmission', url, data);
}
export async function togglePreAdmissionAcademicYear(id: number) {
    const url = `/configuration/academic_year/toggle/${id}`;
    return await api.put('preadmission', url);
}

export async function updateAcademicYearSetorder(data: any) {
    const url = '/configuration/academic_year/set_order';
    return await api.put<any>('preadmission', url, data);
}
