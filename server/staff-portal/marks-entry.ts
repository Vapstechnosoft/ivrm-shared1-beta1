'use server';

import { api, ApiResponse } from '@/lib/apiService';
import type {
    IMarksEntryInitialData,
    IClass,
    ISection,
    IExam,
    ISubject,
    IMarksEntrySearchRequest,
    IMarksEntrySearchResponse,
    IMarksEntrySaveRequest
} from '@/types/staff-portal/marks-entry';

const BASE_URL = '/MarksEntryHHS';

export async function getInitialMarksEntryData(): Promise<ApiResponse<IMarksEntryInitialData>> {
    return await api.get<IMarksEntryInitialData>('portal', `${BASE_URL}/Getdetails`);
}

export async function getMarksEntryClasses(asmaY_Id: number): Promise<ApiResponse<{ classlist: IClass[] }>> {
    return await api.post('portal', `${BASE_URL}/get_classes`, { ASMAY_Id: asmaY_Id });
}

export async function getMarksEntrySections(asmaY_Id: number, asmcL_Id: number): Promise<ApiResponse<{ sectionlist: ISection[] }>> {
    return await api.post('portal', `${BASE_URL}/get_sections`, { ASMAY_Id: asmaY_Id, ASMCL_Id: asmcL_Id });
}

export async function getMarksEntryExams(asmaY_Id: number, asmcL_Id: number, asmS_Id: number): Promise<ApiResponse<{ examlist: IExam[] }>> {
    return await api.post('portal', `${BASE_URL}/get_exams`, { ASMAY_Id: asmaY_Id, ASMCL_Id: asmcL_Id, ASMS_Id: asmS_Id });
}

export async function getMarksEntrySubjects(asmaY_Id: number, asmcL_Id: number, asmS_Id: number, emE_Id: number): Promise<ApiResponse<{ subjectlist: ISubject[] }>> {
    return await api.post('portal', `${BASE_URL}/get_subjects`, { ASMAY_Id: asmaY_Id, ASMCL_Id: asmcL_Id, ASMS_Id: asmS_Id, EME_Id: emE_Id });
}

export async function searchMarksEntry(data: IMarksEntrySearchRequest): Promise<ApiResponse<IMarksEntrySearchResponse>> {
    return await api.post('portal', `${BASE_URL}/onsearch`, data);
}

export async function saveMarksEntry(data: IMarksEntrySaveRequest): Promise<ApiResponse<{ returnval: boolean }>> {
    return await api.post('portal', `${BASE_URL}/SaveMarks`, data);
}
