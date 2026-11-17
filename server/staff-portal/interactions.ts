
'use server';

import { api, ApiResponse } from '@/lib/apiService';
import type {
    IInteractionsInitialData,
    ISaveInteractionRequest,
    ISaveReplyRequest,
    IFeedbackQuestion
} from '@/types/staff-portal/interactions';

const BASE_URL = '/IVRM_Interactions';

export async function getInitialInteractions(): Promise<ApiResponse<IInteractionsInitialData>> {
    return await api.get<IInteractionsInitialData>('portal', `${BASE_URL}/getloaddata/2`);
}

export async function getRecipientsByRole(roleflg: string, userflag: string): Promise<ApiResponse<{ getdetails: any[], configflag: any[] }>> {
    return await api.post('portal', `${BASE_URL}/getdetails`, { roleflg, userflag });
}

export async function getSectionsForInteraction(asmcL_Id: number, asmaY_Id: number, roleflg: string): Promise<ApiResponse<{ sectionList: any[] }>> {
    return await api.post('portal', `/EmployeeStudentAttendenceDetails/Getsection`, { asmcL_Id, ASMAY_Id: asmaY_Id, roleflg });
}

export async function getStudentsForInteraction(asmcL_Id: number, asmS_Id: number): Promise<ApiResponse<{ get_student: any[] }>> {
    return await api.post('portal', `${BASE_URL}/getstudent`, { ASMCL_Id: asmcL_Id, ASMS_Id: asmS_Id });
}

export async function saveInteraction(data: ISaveInteractionRequest): Promise<ApiResponse<{ returnval: boolean }>> {
    return await api.post('portal', `${BASE_URL}/savedata`, data);
}

export async function saveInteractionReply(data: ISaveReplyRequest): Promise<ApiResponse<{ returnval: boolean }>> {
    return await api.post('portal', `${BASE_URL}/savereply`, data);
}

export async function deleteInteraction(data: { ISMINT_Id: number, ISTINT_Id: number }): Promise<ApiResponse<{ returnval: boolean }>> {
    return await api.post('portal', `${BASE_URL}/deletemsg`, data);
}

export async function getFeedbackQuestions(): Promise<ApiResponse<{ feedbackquestion: IFeedbackQuestion[], feedbackoption: any[] }>> {
    return await api.post('portal', `/FeedbackTransaction/loadfeedbackquestion`, { Flag: 'Interaction' });
}

export async function saveFeedbackResponse(data: { savemodulefeedback: any[] }): Promise<ApiResponse<{ returnval: boolean }>> {
    return await api.post('portal', `/FeedbackTransaction/Savefeedback`, data);
}
