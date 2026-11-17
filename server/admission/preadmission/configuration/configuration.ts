'use server';

import { api } from '@/lib/apiService';

export async function checkPreadmissionLive(subdomain: string) {
    const url = `/configuration/check_preadmission_live/${subdomain}`;
    return await api.get<boolean>('preadmission', url);
}

export async function addPreadmissionRegistration(data: any) {
    const url = '/configuration/preadmission_user_registration';
    return await api.post<boolean>('preadmission', url, data);
}
