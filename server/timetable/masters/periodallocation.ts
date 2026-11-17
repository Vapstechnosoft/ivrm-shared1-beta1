'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IPeriodAllocationMasterDay } from '@/types/timetable/masters/masters';

export async function getAllPeriodDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'ttmP_PeriodName');
    const url = `/PeriodAllocationFacade/GetMasterDayClassWiseGridData?${urlParams}`;
    return await api.get<IPeriodAllocationMasterDay[]>('timetable', url);
}

export async function savePeriod(data: any) {
    const url = '/PeriodAllocationFacade/PeriodAllocationMasterPeriodSave';
    return await api.post<any>('timetable', url, data);
}

export async function savePeriodClass(data: any) {
    const url = '/PeriodAllocation/savedetail/';
    return await api.post<any>('timetable', url, data);
}

export async function deactivatePeriod(TTMP_Id: number) {
    const url = `/PeriodAllocationFacade/MasterPeriodActivateDeactive/${TTMP_Id}`;
    return await api.put<any>('timetable', url);
}

export async function deactivatePeriodClass(TTMPC_Id: number) {
    const url = `/PeriodAllocationFacade/MasterPeriodClassWiseActivateDeactive/${TTMPC_Id}`;
    return await api.put<any>('timetable', url);
}

export async function getPeriodClass(data: any) {
    const url = '/PeriodAllocation/getperiod_class';
    return await api.post<any>('timetable', url, data);
}

export async function getClassByCategory(data: any) {
    const url = '/PeriodAllocation/getclass_catg';
    return await api.post<any>('timetable', url, data);
}

export async function getCategory(data: any) {
    const url = '/PeriodAllocation/get_catg';
    return await api.post<any>('timetable', url, data);
}
