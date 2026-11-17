'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IFeeAcademicYearDropdownList } from '@/types/fees/reports/reports';
import type { IApiResponse, IAttendanceData, IAttendanceYear, ICOEData } from '@/types/student-portal/masters/attendance-details';
import type { IStudentFeedbackList } from '@/types/student-portal/masters/attendance-details';

export async function getAttendanceInitialData(searchParams?: ApiSearchparams) {
    const url = '/AttendanceDetails/get-academic-dropdown';
    return await api.get<IApiResponse<IAttendanceYear[]>>('portal', url);
}

export async function getAttendanceData(data: any) {
    //console.log('Server Action getAttendanceData called with:', data);
    const url = '/AttendanceDetails/attendance-list';
    const response = await api.post<IApiResponse<IAttendanceData[]>>('portal', url, data);
    //console.log('Server Action received response:', JSON.stringify(response, null, 2));
    return response;
}

export async function getStudentFeedbackList(AMST_Id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asgfE_FeedBack');
    const url = `/StudentFeedbackForm/feedback-list?AMST_Id=${AMST_Id}&${urlParams}`;
    return await api.get<IStudentFeedbackList[]>('portal', url);
}

export async function saveStudentFeedback(data: any) {
    const url = '/StudentFeedbackForm/save-feedback/';
    return await api.post<any>('portal', url, data);
}

export async function getCOEList(amst_id: number, asmay_id: number, asmcl_id: number, month_id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'coemE_EventName');
    //const url = `/COE/coe-events-list?AMST_Id=${amst_id}&ASMAY_Id=${asmay_id}&ASMCL_Id=${asmcl_id}&Month_Id=${month_id}&${urlParams}`;
    const url = `/COE/coe-events-list?asmcl_id=397&month_id=1&${urlParams}`;

    return await api.get<IApiResponse<ICOEData[]>>('portal', url);
}

export async function getAcademicYeardropdown() {
    const url = '/FeesCommon/academic-year-list';
    return await api.get<IFeeAcademicYearDropdownList[]>('fees', url);
}
