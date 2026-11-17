'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterSectionList, IMasterSectionSetOrderList } from '@/types/admission/preadmission/masters';

export async function getMasterSection(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asmC_SectionCode,asmC_SectionName,asmC_Order,asmC_MaxCapacity');
    const url = `/master_section?${urlParams}`;
    return await api.get<IMasterSectionList[]>('admission', url);
}

export async function addOrUpdateMasterSection(data: any) {
    const url = '/master_section';
    return await api.post<any>('admission', url, data);
}

export async function toggleMasterSection(id: number) {
    const url = `/master_section/toggle/${id}`;
    return await api.put('admission', url);
}
export async function getSectionSetOrder() {
    const url = '/master_section/set_order_list';
    return await api.get<IMasterSectionSetOrderList[]>('admission', url);
}
export async function updateSectionSetorder(data: any) {
    const url = '/master_section/set_order';
    return await api.put<any>('admission', url, data);
}
