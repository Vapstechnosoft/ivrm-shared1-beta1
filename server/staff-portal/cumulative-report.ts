'use server';

import { api, ApiResponse } from '@/lib/apiService';
import type {
    ICumulativeReportInitialData,
    IClass,
    ISection,
    IExam,
    IStudent,
    ISearchRequest,
    IReportResponse
} from '@/types/staff-portal/cumulative-report';

const EXAM_URL = '/ExamCalculation_SSSE';
const REPORT_URL = '/CumulativeReport';

export async function getInitialData(): Promise<ApiResponse<ICumulativeReportInitialData>> {
    const response = await api.get<ICumulativeReportInitialData>('portal', `${REPORT_URL}/Getdetails`);
    return response;
}

export async function getClasses(asmaY_Id: number): Promise<ApiResponse<{ classlist: IClass[] }>> {
    return await api.post('portal', `${EXAM_URL}/get_classes`, { ASMAY_Id: asmaY_Id });
}

export async function getSections(asmaY_Id: number, asmcL_Id: number): Promise<ApiResponse<{ seclist: ISection[] }>> {
    return await api.post('portal', `${EXAM_URL}/get_cls_sections`, {
        ASMAY_Id: asmaY_Id,
        ASMCL_Id: asmcL_Id
    });
}

export async function getExams(data: { ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number, Left_Flag: boolean, Deactive_Flag: boolean }): Promise<ApiResponse<{ exmstdlist: IExam[], studentlist: IStudent[] }>> {
    return await api.post('portal', `${EXAM_URL}/get_exams`, data);
}

export async function getReport(data: ISearchRequest): Promise<ApiResponse<IReportResponse>> {
    return await api.post('portal', `${REPORT_URL}/savedetails`, data);
}
