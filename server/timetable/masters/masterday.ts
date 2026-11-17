'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterDayList, IMasterDaySetOrderList } from '@/types/timetable/masters/masters';

export async function getMasterDayDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'ttmD_DayName,ttmD_DayCode');
    const url = `/MasterDayFacade/MasterDayDetails?${urlParams}`;
    console.info('MasterDayFacade', url);
    return await api.get<IMasterDayList[]>('timetable', url);
}

export async function addOrUpdateMasterDay(data: any) {
    const url = '/MasterDayFacade/MasterdayAddOrUpdate';
    return await api.post<any>('timetable', url, data);
}

export async function ToggleMasterDay(ttmd_id: number) {
    const url = `/MasterDayFacade/MasterDaydayActivateDeactivate/${ttmd_id}`;
    return await api.put<any>('timetable', url);
}

export async function getMasterDaySetOrderDetails() {
    const url = '/MasterDayFacade/MasterDaygetorder';
    return await api.get<IMasterDaySetOrderList[]>('timetable', url);
}

export async function saveSetOrderMasterDay(data: any) {
    const url = 'MasterDayFacade/saveorder';
    return await api.post<any>('timetable', url, data);
}
