'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IPeriodTimeSettingData } from '@/types/timetable/masters/masters';

export async function getAllPeriodTimeSettings(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'ttmC_CategoryName');
    const url = `/PeriodTimeSettingFacade/GetPeriodTimeSettingData?${urlParams}`;
    return await api.get<IPeriodTimeSettingData[]>('timetable', url);
}

export async function savePeriodTimeSetting(data: any) {
    const url = '/PeriodTimeSetting/savedetail/';
    return await api.post<any>('timetable', url, data);
}

export async function deactivatePeriodTimeSetting(data: { ttmdpT_Id: number; ttmdpT_ActiveFlag: boolean }) {
    const url = '/PeriodTimeSetting/deactive';
    return await api.post<any>('timetable', url, data);
}

export async function getPeriodTimeSettingDetails(id: number) {
    const data = { TTMDPT_Id: id };
    const url = '/PeriodTimeSetting/getpagedetails';
    return (await api.post<any>('timetable', url, data)) as any;
}
