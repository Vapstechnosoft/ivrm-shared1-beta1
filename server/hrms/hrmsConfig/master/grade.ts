'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterGradeList, IMasterGradeSetOrderList } from '@/types/hrms/hrms-config/master';

export async function getMasterGrade(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'hrmG_GradeName,hrmG_GradeDisplayName');
    const url = `/api/MasterGrade?${urlParams}`;
    try {
        const response = await api.get<IMasterGradeList[]>('hrms', url);
        return response;
    } catch (error: any) {
        console.error('🔴 [MasterGrade] Error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to load grade details',
            data: [],
            total: 0,
            page: searchParams?.page || 1,
            page_size: searchParams?.page_size || 10
        };
    }
}

export async function addOrUpdateMasterGrade(data: any) {
    const url = '/api/MasterGrade';
    try {
        return await api.post<any>('hrms', url, data);
    } catch (error: any) {
        console.error('🔴 [MasterGrade] Error adding/updating grade:', error);
        return {
            success: false,
            message: error?.message || 'Failed to save grade'
        };
    }
}

export async function toggleMasterGrade(id: number) {
    const url = `/api/MasterGrade/toggle_master_grade/${id}`;
    return await api.put('hrms', url);
}

export async function getMasterGradeById(id: number) {
    const url = `/api/MasterGrade/master_grade_by_id/${id}`;
    return await api.get<any>('hrms', url);
}

export async function getGradeSetOrder() {
    const url = `/api/MasterGrade/master_grade_order_active_list`;
    return await api.get<IMasterGradeSetOrderList[]>('hrms', url);
}

export async function updateGradeSetorder(data: Array<{ id: number; order: number }>) {
    const url = '/api/MasterGrade/update_master_grade_order_number';
    return await api.put<any>('hrms', url, data);
}
