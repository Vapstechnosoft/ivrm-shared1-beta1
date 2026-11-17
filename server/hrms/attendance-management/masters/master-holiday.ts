'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterHolidayList } from '@/types/hrms/attendance-management/masters';

/**
 * Get Master Holiday list with search, sort, and pagination
 * GET /api/MasterHolidayFacade/getdata
 */
export async function getMasterHoliday(searchParams?: ApiSearchparams) {
    const searchableColumns = 'fomhwdD_Name,fohtwD_HolidayWDType,hrmD_DepartmentName';
    const urlParams = getSearchParamsUrl(searchParams ?? {}, searchableColumns);
    const url = `/api/MasterHolidayFacade/getdata?${urlParams}`;
    return await api.get<IMasterHolidayList[]>('hrmsfrontoffice', url);
}

/**
 * Save or Update Master Holiday record
 * POST /api/MasterHolidayFacade/savedetail
 */
export async function addOrUpdateMasterHoliday(data: any) {
    const url = '/api/MasterHolidayFacade/savedetail';
    return await api.post<any>('hrmsfrontoffice', url, data);
}

/**
 * Delete Master Holiday record
 * DELETE /api/MasterHolidayFacade/delete/{id}
 */
export async function deleteMasterHoliday(id: number) {
    const url = `/api/MasterHolidayFacade/delete/${id}`;
    return await api.delete<IMasterHolidayList>('hrmsfrontoffice', url);
}

// GET dates for selected days
export async function getHolidayDatesForDays(data: { calendarYear: string; holidayType: string; selectedDays: string[] }) {
    const url = '/api/MasterHolidayFacade/getDatesForSelectedDays';
    return await api.post<any>('hrmsfrontoffice', url, data);
}
