'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ICoScholasticActivity } from '@/types/exam/exam-module/masters';

export async function getCoScholasticActivities(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/coscholastic_activity?${urlParams}`;
    return await api.get<ICoScholasticActivity>('exam', url);
}
export async function getCoScholasticActivityDropdownList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = 'coscholastic_activity/co_scholastic_activity_dropdown_list';
    return await api.get<ICoScholasticActivity>('exam', url);
}
export async function addOrUpdatecoScholasticActivity(data: any) {
    console.log('data in server file', data);
    const url = '/coscholastic_activity/addorupdate_coscholastic_activity';
    return await api.post<any>('exam', url, data);
}
export async function toggleCoScholasticActivity(id: number) {
    const url = `/coscholastic_activity/active_deactive_activity/${id}`;
    return await api.put('exam', url);
}
