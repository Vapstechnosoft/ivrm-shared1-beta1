
'use server';

import { api } from '@/lib/apiService';
import {
    IOnlineLeaveInitialData,
    IOnlineLeaveHistoryData,
    ILeaveApplicationRequest,
    ILeaveRequestExtraPayload
} from '@/types/staff-portal/online-leave';
import { ApiResponse } from '@/lib/apiService';

const BASE_URL = 'OnlineLeaveApplication';

/**
 * Get initial leave data including employee profile and leave balances
 */
export async function getInitialLeaveData(id: number = 2) {
    try {
        const response = await api.get<IOnlineLeaveInitialData>('portal', `${BASE_URL}/getonlineLeave/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in getInitialLeaveData:', error);
        return null;
    }
}

/**
 * Get leave application history and status
 */
export async function getLeaveHistory(id: number = 2) {
    try {
        const response = await api.get<IOnlineLeaveHistoryData>('portal', `${BASE_URL}/getonlineLeavestatus/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in getLeaveHistory:', error);
        return null;
    }
}

/**
 * Apply for leave
 */
export async function applyLeave(payload: ILeaveApplicationRequest) {
    try {
        const response = await api.post<ApiResponse<any>>('portal', `${BASE_URL}/save`, payload);
        return response.data;
    } catch (error) {
        console.error('Error in applyLeave:', error);
        return { returnval: false, message: 'Failed to apply leave' };
    }
}

/**
 * Cancel/Delete applied leave record
 */
export async function cancelLeave(hrelA_Id: number) {
    try {
        const response = await api.get<ApiResponse<any>>('portal', `${BASE_URL}/ActiveDeactiveRecord/${hrelA_Id}`);
        return response.data;
    } catch (error) {
        console.error('Error in cancelLeave:', error);
        return { returnval: false, message: 'Failed to cancel leave' };
    }
}

/**
 * Request extra leave (CompOff/OD)
 */
export async function requestExtraLeave(payload: ILeaveRequestExtraPayload) {
    try {
        const response = await api.post<ApiResponse<any>>('portal', `${BASE_URL}/requestleave`, payload);
        return response.data;
    } catch (error) {
        console.error('Error in requestExtraLeave:', error);
        return { returnval: false, message: 'Failed to request leave' };
    }
}
