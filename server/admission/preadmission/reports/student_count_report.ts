'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IParentsDashboardStudentResponse } from '@/types/admission/preadmission/reports';

export async function addOrUpdateStudentCountReport(data: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'name');
    const url = `/preadmission_reports/preadmission_student_count_report?${urlParams}`;
    return await api.post<any>('preadmission', url, data);
}
export async function getParentDashboardDetails(asmay_id: number) {
    const url = `/student_application_form/get_parent_dashboard_details/${asmay_id}`;
    return await api.get<IParentsDashboardStudentResponse[]>('preadmission', url);
}
