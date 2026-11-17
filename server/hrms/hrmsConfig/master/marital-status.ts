'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterMaritalStatusList } from '@/types/hrms/hrms-config/master';

export async function getMasterMaritalStatus(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'ivrmmmS_MaritalStatus');
    const url = `/api/MasterMaritalStatus?${urlParams}`;
    try {
        const response = await api.get<IMasterMaritalStatusList[]>('hrms', url);
        return response;
    } catch (error: any) {
        console.error('🔴 [MasterMaritalStatus] Error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to load marital status details',
            data: [],
            total: 0,
            page: searchParams?.page || 1,
            page_size: searchParams?.page_size || 10
        };
    }
}

export async function addOrUpdateMasterMaritalStatus(data: any) {
    const url = '/api/MasterMaritalStatus';
    return await api.post<any>('hrms', url, data);
}

export async function toggleMasterMaritalStatus(id: number) {
    const url = `/api/MasterMaritalStatus/toggle_marital_status/${id}`;
    return await api.put('hrms', url);
}

export async function getMasterMaritalStatusById(id: number) {
    const url = `/api/MasterMaritalStatus/marital_status_by_id?ivrmmms_id=${id}`;
    return await api.get<any>('hrms', url);
}
