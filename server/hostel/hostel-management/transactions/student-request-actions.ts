'use server';

import { api } from '@/lib/apiService';
import { revalidatePath } from 'next/cache';
import { StudentRequestLoadData, StudentConfirmLoadData } from '@/types/hostel/hostel-management/transactions';

const SERVICE_NAME = 'default';

export async function getStudentRequestLoadData(): Promise<StudentRequestLoadData | null> {
    try {
        const res = await api.post<StudentRequestLoadData>(SERVICE_NAME, 'StudentRequest/loaddata', {});
        return res.data || null;
    } catch (error) {
        console.error('Error fetching student request load data:', error);
        return null; // Return specific structure if known, e.g. { yearlist: [] }
    }
}

export async function saveStudentRequest(data: any) {
    try {
        const res = await api.post(SERVICE_NAME, 'StudentRequest/save', data);
        if (res?.message === "Success") { // Check returnval or msg
            revalidatePath('/hostel/hostel-management/transactions/student-request');
            return res;
        }
        return res;
    } catch (error) {
        console.error('Error saving student request:', error);
        return null;
    }
}

export async function toggleStudentRequestStatus(usersem: any) {
    try {
        const res = await api.post(SERVICE_NAME, 'StudentRequest/deactive', usersem);
        if (res?.message === "Success") {
            revalidatePath('/hostel/hostel-management/transactions/student-request');
            return res;
        }
        return res;
    } catch (error) {
        console.error('Error toggling student request status:', error);
        return null;
    }
}

// Confirmation / Approval
export async function getStudentConfirmLoadData(): Promise<StudentConfirmLoadData | null> {
    try {
        const res = await api.get<StudentConfirmLoadData>(SERVICE_NAME, 'StudentRequestConfirm/loaddata/2');
        return res.data || null;
    } catch (error) {
        console.error('Error fetching student confirm load data:', error);
        return null;
    }
}

export async function approveStudentRequest(data: any) {
    try {
        const res = await api.post(SERVICE_NAME, 'StudentRequestConfirm/requestApproved', data);
        if (res?.message === "Success") {
             revalidatePath('/hostel/hostel-management/transactions/student-request-confirm');
        }
        return res;
    } catch (error) {
        console.error('Error approving student request:', error);
        return null;
    }
}

export async function rejectStudentRequest(data: any) {
    try {
        const res = await api.post(SERVICE_NAME, 'StudentRequestConfirm/requestRejected', data);
        if (res?.message === "Success") {
             revalidatePath('/hostel/hostel-management/transactions/student-request-confirm');
        }
        return res;
    } catch (error) {
        console.error('Error rejecting student request:', error);
        return null;
    }
}
