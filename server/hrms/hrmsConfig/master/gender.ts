'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterGenderList } from '@/types/hrms/hrms-config/master';

export async function getMasterGender(searchParams?: ApiSearchparams) {
    console.log('🔵 [MasterGender] getMasterGender called with:', searchParams);
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'ivrmmG_GenderName');
    const url = `/api/MasterGender?${urlParams}`;
    console.log('🔵 [MasterGender] Fetching URL:', url);
    try {
        const response = await api.get<IMasterGenderList[]>('hrms', url);
        console.log('✅ [MasterGender] Success:', response ? 'Response received' : 'No response');
        return response;
    } catch (error: any) {
        console.error('🔴 [MasterGender] Error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to load gender details',
            data: [],
            total: 0,
            page: searchParams?.page || 1,
            page_size: searchParams?.page_size || 10
        };
    }
}

export async function addOrUpdateMasterGender(data: any) {
    const url = '/api/MasterGender';
    return await api.post<any>('hrms', url, data);
}

export async function getMasterGenderById(id: number) {
    const url = `/api/MasterGender/master_gender_by_id/${id}`;
    return await api.get<IMasterGenderList>('hrms', url);
}

export async function toggleMasterGender(id: number) {
    const url = `/api/MasterGender/toggle_master_gender/${id}`;
    return await api.put('hrms', url);
}
