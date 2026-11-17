'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import type {
    IClassWorkInitialData,
    IClass,
    ISection,
    ISubject,
    IClassWorkSave,
    IClassWork,
    IClassWorkAttachment
} from '@/types/staff-portal/classwork';

const BASE_URL = '/IVRM_ClassWork';

export async function getInitialData(id: number = 1): Promise<ApiResponse<IClassWorkInitialData>> {
    return await api.get<IClassWorkInitialData>('portal', `${BASE_URL}/Getdetails/${id}`);
}

export async function getClasses(data: { HRME_Id: number; ASMAY_Id: number }): Promise<ApiResponse<{ classlist: IClass[]; class_gridlist: IClassWork[] }>> {
    return await api.post('portal', `${BASE_URL}/get_classes`, data);
}

export async function getSections(data: { HRME_Id: number; ASMCL_Id: number; ASMAY_Id: number }): Promise<ApiResponse<{ sectionlist: ISection[] }>> {
    return await api.post('portal', `${BASE_URL}/getsectiondata`, data);
}

export async function getSubjects(data: { HRME_Id: number; ASMCL_Id: number; ASMAY_Id: number; hm_section_list: { ASMS_Id: number }[] }): Promise<ApiResponse<{ subjectlist: ISubject[] }>> {
    return await api.post('portal', `${BASE_URL}/getsubject`, data);
}

export async function saveClassWork(data: IClassWorkSave): Promise<ApiResponse<{ returnval: boolean; dulicate: boolean }>> {
    return await api.post('portal', `${BASE_URL}/savedetail`, data);
}

export async function editClassWork(data: { ICW_Id: number; ASMAY_Id: number }): Promise<ApiResponse<{ editlist: any[]; editlist_section: any[]; attachementlist: any[] }>> {
    return await api.post('portal', `${BASE_URL}/editData`, data);
}

export async function deactivateClassWork(data: { ICW_Id: number; icW_ActiveFlag: boolean }): Promise<ApiResponse<{ returnval: boolean }>> {
    return await api.post('portal', `${BASE_URL}/deactivate`, data);
}

export async function viewClassWork(data: { ICW_Id: number; ASMAY_Id: number }): Promise<ApiResponse<{ attachementlist: IClassWorkAttachment[] }>> {
    return await api.post('portal', `${BASE_URL}/viewData`, data);
}
