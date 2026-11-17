'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import type {
    IClassWorkMarksInitialData,
    ITopic,
    IStudentMarks,
    IClassWorkMarksSave,
    IStudentUploadDetail
} from '@/types/staff-portal/classwork-marks';

// Re-export common dropdown actions from classwork for convenience
// Removed re-exports to avoid 'use server' async export error. Import directly from classwork.ts

const BASE_URL = '/IVRM_ClassWork';

export async function getInitialData(id: number = 1): Promise<ApiResponse<IClassWorkMarksInitialData>> {
    return await api.get<IClassWorkMarksInitialData>('portal', `${BASE_URL}/Getdetails/${id}`);
}

export async function getTopicList(data: {
    ASMCL_Id: number;
    ASMS_Id: number;
    ASMAY_Id: number;
    ISMS_Id: number;
    fromdate: string;
    todate: string;
}): Promise<ApiResponse<{ topicList: ITopic[] }>> {
    return await api.post('portal', `${BASE_URL}/getclasswork_list`, data);
}

export async function getStudentList(data: {
    ASMCL_Id: number;
    ASMS_Id: number;
    ASMAY_Id: number;
    ISMS_Id: number;
    ICW_Id: number;
    fromdate: string;
    todate: string;
}): Promise<ApiResponse<{ getclasswork_list: IStudentMarks[] }>> {
    return await api.post('portal', `${BASE_URL}/getclasswork_Topiclist`, data);
}

export async function saveMarks(data: IClassWorkMarksSave): Promise<ApiResponse<{ returnval: boolean }>> {
    return await api.post('portal', `${BASE_URL}/classwork_marks_update`, data);
}

export async function viewStudentUpload(data: { AMST_Id: number; ICW_Id: number; ICWUPL_Id: number }): Promise<ApiResponse<{ viewstudentupload: IStudentUploadDetail[] }>> {
    return await api.post('portal', `${BASE_URL}/viewstudentupload`, data);
}
