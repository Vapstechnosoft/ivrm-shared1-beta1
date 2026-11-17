'use server';

import { api } from '@/lib/apiService';

export async function getBirthdayInitialData() {
    const url = 'BirthDay/1';
    return await api.get<any>('alumni', url);
}

export async function getParticipantList(data: { rdbbutton: string }) {
    return await api.post<any>('alumni', 'BirthDay/BindStaff/', data);
}

export async function sendBirthdayMessages(data: any) {
    return await api.post<any>('alumni', 'BirthDay/Sendmsg', data);
}

export async function getFeedbackQuestions(data: { Flag: string }) {
    return await api.post<any>('alumni', 'FeedbackTransaction/loadfeedbackquestion', data);
}

export async function saveFeedback(data: { savemodulefeedback: any[] }) {
    return await api.post<any>('alumni', 'FeedbackTransaction/Savefeedback', data);
}
