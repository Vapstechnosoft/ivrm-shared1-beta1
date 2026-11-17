'use server';

import { api, ApiResponse } from '@/lib/apiService';
import { revalidatePath } from 'next/cache';

const URL_GET_DATA = '/Room_Tariff/get_tariff_grid_data';
const URL_SAVE_DATA = '/Room_Tariff/save_room_tariff';
const URL_EDIT_DATA = '/Room_Tariff/editdata';
const URL_DEACTIVATE = '/Room_Tariff/ydeactivate';
const URL_GET_BED_COUNT = '/Room_Tariff/get_bedcount';

export interface IRoomTariff {
  hlmrtF_Id: number;
  asmaY_Id: number;
  hrmrM_Id: number;
  hlmrtF_SORate: number;
  hlmrtF_RoomRate: number;
  hlmrtF_ActiveFlag: boolean;
  asmaY_Year?: string;
  hrmrM_RoomNo?: string;
  hrmrM_BedCapacity?: number;
}

export interface IRoomTariffEditData {
  editlist: IRoomTariff[];
}

/**
 * Get Room Tariff grid data
 * GET /Room_Tariff/get_tariff_grid_data
 */
export const getRoomTariffData = async (): Promise<ApiResponse<IRoomTariff[]>> => {
    try {
        const response = await api.get<IRoomTariff[]>('hostel', URL_GET_DATA);
        return response;
    } catch (error) {
        console.error('Error fetching room tariff data:', error);
        return {
            success: false,
            message: 'Failed to fetch room tariff data',
            data: []
        };
    }
};

/**
 * Get Room Tariff edit data by ID
 * GET /Room_Tariff/editdata/{tariff_id}
 */
export const getRoomTariffEditData = async (tariffId: number): Promise<ApiResponse<IRoomTariffEditData>> => {
    try {
        const response = await api.get<IRoomTariffEditData>('hostel', `${URL_EDIT_DATA}/${tariffId}`);
        return response;
    } catch (error) {
        console.error('Error fetching room tariff edit data:', error);
        return {
            success: false,
            message: 'Failed to fetch room tariff edit data',
            data: { editlist: [] }
        };
    }
};

/**
 * Save Room Tariff
 * POST /Room_Tariff/save_room_tariff
 */
export const saveRoomTariff = async (data: {
    hlmrtF_Id: number;
    asmaY_Id: number;
    hrmrM_Id: number;
    hlmrtF_SORate: number;
    hlmrtF_RoomRate: number;
}): Promise<ApiResponse<null>> => {
    try {
        const response = await api.post<null>('hostel', URL_SAVE_DATA, data);
        if (response.success) {
            revalidatePath('/hostel/hostel-management/masters/room-tariff');
        }
        return response;
    } catch (error) {
        console.error('Error saving room tariff:', error);
        return {
            success: false,
            message: 'Failed to save room tariff',
            data: null
        };
    }
};

/**
 * Deactivate/Activate Room Tariff
 * PUT /Room_Tariff/ydeactivate/{tariff_id}
 */
export const deactivateTariff = async (tariffId: number): Promise<ApiResponse<null>> => {
    try {
        const response = await api.put<null>('hostel', `${URL_DEACTIVATE}/${tariffId}`, {});
        return response;
    } catch (error) {
        console.error('Error toggling room tariff status:', error);
        return {
            success: false,
            message: 'Failed to toggle room tariff status',
            data: null
        };
    }
};

/**
 * Get Bed Count for Room
 * POST /Room_Tariff/get_bedcount
 */
export const getBedCount = async (roomId: number, singleRate: number): Promise<ApiResponse<{ hrmrM_BedCapacity: number }>> => {
    try {
        const payload = {
            HRMRM_Id: roomId,
            HLMRTF_SORate: singleRate
        };
        const response = await api.post<{ hrmrM_BedCapacity: number }>('hostel', URL_GET_BED_COUNT, payload);
        return response;
    } catch (error) {
        console.error('Error fetching bed count:', error);
        return {
            success: false,
            message: 'Failed to fetch bed count',
            data: { hrmrM_BedCapacity: 0 }
        };
    }
};
