'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSpecializationList } from '@/types/hrms/hrms-config/master';

export async function getMasterSpecialization(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'hrmspL_SpecialisationName');
    const url = `/api/MasterSpecialisation?${urlParams}`;
    try {
        const response = await api.get<IMasterSpecializationList[]>('hrms', url);
        return response;
    } catch (error: any) {
        console.error('🔴 [MasterSpecialization] Error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to load specialization details',
            data: [],
            total: 0,
            page: searchParams?.page || 1,
            page_size: searchParams?.page_size || 10
        };
    }
}

export async function addOrUpdateMasterSpecialization(data: any) {
    const url = '/api/MasterSpecialisation';
    return await api.post<any>('hrms', url, data);
}

export async function getMasterSpecializationById(id: number) {
    const url = `/api/MasterSpecialisation/get_specialisation_by_id/${id}`;
    return await api.get<IMasterSpecializationList>('hrms', url);
}

export async function toggleMasterSpecialization(id: number) {
    const url = `/api/MasterSpecialisation/toggle_master_specialisation/${id}`;
    return await api.put('hrms', url);
}
