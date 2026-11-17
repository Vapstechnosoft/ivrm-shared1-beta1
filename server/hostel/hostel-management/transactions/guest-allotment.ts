'use server';

import { api } from '@/lib/apiService';
import { guestAllotmentSchema } from '@/schemas/hostel/transactions/guest-allotment.schema';
import { revalidatePath } from 'next/cache';

const SERVICE_NAME = 'default';
const API_BASE_URL = 'HostelAllotForGuest';

export interface GuestAllotmentLoadData {
    hstllist: any[];
    categorylist: any[];
    roomlist: any[];
    alldata1: any[];
}

export const getGuestAllotmentLoadData = async (): Promise<GuestAllotmentLoadData> => {
    try {
        const response = await api.get<{ hstllist: any[], categorylist: any[], roomlist: any[], alldata1: any[] }>(SERVICE_NAME, `${API_BASE_URL}/loaddata/2`);
        return {
            hstllist: response.data?.hstllist || [],
            categorylist: response.data?.categorylist || [],
            roomlist: response.data?.roomlist || [],
            alldata1: response.data?.alldata1 || []
        };
    } catch (error) {
        console.error('Error fetching guest allotment load data:', error);
        return {
            hstllist: [],
            categorylist: [],
            roomlist: [],
            alldata1: []
        };
    }
};

export const getRoomDetails = async (payload: { HRMRM_Id: number }): Promise<any> => {
    try {
        const response = await api.post(SERVICE_NAME, `${API_BASE_URL}/get_roomdetails`, payload);
        return response.data;
    } catch (error) {
        console.error('Error fetching room details:', error);
        return null;
    }
};

export const saveGuestAllotment = async (data: any) => {
    try {
        const payload = {
            ...data,
            HLHGSTALT_AllotmentDate: data.HLHGSTALT_AllotmentDate,
        };

        const response = await api.post(SERVICE_NAME, `${API_BASE_URL}/save`, payload);
        return response;

    } catch (error) {
        console.error('Error saving guest allotment:', error);
        return { success: false, message: 'Failed to save guest allotment', data: null };
    }
};
