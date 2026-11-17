'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { ApiSearchparams } from '@/types';

// --- Server Actions for Master Room ---

export async function saveRoom(data: any) {
    const url = '/MasterRoom/add_or_update_room';
    return await api.post<any>('hostel', url, data);
}

export async function getRoomList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    return await api.get<any>('hostel', `/MasterRoom/get_room_list?${urlParams}`);
}

export async function getRoomDetails(id: number) {
    const url = `/MasterRoom/get_room_details/${id}`;
    return await api.get<any>('hostel', url);
}

export async function deactivateRoom(id: number) {
    const url = `/MasterRoom/deactivate_room/${id}`;
    return await api.put<any>('hostel', url);
}

export async function getMappedFacilitiesForRoom(id: number) {
    const url = `/MasterRoom/get_mapped_facility/${id}`;
    return await api.get<any>('hostel', url);
}

export async function getFloorsByHostel(hostelId: number) {
     const url = `/MasterRoom/get_floor_by_hostel/${hostelId}`;
     return await api.get<any>('hostel', url);
}

export async function getRoomCategoryByHostel(hostelId: number) {
    // Assuming this endpoint exists based on pattern or utilizing generic get list if filtered
    // If specific endpoint is not available, might need to use getRoomCategoryList and filter? 
    // But usually localized dropdown logic exists. 
    // Trying standard naming convention for this module.
    const url = `/MasterRoom/get_room_category_by_hostel/${hostelId}`;
    return await api.get<any>('hostel', url);
}
