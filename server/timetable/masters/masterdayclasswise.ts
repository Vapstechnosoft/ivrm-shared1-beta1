'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    AcademicYearDropDownTT,
    CategoryDropDownTT,
    ClassDropDownDataTT,
    DaysDropDownDataTT,
    IMasterDayClassWise
} from '@/types/timetable/masters/masters';

export async function getMasterDayClassWiseDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'academicyr,classname');
    const url = `/MasterDayFacade/MasterDayClasswiseDetails?${urlParams}`;
    return await api.get<IMasterDayClassWise[]>('timetable', url);
}

export async function addOrUpdateMasterDay(data: any) {
    const url = '/MasterDayFacade/MasterdayAddOrUpdate';
    return await api.post<any>('timetable', url, data);
}

export async function ToggleMasterDayClasswise(ttmd_id: number) {
    const url = `/MasterDayFacade/MasterDaydayClasswiseActivateDeactivate/${ttmd_id}`;
    return await api.put<any>('timetable', url);
}

export async function getAcademicYearDropDropDownMasterDayClasswise() {
    const url = '/TimeTableCommon/GetAcademicYearData';
    return await api.get<AcademicYearDropDownTT[]>('timetable', url);
}

export async function getCategoryDropDownMasterDayClasswise() {
    const url = '/TimeTableCommon/GetCategoryDetails';
    return await api.get<CategoryDropDownTT[]>('timetable', url);
}

export async function getClassDropDownMasterDayClasswise() {
    const url = '/TimeTableCommon/GetClassData';
    return await api.get<ClassDropDownDataTT[]>('timetable', url);
}

export async function getDayDropDownMasterDayClasswise() {
    const url = '/TimeTableCommon/GetDayDetails';
    return await api.get<DaysDropDownDataTT[]>('timetable', url);
}

export async function getClassDropDownMasterDayClasswiseOnchnageofCatandyr(asmay_id: number, TTMC_Id: number) {
    const url = `/TimeTableCommon/GetClassData?asmay_id=${asmay_id}&TTMC_Id=${TTMC_Id}`;
    return await api.get<ClassDropDownDataTT[]>('timetable', url);
}

export async function getClassDropDownMasterDayClasswiseOnchnageofCatandyEarData(asmay_id: number, TTMC_Id: number) {
    const url = `/CategoryClassMappFacade/ClassDataByAcademicYearAndCategory/${asmay_id}/${TTMC_Id}`;
    return await api.get<ClassDropDownDataTT[]>('timetable', url);
}

export async function ClassDropDownDataOnchnGeYrAndCategory(asmay_id: number, TTMC_Id: number) {
    const url = `/PeriodAllocationFacade/getclassesOnCategoryAcademicYrBase/${asmay_id}/${TTMC_Id}`;
    return await api.get<ClassDropDownDataTT[]>('timetable', url);
}
