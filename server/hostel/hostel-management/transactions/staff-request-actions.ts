'use server';

import { api } from '@/lib/apiService';
import { revalidatePath } from 'next/cache';

const SERVICE_NAME = 'default';

interface PaginationData {
    total: number;
    page: number;
    page_Size: number;
}

export interface ApiResponse<T> extends Partial<PaginationData> {
    success: boolean;
    message: string;
    data: T | null;
    [key: string]: unknown;
}

export async function getStaffRequestLoadData(): Promise<ApiResponse<any>> {
    try {
        const res = await api.post<any>(SERVICE_NAME, 'StaffRequest/loaddata', {});
         return res;
    } catch (error) {
        console.error('Error fetching staff request load data:', error);
         return {
            success: false,
            message: 'Failed to fetch data',
            data: null
         };
    }
}

export async function saveStaffRequest(data: any): Promise<ApiResponse<any>> {
    try {
        const res = await api.post<any>(SERVICE_NAME, 'StaffRequest/save', data);
        if (res.data) {
             revalidatePath('/hostel/hostel-management/transactions/staff-request');
        }
        return res;
    } catch (error) {
        console.error('Error saving staff request:', error);
        return {
            success: false,
            message: 'Failed to save request',
            data: null
        };
    }
}

export async function toggleStaffRequestStatus(usersem: any): Promise<ApiResponse<any>> {
    try {
        const res = await api.post<any>(SERVICE_NAME, 'StaffRequest/deactive', usersem);
        if (res.data) {
             revalidatePath('/hostel/hostel-management/transactions/staff-request');
        }
         return res;
    } catch (error) {
        console.error('Error toggling staff request status:', error);
        return {
            success: false,
            message: 'Failed to toggle status',
            data: null
        };
    }
}

// Approval List
export async function getStaffApprovalLoadData(): Promise<ApiResponse<any>> {
    try {
        const res = await api.get<any>(SERVICE_NAME, 'StaffRequestConfirm/loaddata/2');
         return res;
    } catch (error) {
        console.error('Error fetching staff approval load data:', error);
        return {
            success: false,
            message: 'Failed to fetch approval data',
            data: null
        };
    }
}

export async function approveStaffRequest(data: any): Promise<ApiResponse<any>> {
    try {
        const res = await api.post<any>(SERVICE_NAME, 'StaffRequestConfirm/requestApproved', data);
        if (res.data) {
             revalidatePath('/hostel/hostel-management/transactions/staff-approval-list');
        }
         return res;
    } catch (error) {
        console.error('Error approving staff request:', error);
        return {
            success: false,
            message: 'Failed to approve request',
            data: null
        };
    }
}

export async function rejectStaffRequest(data: any): Promise<ApiResponse<any>> {
    try {
        const res = await api.post<any>(SERVICE_NAME, 'StaffRequestConfirm/requestRejected', data);
        if (res.data) {
            revalidatePath('/hostel/hostel-management/transactions/staff-approval-list');
        }
        return res;
    } catch (error) {
        console.error('Error rejecting staff request:', error);
        return {
            success: false,
            message: 'Failed to reject request',
            data: null
        };
    }
}
