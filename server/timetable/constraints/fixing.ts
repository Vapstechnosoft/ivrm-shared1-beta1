'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type {
    FixingDayPeriodSchema,
    FixingDayStaffSchema,
    FixingDaySubjectSchema,
    FixingPeriodStaffSchema,
    FixingPeriodSubjectSchema
} from '@/schemas/timetable/constraints/fixing';
import type { ApiSearchparams } from '@/types';
import type { ITTFixingLoadData } from '@/types/timetable/constraints';

// Load Initial Data
// export async function getFixingLoadData() {
//     const url = '';
//     return await api.get<any>('timetable', url);
// }

export async function getFixingLoadData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'ttmC_CategoryName');
    const url = `/TTMasterCategoryFacade/GetMasterCategoryGridList?${urlParams}`;
    return await api.get<ITTFixingLoadData[]>('timetable', url);
}

// -------------------------------------------------------------------------
// Tab 1: Day Period
// -------------------------------------------------------------------------

export async function saveFixingDayPeriod(data: FixingDayPeriodSchema) {
    const url = '/Fixing/savedetail1';
    return await api.post<any>('timetable', url, data);
}

export async function getFixingDayPeriodDetails(id: number) {
    const url = `/Fixing/getpagedetails1/${id}`;
    return await api.get<any>('timetable', url);
}

export async function deactivateFixingDayPeriod(data: { TTFDP_Id: number; TTFDP_ActiveFlag: boolean }) {
    const url = '/Fixing/deactivate1';
    return await api.post<any>('timetable', url, data);
}

// -------------------------------------------------------------------------
// Tab 2: Day Staff
// -------------------------------------------------------------------------

export async function saveFixingDayStaff(data: FixingDayStaffSchema) {
    const url = '/Fixing/savedetail2';
    return await api.post<any>('timetable', url, data);
}

export async function getFixingDayStaffDetails(id: number) {
    const url = `/Fixing/getpagedetails2/${id}`;
    return await api.get<any>('timetable', url);
}

export async function deactivateFixingDayStaff(data: { TTFDS_Id: number; TTFDS_ActiveFlag: boolean }) {
    const url = '/Fixing/deactivate2';
    return await api.post<any>('timetable', url, data);
}

// -------------------------------------------------------------------------
// Tab 3: Day Subject
// -------------------------------------------------------------------------

export async function saveFixingDaySubject(data: FixingDaySubjectSchema) {
    const url = '/Fixing/savedetail3';
    return await api.post<any>('timetable', url, data);
}

export async function getFixingDaySubjectDetails(id: number) {
    const url = `/Fixing/getpagedetails3/${id}`;
    return await api.get<any>('timetable', url);
}

export async function deactivateFixingDaySubject(data: { TTFDSU_Id: number; TTFDSU_ActiveFlag: boolean }) {
    const url = '/Fixing/deactivate3';
    return await api.post<any>('timetable', url, data);
}

// -------------------------------------------------------------------------
// Tab 4: Period Staff
// -------------------------------------------------------------------------

export async function saveFixingPeriodStaff(data: FixingPeriodStaffSchema) {
    const url = '/Fixing/savedetail4';
    return await api.post<any>('timetable', url, data);
}

export async function getFixingPeriodStaffDetails(id: number) {
    const url = `/Fixing/getpagedetails4/${id}`;
    return await api.get<any>('timetable', url);
}

export async function deactivateFixingPeriodStaff(data: { TTFPS_Id: number; TTFPS_ActiveFlag: boolean }) {
    const url = '/Fixing/deactivate4';
    return await api.post<any>('timetable', url, data);
}

// -------------------------------------------------------------------------
// Tab 5: Period Subject
// -------------------------------------------------------------------------

export async function saveFixingPeriodSubject(data: FixingPeriodSubjectSchema) {
    const url = '/Fixing/savedetail5';
    return await api.post<any>('timetable', url, data);
}

export async function getFixingPeriodSubjectDetails(id: number) {
    const url = `/Fixing/getpagedetails5/${id}`;
    return await api.get<any>('timetable', url);
}

export async function deactivateFixingPeriodSubject(data: { TTFPSU_Id: number; TTFPSU_ActiveFlag: boolean }) {
    const url = '/Fixing/deactivate5';
    return await api.post<any>('timetable', url, data);
}

// -------------------------------------------------------------------------
// Dropdown Helpers (Reused from Fixing Controller in backend)
// -------------------------------------------------------------------------

export async function getClassByCategory(data: { ASMAY_Id: number; TTMC_Id: number }) {
    const url = '/Fixing/getclass_catg';
    return await api.post<any>('timetable', url, data);
}

export async function getStaffByClassSection(data: { ASMAY_Id: number; TTMC_Id?: number; ASMCL_Id?: number; ASMS_Id?: number }) {
    const url = '/Fixing/getstaff_section';
    return await api.post<any>('timetable', url, data);
}

export async function getSubjectByStaff(data: { ASMAY_Id: number; ASMCL_Id?: number; ASMS_Id?: number; HRME_Id?: number }) {
    const url = '/Fixing/getsubject_staff';
    return await api.post<any>('timetable', url, data);
}

// Check backend for this one, usually implied by standard 'getalldetails' often returning periods/days/categories
// But for dependent logic:
// getperiod_class
// getsection_class
// If these exist, we implement them.
// Legacy: `get_period_section1` -> gets period and section?
// Actually usually `getclass_catg` might return sections too?
// Let's implement generic fetches if needed.

export async function getPeriodByClass(data: { ASMAY_Id: number; ASMCL_Id: number }) {
    const url = '/Fixing/getperiod_class'; // Guessing the endpoint name based on convention
    return await api.post<any>('timetable', url, data);
}

export async function getSectionByClass(data: { ASMAY_Id: number; ASMCL_Id: number; TTMC_Id: number }) {
    const url = '/Fixing/getsection_class';
    return await api.post<any>('timetable', url, data);
}
