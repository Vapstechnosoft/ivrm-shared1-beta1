'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterClassCategoryList } from '@/types/admission/preadmission/masters';

export interface MasterDropdown {
    key: string;
    value: string;
    [key: string]: any;
}

export async function getMasterClassCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asmaY_Year,amC_Name,asmcL_ClassName');
    const url = `/master_class_category?${urlParams}`;
    return await api.get<IMasterClassCategoryList[]>('admission', url);
}

export async function getMasterGroupTypes() {
    const url = '/api/MasterDropDown/GroupType';
    return await api.get<MasterDropdown[]>('hrms', url);
}
export async function getMasterDepartments() {
    const url = '/api/MasterDropDown/GetDepartments';
    return await api.get<MasterDropdown[]>('hrms', url);
}

export async function getMasterDesignations() {
    const url = '/api/MasterDropDown/GetDesignation';
    return await api.get<MasterDropdown[]>('hrms', url);
}

export async function getMasterMonths() {
    const url = '/api/MasterDropDown/GetMonths';
    return await api.get<MasterDropdown[]>('hrms', url);
}

export async function getMasterYears() {
    const url = '/api/MasterDropDown/GetYear';
    return await api.get<MasterDropdown[]>('hrms', url);
}

export async function getMasterPaymentModeList() {
    const url = '/api/MasterDropDown/GetPaymentModeList';
    return await api.get<MasterDropdown[]>('hrms', url);
}

export async function addMasterClassCategory(data: any) {
    const url = '/master_class_category';
    return await api.post<any>('admission', url, data);
}

export async function toggleMasterClassCategory(id: number) {
    const url = `/master_class_category/toggle/${id}`;
    return await api.put('admission', url);
}
export async function getMasterEmployeeTypes() {
    const url = '/api/MasterDropDown/GetEmployeeType';
    return await api.get<MasterDropdown[]>('hrms', url);
}
