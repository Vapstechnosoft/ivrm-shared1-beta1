'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterDesignationList, IMasterDesignationSetOrderList } from '@/types/hrms/hrms-config/master';

export async function getMasterDesignation(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'hrmdeS_DesignationName');
    const url = `/api/MasterDesignation?${urlParams}`;
    return await api.get<IMasterDesignationList[]>('hrms', url);
}

export async function addOrUpdateMasterDesignation(data: any) {
    const url = '/api/MasterDesignation';
    return await api.post<any>('hrms', url, data);
}

export async function toggleMasterDesignation(id: number) {
    const url = `/api/MasterDesignation/toggle_master_designation/${id}`;
    return await api.put('hrms', url);
}

export async function getDesignationSetOrder() {
    const url = '/api/MasterDesignation/designation_active_order_list';
    return await api.get<IMasterDesignationSetOrderList[]>('hrms', url);
}

export async function updateDesignationSetorder(data: any) {
    const url = '/api/MasterDesignation/update_designation_order_number';
    return await api.put<any>('hrms', url, data);
}

export async function getMasterDesignationById(id: number) {
    const url = `/api/MasterDesignation/designation_by_id/${id}`;
    return await api.get<IMasterDesignationList>('hrms', url);
}
