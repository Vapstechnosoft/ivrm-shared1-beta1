'use server';

import { api, type ApiResponse } from '@/lib/apiService';
import type {
    IPromotionRemarksInitialData,
    IClass,
    ISection,
    IStudentPromotion,
    IStudentMarks,
    ISavedDetail,
    IPromotionRemarksSave
} from '@/types/staff-portal/promotion-remarks';

const BASE_URL = '/ExamPromotionRemarks';

export async function getInitialData(id: number = 1): Promise<ApiResponse<any>> { // Returns object with getyear, etc.
    return await api.get('portal', `${BASE_URL}/Getdetails/${id}`);
}

export async function getClasses(data: { ASMAY_Id: number }): Promise<ApiResponse<{ getclass: IClass[] }>> {
    return await api.post('portal', `${BASE_URL}/get_class`, data);
}

export async function getSections(data: { ASMAY_Id: number; ASMCL_Id: number }): Promise<ApiResponse<{ getsection: ISection[] }>> {
    return await api.post('portal', `${BASE_URL}/get_section`, data);
}

// Legacy uses 'search_student' which returns student list, marks, and saved details all at once
export async function searchStudent(data: {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number;
    examtype: number;
}): Promise<ApiResponse<{
    getstudentdetails: IStudentPromotion[];
    getstudentmarks: IStudentMarks[];
    getsavedetails: ISavedDetail[];
}>> {
    return await api.post('portal', `${BASE_URL}/search_student`, data);
}

export async function saveDetails(data: IPromotionRemarksSave): Promise<ApiResponse<{ returnval: boolean; message: string }>> {
    return await api.post('portal', `${BASE_URL}/save_details`, data);
}
