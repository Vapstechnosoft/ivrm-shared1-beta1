'use server';

import { api } from '@/lib/apiService';

export async function getStudentRouteMappingReportData(data: any) {
    const url = '/student_route_mapping_report/fee_student_route_mapping_report';
    return await api.post<any>('transport', url, data);
}

export async function StudentRouteMappingReportData(data: any) {
    const url = '/student_route_mapping_report/student_route_mapping_report';
    return await api.post<any>('transport', url, data);
}
