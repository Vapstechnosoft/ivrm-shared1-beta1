'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { ISubjectAbbreviationList, ISubjectDropdownList } from '@/types/timetable/masters/masters';

export async function getSubjectAbbreviationDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'subjectName,ttmsuaB_Abbreviation');
    const url = `/TT_Master_Subject_AbbreviationFacade/subjectAbbreviationGridData?${urlParams}`;
    console.info('MasterDayFacade', url);
    return await api.get<ISubjectAbbreviationList[]>('timetable', url);
}

export async function addOrUpdateSubjectAbbreviation(data: any) {
    const url = '/TT_Master_Subject_AbbreviationFacade/AddOrUpdateSubjectAbbreviation';
    return await api.post<any>('timetable', url, data);
}

export async function ToggleSubjectAbbreviation(ttmsaB_Id: number) {
    const url = `/TT_Master_Subject_AbbreviationFacade/SubjectAbbriationActivateDeactivate/${ttmsaB_Id}`;
    return await api.put<any>('timetable', url);
}

export async function getsubjectDropDown() {
    // const url = '/TT_Master_Subject_AbbreviationFacade/getsubjectdropdown';
    // return await api.get<any>('timetable', url);
    const url = '/TimeTableCommon/subject-details';
    return await api.get<ISubjectDropdownList[]>('timetable', url);
}
