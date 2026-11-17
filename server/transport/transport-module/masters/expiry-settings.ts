'use server';

import { api } from '@/lib/apiService';
import type { IExpirySettings } from '@/types/transport/transport-module/masters';

export interface ExpirySettingsResponse {
    getdatadetails: IExpirySettings[];
    success: boolean;
    message: string;
}

export async function getExpirySettings() {
    const url = '/expiry_settings/expiry_settings_list';
    const response = await api.get<any>('transport', url);
    return response
}


export async function saveExpirySettings(data: any) {
    const url = '/expiry_settings/add_or_update_expiry_settings';
    return await api.post<any>('transport', url, data);
}