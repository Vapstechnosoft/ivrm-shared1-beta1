'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import type {
    IExamwiseRemarksInitialData,
    IClass,
    ISection,
    IExam,
    IStudentExamRemarks,
    ISubjectWiseRemark,
    IExamwiseRemarksSave,
    IExamConfig,
    ISavedExammkDetail,
    IStudentMarkExammk
} from '@/types/staff-portal/examwise-student-remarks.d';

const BASE_URL = '/exammasterRemak';

export async function studentDataLoad(): Promise<ApiResponse<any>> {
    return await api.get('portal', `${BASE_URL}/studentdataload`);
}

export async function onChangeYear(data: { ASMAY_Id: number }): Promise<ApiResponse<{ classlist: IClass[] }>> {
    return await api.post('portal', `${BASE_URL}/onchangeyear`, data);
}

export async function onChangeClass(data: { ASMAY_Id: number; ASMCL_Id: number }): Promise<ApiResponse<{ sectionlist: ISection[] }>> {
    return await api.post('portal', `${BASE_URL}/onchangeclass`, data);
}

export async function onChangeSection(data: { ASMAY_Id: number; ASMCL_Id: number; ASMS_Id: number }): Promise<ApiResponse<{ examlist: IExam[] }>> {
    return await api.post('portal', `${BASE_URL}/onchangesection`, data);
}

export async function searchData(data: {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number;
    Ep_Id?: number; // Seems unused in UI but present in payload
}): Promise<ApiResponse<{
    studentList: IStudentExamRemarks[];
    configuration: IExamConfig[];
    savedata: ISavedExammkDetail[];
    getstudentmarks: IStudentMarkExammk[];
    get_subjectwiseremarks: { amsT_Id: number }[]; // Just to check flag
}>> {
    return await api.post('portal', `${BASE_URL}/searchdata`, data);
}

export async function saveMapping(data: IExamwiseRemarksSave): Promise<ApiResponse<{ returnval: boolean }>> {
    return await api.post('portal', `${BASE_URL}/savemapping`, data);
}

export async function viewSubjectWiseRemarks(data: {
    AMST_Id: number;
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number
}): Promise<ApiResponse<{ get_viewsubjectwiseremarks: ISubjectWiseRemark[] }>> {
    return await api.post('portal', `${BASE_URL}/ViewSubjectWiseRemarks`, data);
}

export async function editMappingDetails(data: any): Promise<ApiResponse<any>> {
    return await api.post('portal', `${BASE_URL}/editmappingdetails`, data);
}
