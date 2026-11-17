'use server';

import { api } from '@/lib/apiService';

// --- Shared Dropdowns ---
// Reusing getCategory, getClassDetails, etc. might be possible, but endpoints might be different.
// Checking legacy code: `Restriction/savedetail1`, `Restriction/savedetail2`, etc.
// `Restriction/getpagedetails1`, `Restriction/getpagedetails2`, etc.

export async function getSubjectRestrictionDetails() {
    const url = '/Restriction/Getdetails'; // Assuming generic load
    return await api.get<any>('timetable', url);
}

// --- Tab 1: Day Period ---
export async function saveDayPeriodDetail(data: any) {
    const url = '/Restriction/savedetail1';
    return await api.post<any>('timetable', url, data);
}
export async function getDayPeriodEditDetails(id: number) {
    const url = `/Restriction/getpagedetails1/${id}`; // Adjusting param passing if needed, usually passed as object or query param if not ID in path
    // Legacy uses apiService.getURI("Restriction/getpagedetails1", editid) which appends ID.
    // So logic here is correct.
    return await api.get<any>('timetable', url);
}

// --- Tab 2: Day Staff ---
export async function saveDayStaffDetail(data: any) {
    const url = '/Restriction/savedetail2';
    return await api.post<any>('timetable', url, data);
}
export async function getDayStaffEditDetails(id: number) {
    const url = `/Restriction/getpagedetails2/${id}`;
    return await api.get<any>('timetable', url);
}

// --- Tab 3: Day Subject ---
export async function saveDaySubjectDetail(data: any) {
    const url = '/Restriction/savedetail3';
    return await api.post<any>('timetable', url, data);
}
export async function getDaySubjectEditDetails(id: number) {
    const url = `/Restriction/getpagedetails3/${id}`;
    return await api.get<any>('timetable', url);
}

// --- Tab 4: Period Staff ---
export async function savePeriodStaffDetail(data: any) {
    const url = '/Restriction/savedetail4';
    return await api.post<any>('timetable', url, data);
}
export async function getPeriodStaffEditDetails(id: number) {
    const url = `/Restriction/getpagedetails4/${id}`;
    return await api.get<any>('timetable', url);
}

// --- Tab 5: Period Subject ---
export async function savePeriodSubjectDetail(data: any) {
    const url = '/Restriction/savedetail5';
    return await api.post<any>('timetable', url, data);
}
export async function getPeriodSubjectEditDetails(id: number) {
    const url = `/Restriction/getpagedetails5/${id}`;
    return await api.get<any>('timetable', url);
}

// --- Helper Dropdown Fetchers ---
// Assuming standard ones exist or using specific controller endpoints
export async function getCategoryDetails(data: { ASMAY_Id: number }) {
    const url = '/Restriction/get_category'; // Guessing
    // Legacy: get_category1() -> calls 'Restriction/get_category' (implied)
    return await api.post<any>('timetable', '/Restriction/get_category', data);
}

// ... other helpers as needed ...
