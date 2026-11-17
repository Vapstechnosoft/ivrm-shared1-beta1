'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ICategoryDropDownDataMasterPeriod, IMasterPeriodDetailsList } from '@/types/timetable/masters/masters';

export async function getMasterPeriodDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'categoryName,imP_PeriodName,imP_PeriodOrder,half,imP_Id,impcM_Id');
    const url = `/TimeTableCommon/GetMasterPeriodGridData?${urlParams}`;
    console.info('GetMasterPeriodGridData', url);
    return await api.get<IMasterPeriodDetailsList[]>('timetable', url);
}

export async function addOrUpdateMasterDay(data: any) {
    const url = '/MasterDayFacade/MasterdayAddOrUpdate';
    return await api.post<any>('timetable', url, data);
}

export async function ToggleMasterDay(ttmd_id: number) {
    const url = `/MasterDayFacade/MasterDaydayActivateDeactivate/${ttmd_id}`;
    return await api.put<any>('timetable', url);
}
export async function ADDORUPDATEMasterPeriod(data: any) {
    const url = '/TimeTableCommon/AddOrUpdateMasterPeriod';
    return await api.post<any>('timetable', url, data);
}

export async function CategorydropDownData() {
    const url = '/TimeTableCommon/GetMasterPeriodCatrgoryData';
    return await api.get<ICategoryDropDownDataMasterPeriod[]>('timetable', url);
}
