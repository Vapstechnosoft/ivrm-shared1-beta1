'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { ApiSearchparams } from '@/types';

// --- Types ---

export interface IHostel {
    hlmH_Id: number;
    hlmH_Name: string;
    hlmH_ContactNo?: string;
    hlmH_TotalCapacity?: number;
    hlmH_BoysGirlsFlg?: 'Boys' | 'Girls';
    hlmH_Address?: string;
    ivrmmC_Id?: number;
    ivrmmS_Id?: number;
    hlmH_City?: string;
    hlmH_Pincode?: number;
    hlmH_TotalFloor?: number;
    hlmH_TotalRoom?: number;
    hlmH_Desc?: string;
    hlmhW_WardenType?: string;
    hlmH_ActiveFlag?: boolean;
    // Mapped IDs (for saving)
    selectedFacilityIds?: number[];
    selectedWardenIds?: number[];
    selectedMessIds?: number[];
    // Documents
    hostelPhotos?: IHostelDocument[];

    // Display properties (from API)
    ivrmmC_CountryName?: string;
    ivrmmS_Name?: string;
    hlmM_Name?: string; // Comma separated? or single?

    // Mapped Data for View (if returned)
    mappedFacilities?: IFacility[];
    mappedWardens?: IEmployee[];
}

export interface IHostelDocument {
    hlmhP_Id?: number;
    hlmhP_FileName: string;
    hlmhP_FilePath: string;
    filetype?: string;
}

export interface IFacility {
    hlmftY_Id: number;
    hlmftY_FacilityName: string;
}

export interface IMess {
    hlmM_Id: number;
    hlmM_Name: string;
}

export interface IEmployee {
    hrmE_Id: number;
    hrmE_EmployeeFullName: string;
    hrmE_EmployeeCode: string;
}

export interface ICountry {
    ivrmmC_Id: number;
    ivrmmC_CountryName: string;
    ivrmmC_CountryCode: string;
}

export interface IState {
    ivrmmS_Id: number;
    ivrmmS_Name: string;
    ivrmmC_Id: number;
}

// --- Server Actions ---

export async function getHostelList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    return await api.get<any>('hostel', `/MasterHostel/get_hostel_list?${urlParams}`);
}

export async function getCountries() {
    return await api.get<any>('hostel', '/MasterHostel/get_countries');
}

export async function getFacilities() {
    return await api.get<any>('hostel', '/MasterHostel/get_facilities');
}

export async function getEmployees() {
    return await api.get<any>('hostel', '/MasterHostel/get_wardens');
}

export async function getStates(countryId: number) {
    if (!countryId) return { success: false, data: [] };
    const url = `/MasterHostel/get_states/${countryId}`;
    return await api.get<IState[]>('hostel', url);
}

// Helper fetchers for specific hostel details (edit/view)
export async function getMappedFacilities(hostelId: number) {
    const url = `/MasterHostel/get_mapped_facilities/${hostelId}`;
    return await api.get<any>('hostel', url);
}

export async function getMappedEmployees(hostelId: number) {
    const url = `/MasterHostel/get_mapped_employees/${hostelId}`;
    return await api.get<any>('hostel', url);
}

export async function getMappedMesses(hostelId: number) {
    const url = `/MasterHostel/get_mapped_mess/${hostelId}`; // Assumed endpoint
    return await api.get<any>('hostel', url);
}

export async function getHostelPhotos(hostelId: number) {
    const url = `/MasterHostel/get_hostel_photos/${hostelId}`;
    return await api.get<any>('hostel', url);
}

export async function saveHostel(data: any) {
    const url = '/MasterHostel/add_or_update_hostel';
    // Ensure payload matches API expectation exactly
    return await api.post<any>('hostel', url, data);
}

export async function deleteHostel(id: number) {
    const url = `/MasterHostel/toggle_hostel_status/${id}`;
    return await api.put<any>('hostel', url);
}

export async function getHostelDropdownList() {
    return await api.get<any>('hostel', '/MasterHostel/get_hostel_list');
}
