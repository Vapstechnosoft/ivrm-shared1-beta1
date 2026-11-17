'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterGroupTypeList, IMasterGroupTypeSetOrderList } from '@/types/hrms/hrms-config/master';

export async function getMasterGroupType(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'hrmgT_EmployeeGroupType,hrmgT_Code');
    const url = `/api/MasterGroupType?${urlParams}`;
    return await api.get<IMasterGroupTypeList[]>('hrms', url);
}

export async function addOrUpdateMasterGroupType(data: any) {
    const url = '/api/MasterGroupType';
    return await api.post<any>('hrms', url, data);
}

export async function toggleMasterGroupType(id: number) {
    const url = `/api/MasterGroupType/toggle_group_type/${id}`;
    return await api.put('hrms', url);
}

export async function getGroupTypeSetOrder() {
    const url = '/api/MasterGroupType/group_type_active_order_list';
    return await api.get<IMasterGroupTypeSetOrderList[]>('hrms', url);
}

export async function updateGroupTypeSetorder(data: Array<{ id: number; order: number }>) {
    const url = '/api/MasterGroupType/update_group_type_order_number';
    return await api.put<any>('hrms', url, data);
}

export async function getMasterGroupTypeById(id: number) {
    const url = `/api/MasterGroupType/group_type_by_id/${id}`;
    return await api.get<IMasterGroupTypeList>('hrms', url);
}
