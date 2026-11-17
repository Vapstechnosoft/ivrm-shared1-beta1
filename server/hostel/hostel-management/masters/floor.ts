'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { ApiSearchparams } from '@/types';

// --- Server Actions for Master Floor ---

export async function saveFloor(data: any) {
    const url = '/MasterFloor/add_or_updatefloor';
    return await api.post<any>('hostel', url, data);
}

export async function getFloorList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    return await api.get<any>('hostel', `/MasterFloor/get_floor_list?${urlParams}`);
}

export async function getFloorDetails(id: number) {
    const url = `/MasterFloor/get_floor_details/${id}`;
    return await api.get<any>('hostel', url);
}

export async function deactivateFloor(id: number) {
    const url = `/MasterFloor/deactivate_floor/${id}`;
    return await api.put<any>('hostel', url);
}

// Keeping this for reference, though getFloorDetails seems to cover it
export async function getMappedFacilitiesForFloor(id: number) {
    const url = `/MasterFloor/get_mapped_facility/${id}`;
    return await api.get<any>('hostel', url);
}
