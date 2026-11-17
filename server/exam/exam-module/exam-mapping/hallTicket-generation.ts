'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IHallTicketGeneratedItem, IHallTicketStudentItem } from '@/types/exam/exam-module/exam-mapping';

// 1) Get Hall Ticket Generated List
export async function getHallTicketGeneratedList(searchParams?: ApiSearchparams) {
    const url = `hall_ticket_generation/hall_ticket_generation_list/?${getSearchParamsUrl(searchParams ?? {})}`;
    const response = await api.get<IHallTicketGeneratedItem>('exam', url);
    return { ...response };
}

export async function getHallTicketStudentList(params: {
    // MI_Id: number;
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    EME_Id: number;
}) {
    const query = new URLSearchParams({
        // MI_Id: String(params.MI_Id),
        ASMAY_Id: String(params.ASMAY_Id),
        ASMCL_Id: String(params.ASMCL_Id),
        ASMS_Id: String(params.ASMS_Id),
        EME_Id: String(params.EME_Id)
    });

    const url = `hall_ticket_generation/view_student_hall_ticket_list?${query.toString()}`;
    return await api.get<IHallTicketStudentItem>('exam', url);
}

// 3) (OPTIONAL) Publish Hall Tickets (If Later Needed)
export async function updateHallTicketPublishStatus(data: any) {
    const url = `/hall_ticket_generation/publish_student_hall_ticket`;
    return await api.post('exam', url, data);
}

export async function GenerateHalltickets(data: any) {
    const url = `/hall_ticket_generation/generate_hall_ticket`;
    return await api.post('exam', url, data);
}
