'use server';
import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ICoScholasticActivityAreaMapping } from '@/types/exam/exam-module/exam-mapping';

export async function getCoScholasticActivityAreaMapping(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `coscholastic_activity/co_scholastic_activity_area_list/?${urlParams}`;
    const response = await api.get<ICoScholasticActivityAreaMapping>('exam', url);
    return { ...response };
}
export async function addOrUpdateCoScholasticActivityAreaMapping(data: any) {
    const url = '/coscholastic_activity/co_scholastic_activity_area_mapping';
    return await api.post<any>('exam', url, data);
}
