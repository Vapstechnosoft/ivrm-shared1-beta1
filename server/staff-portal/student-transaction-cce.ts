
'use server';

import { api, ApiResponse } from '@/lib/apiService';
import type {
    IStudentTransactionInitialData,
    IClass,
    ISection,
    IExamTerm,
    IExamMaster,
    ISkill,
    IActivity,
    IArea,
    IStudentTransactionSearchRequest,
    IStudentTransactionSearchResponse,
    IStudentTransactionSaveRequest
} from '@/types/staff-portal/student-transaction-cce';

const BASE_URL = '/StudentTransaction';

export async function getInitialStudentTransactionData(): Promise<ApiResponse<IStudentTransactionInitialData>> {
    return await api.get<IStudentTransactionInitialData>('portal', `${BASE_URL}/Onload/1`);
}

export async function getClasses(asmaY_Id: number, flag: string): Promise<ApiResponse<{ classList: IClass[] }>> {
    return await api.post('portal', `${BASE_URL}/onchangeyear`, { ASMAY_Id: asmaY_Id, exam_termwise_flag: flag });
}

export async function getSections(asmaY_Id: number, asmcL_Id: number, flag: string): Promise<ApiResponse<{ sectionList: ISection[] }>> {
    return await api.post('portal', `${BASE_URL}/onchangeclass`, { ASMAY_Id: asmaY_Id, ASMCL_Id: asmcL_Id, exam_termwise_flag: flag });
}

export async function getTermsOrExams(asmaY_Id: number, asmcL_Id: number, asmS_Id: number, flag: string): Promise<ApiResponse<{ examTerms: IExamTerm[], exammaster: IExamMaster[] }>> {
    return await api.post('portal', `${BASE_URL}/onchangesection`, { ASMAY_Id: asmaY_Id, ASMCL_Id: asmcL_Id, ASMS_Id: asmS_Id, exam_termwise_flag: flag });
}

export async function getSkillsOrActivities(skills: string, asmaY_Id: number, asmcL_Id: number, asmS_Id: number, flag: string): Promise<ApiResponse<{ skillsList: ISkill[], activitiesList: IActivity[] }>> {
    return await api.post('portal', `${BASE_URL}/onchangeactivitesskillflag`, { Skills: skills, ASMAY_Id: asmaY_Id, ASMCL_Id: asmcL_Id, ASMS_Id: asmS_Id, exam_termwise_flag: flag });
}

export async function getActivitiesAreas(data: any): Promise<ApiResponse<{ areasList: IArea[] }>> {
    return await api.post('portal', `${BASE_URL}/onchangeactivites`, data);
}

export async function getSkillsAreas(data: any): Promise<ApiResponse<{ areasList: IArea[] }>> {
    return await api.post('portal', `${BASE_URL}/onchangeskills`, data);
}

export async function getStudentList(data: IStudentTransactionSearchRequest): Promise<ApiResponse<IStudentTransactionSearchResponse>> {
    return await api.post('portal', `${BASE_URL}/getStudentList`, data);
}

export async function saveStudentTransaction(data: IStudentTransactionSaveRequest): Promise<ApiResponse<{ returnVal: string }>> {
    return await api.post('portal', `${BASE_URL}/saveRecord`, data);
}
