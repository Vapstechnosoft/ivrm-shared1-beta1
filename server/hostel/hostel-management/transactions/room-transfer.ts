'use server';

import { api } from '@/lib/apiService';
import { revalidatePath } from 'next/cache';

const SERVICE_NAME = 'default';

export async function getRoomTransferLoadData(type: string) {
    try {
        const res = await api.post<any>(SERVICE_NAME, 'CLGHostelVacant/loaddata', { type });
        return res.data || null;
    } catch (error) {
        console.error('Error fetching room transfer load data:', error);
        return null;
    }
}

export async function getTransferPersonDetail(type: string, id: number) {
    try {
        let endpoint = '';
        const payload: any = {};
        if (type === 'stud') {
            endpoint = 'CLGHostelVacant/get_studentDetail';
            payload.AMCST_Id = id;
        } else if (type === 'staff') {
            endpoint = 'CLGHostelVacant/get_staffDetail';
            payload.HRME_Id = id;
        } else {
            endpoint = 'CLGHostelVacant/get_guestDetail';
            payload.HLHGSTALT_Id = id;
        }
        const res = await api.post<any>(SERVICE_NAME, endpoint, payload);
        return res.data || null;
    } catch (error) {
        console.error('Error fetching transfer person detail:', error);
        return null;
    }
}

export async function getFloorsAndCategories(hostelId: number) {
    try {
        const res = await api.post<any>(SERVICE_NAME, 'HostelAllotForCLGStudent/floor', { HLMH_Id: hostelId });
        return res.data || null;
    } catch (error) {
        console.error('Error fetching floors and categories:', error);
        return null;
    }
}

export async function getRoomsForTransfer(floorId: number, categoryId: number, oldRoomId: number) {
    try {
        const res = await api.post<any>(SERVICE_NAME, 'HostelAllotForCLGStudent/roomForVacateReport', {
            HLMF_Id: floorId,
            HLMRCA_Id: categoryId,
            HRMRM_Id_Old: oldRoomId
        });
        return res.data || null;
    } catch (error) {
        console.error('Error fetching rooms for transfer:', error);
        return null;
    }
}

export async function saveRoomTransfer(data: any) {
    try {
        const res = await api.post<any>(SERVICE_NAME, 'HostelAllotForCLGStudent/HostelT', data);
        if (res.data?.returnval === true) {
            revalidatePath('/hostel/hostel-management/transactions/room-transfer');
        }
        return res.data;
    } catch (error) {
        console.error('Error saving room transfer:', error);
        return null;
    }
}
