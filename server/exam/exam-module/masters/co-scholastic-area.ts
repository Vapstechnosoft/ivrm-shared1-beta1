'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ICoScholasticArea } from '@/types/exam/exam-module/masters';

export async function getCoScholasticArea(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/coscholastic_activity/co_scholastic_area_list?${urlParams}`;
    return await api.get<ICoScholasticArea>('exam', url);
}
export async function addOrUpdatecoScholasticArea(data: any) {
    console.log('data in server file', data);
    const url = '/coscholastic_activity/addOrupdate_co_scholastic_area';
    return await api.post<any>('exam', url, data);
}
export async function toggleCoScholasticArea(id: number) {
    const url = `/coscholastic_activity/active_deactive_area/${id}`;
    return await api.put('exam', url);
}
export async function getCoScholasticAreaOrderData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = '/coscholastic_activity/co_scholastic_area_order_wise_list';
    return await api.get<any>('exam', url);
}
export async function UpdatedOrderdCoScholasticArea(data: any) {
    const url = '/coscholastic_activity/set_activity_area_order_number';
    return await api.put<any>('exam', url, data);
}

export async function getCoScholasticActivity(data: any) {
    const url = '/coscholastic_activity/co_scholastic_activity_drop_down_list';
    return await api.get<any>('exam', url, data);
}
export async function getCoScholasticActivityArea(data: any) {
    const url = '/coscholastic_activity/co_scholastic_area_drop_down_list';
    return await api.get<any>('exam', url, data);
}

export async function toggleCoScholasticActivityArea(id: number) {
    const url = `/coscholastic_activity/active_deactive_area_activity/${id}`;
    return await api.put('exam', url);
}
