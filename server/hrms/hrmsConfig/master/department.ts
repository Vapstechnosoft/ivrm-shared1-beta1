'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterDepartmentList, IMasterDepartmentSetOrderList } from '@/types/hrms/hrms-config/master';

export async function getMasterDepartment(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'hrmD_DepartmentName');
    const url = `/api/MasterDepartment?${urlParams}`;
    try {
        const response = await api.get<IMasterDepartmentList[]>('hrms', url);
        return response;
    } catch (error: any) {
        console.error('🔴 [MasterDepartment] Error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to load department details',
            data: [],
            total: 0,
            page: searchParams?.page || 1,
            page_size: searchParams?.page_size || 10
        };
    }
}

export async function addOrUpdateMasterDepartment(data: any) {
    const url = '/api/MasterDepartment';
    return await api.post<any>('hrms', url, data);
}

export async function toggleMasterDepartment(id: number) {
    const url = `/api/MasterDepartment/toggle_department/${id}`;
    return await api.put('hrms', url);
}

export async function getMasterDepartmentById(id: number) {
    const url = `/api/MasterDepartment/master_department_by_id?hrmd_id=${id}`;
    return await api.get<any>('hrms', url);
}

export async function getDepartmentSetOrder() {
    const url = '/api/MasterDepartment/department_order_active_list';
    return await api.get<IMasterDepartmentSetOrderList[]>('hrms', url);
}

export async function updateDepartmentSetorder(data: any) {
    const url = '/api/MasterDepartment/update_department_order_number';
    return await api.put<any>('hrms', url, data);
}
