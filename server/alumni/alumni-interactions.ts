'use server';

import { api } from '@/lib/apiService';
import type { IAlumniDetailsResponse, IAlumniInteractionLoadResponse } from '@/types/alumni/alumni-interactions';

export async function getAlumniInteractionLoadData() {
    return await api.post<IAlumniInteractionLoadResponse>('alumni', '/Alumni_Interactions/getdata', {});
}

export async function searchAlumniForInteraction(data: any) {
    return await api.post<IAlumniDetailsResponse>('alumni', '/Alumni_Interactions/getdetails', data);
}

export async function saveAlumniInteraction(data: any) {
    return await api.post<any>('alumni', '/Alumni_Interactions/save', data);
}

export async function replyAlumniInteraction(data: any) {
    return await api.post<any>('alumni', '/Alumni_Interactions/reply', data);
}

export async function deleteAlumniInteraction(id: number) {
    return await api.post<any>('alumni', '/Alumni_Interactions/delete', { ALSMINT_Id: id });
}
