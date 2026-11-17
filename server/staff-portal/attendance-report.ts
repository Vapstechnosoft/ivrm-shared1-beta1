'use server';

import { api } from '@/lib/apiService';
import type {  ApiResponse } from '@/lib/apiService';
import type {
    IAttendanceReportInitialData,
    IAttendanceReportResponse,
    IAttendanceReportSearch,
    IClass,
    ISection
} from '@/types/staff-portal/attendance-report';

const BASE_URL = '/AttendanceReport';

export async function getInitialData(): Promise<ApiResponse<IAttendanceReportInitialData>> {
    return await api.get<IAttendanceReportInitialData>('portal', `${BASE_URL}/getdetails/`);
}

export async function getClasses(data: { ASMAY_Id: number; AMC_Id: number }): Promise<ApiResponse<{ classlist: IClass[] }>> {
    return await api.post('portal', `${BASE_URL}/getclass`, data);
}

export async function getSections(data: { ASMAY_Id: number; ASMCL_Id: number }): Promise<ApiResponse<{ sectionList: ISection[] }>> {
    return await api.post('portal', `${BASE_URL}/getsection`, data);
}

export async function getAttendanceReport(data: IAttendanceReportSearch): Promise<ApiResponse<IAttendanceReportResponse>> {
    return await api.post('portal', `${BASE_URL}/getAttendetails`, data);
}
