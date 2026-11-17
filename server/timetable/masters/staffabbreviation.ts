'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IStaffAbbreviationList, IStaffDropdownList } from '@/types/timetable/masters/masters';

export async function getStaffAbbreviationDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'staffName,ttmsaB_PerDayMaxDeputation,ttmsaB_PerDayMinDeputation,ttmsaB_PerMonthMaxDeputation,ttmsaB_PerMonthMinDeputation,ttmsaB_Abbreviation,firstName,middleName,lastName'
    );
    const url = `/StaffMaster/staffAbbreviationGridData?${urlParams}`;
    console.info('MasterDayFacade', url);
    return await api.get<IStaffAbbreviationList[]>('timetable', url);
}

export async function addOrUpdateStaffAbbreviation(data: any) {
    const url = '/StaffMaster/staff-save-details';
    return await api.post<any>('timetable', url, data);
}

export async function ToggleStaffAbbreviation(ttmsaB_Id: number) {
    const url = `/StaffMaster/StaffAbbreviationActivateDeactivate/${ttmsaB_Id}`;
    return await api.put<any>('timetable', url);
}

export async function getStaffDropDown() {
    const url = '/TimeTableCommon/GetStaffDetails';
    return await api.get<IStaffDropdownList[]>('timetable', url);
}
