'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterEmployeeTypeList } from '@/types/hrms/hrms-config/master';

export async function getMasterEmployeeType(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'hrmeT_EmployeeType');
    const url = `/api/MasterEmployeeType?${urlParams}`;
    return await api.get<IMasterEmployeeTypeList[]>('hrms', url);
}

export async function addOrUpdateMasterEmployeeType(data: any) {
    const url = '/api/MasterEmployeeType';
    return await api.post<any>('hrms', url, data);
}

export async function toggleMasterEmployeeType(id: number) {
    const url = `/api/MasterEmployeeType/ToggleEmployeeType/${id}`;
    return await api.put('hrms', url);
}

export async function getMasterEmployeeTypeById(id: number) {
    const url = `/api/MasterEmployeeType/employee_type_by_id/${id}`;
    return await api.get<IMasterEmployeeTypeList>('hrms', url);
}
