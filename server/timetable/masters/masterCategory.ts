'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ITimeTableMasterCategory } from '@/types/timetable/masters/masters';

export async function getMasterCategoryDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'ttmC_CategoryName');
    const url = `/TTMasterCategoryFacade/GetMasterCategoryGridList?${urlParams}`;
    return await api.get<ITimeTableMasterCategory[]>('timetable', url);
}

export async function addOrUpdateTimetableMasterCategory(data: any) {
    const url = '/TTMasterCategoryFacade/AddorUpdateMasterCategory';
    return await api.post<any>('timetable', url, data);
}

export async function ToggleMasterCategory(ttmd_id: number) {
    const url = `/TTMasterCategoryFacade/MasterCategoryActivateDeactivate/${ttmd_id}`;
    return await api.put<any>('timetable', url);
}
