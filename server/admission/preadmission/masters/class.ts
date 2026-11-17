'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterClassList, IMasterClassSetOrderList } from '@/types/admission/preadmission/masters';

export async function getMasterClass(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asmcL_ClassCode,asmcL_ClassName');
    const url = `/master_class?${urlParams}`;
    return await api.get<IMasterClassList[]>('admission', url);
}

export async function addOrUpdateMasterClass(data: any) {
    const url = '/master_class';
    return await api.post<any>('admission', url, data);
}

export async function toggleMasterClass(id: number) {
    const url = `/master_class/toggle/${id}`;
    return await api.put('admission', url);
}
export async function getClassSetOrder() {
    const url = '/master_class/set_order_list';
    return await api.get<IMasterClassSetOrderList[]>('admission', url);
}
export async function updateClassSetorder(data: any) {
    const url = '/master_class/set_order';
    return await api.put<any>('admission', url, data);
}
