'use server';

import { api } from '@/lib/apiService';
import { revalidatePath } from 'next/cache';

const SERVICE_NAME = 'default';
const API_BASE_URL = 'StudentVacant';

export const getVacateLoadData = async (type: string) => {
    try {
        const response = await api.post<any>(SERVICE_NAME, `${API_BASE_URL}/loaddata`, { type });
        return response.data || {};
    } catch (error) {
        console.error('Error fetching vacate load data:', error);
        return { success: false, message: 'Failed to fetch load data' };
    }
};

export const getStudentDetail = async (AMST_Id: number) => {
    try {
        const response = await api.post<any>(SERVICE_NAME, `${API_BASE_URL}/get_studentDetail`, { AMST_Id });
        return response.data;
    } catch (error) {
        console.error('Error fetching student detail:', error);
        return null;
    }
};

export const getStaffDetail = async (HRME_Id: number) => {
    try {
        const response = await api.post<any>(SERVICE_NAME, `${API_BASE_URL}/get_staffDetail`, { HRME_Id });
        return response.data;
    } catch (error) {
        console.error('Error fetching staff detail:', error);
        return null;
    }
};

export const getGuestDetail = async (HLHGSTALT_Id: number) => {
    try {
        const response = await api.post<any>(SERVICE_NAME, `${API_BASE_URL}/get_guestDetail`, { HLHGSTALT_Id });
        return response.data;
    } catch (error) {
        console.error('Error fetching guest detail:', error);
        return null;
    }
};

export const getDetailsOnType = async (type: string) => {
    try {
        const response = await api.post<any>(SERVICE_NAME, `${API_BASE_URL}/getalldetailsOnselectiontype`, { type });
        return response.data;
    } catch (error) {
        console.error('Error fetching details on type:', error);
        return null;
    }
};

export const saveVacate = async (data: any) => {
    try {
        // payload formatting based on type
        const payload = { ...data };
        if (data.HLHSALT_VacatedDate) payload.HLHSALT_VacatedDate = data.HLHSALT_VacatedDate;
        if (data.HLHSTALT_VacatedDate) payload.HLHSTALT_VacatedDate = data.HLHSTALT_VacatedDate;
        if (data.HLHGSTALT_VacatedDate) payload.HLHGSTALT_VacatedDate = data.HLHGSTALT_VacatedDate;

        const response = await api.post<any>(SERVICE_NAME, `${API_BASE_URL}/edittab1`, payload);
        if (response?.data?.msg === 'updated' || response?.data?.returnval === true) {
            revalidatePath('/hostel/transactions/vacate-room');
            return { success: true, message: 'Record Updated Successfully' };
        } else {
             // Handle raw response if it lacks data wrapper in some helper cases, but usually we access .data
             // If api.post returns Axios response, then response.data is the payload.
             // If response.data.returnval...
            return { success: false, message: response?.data?.msg || 'Failed to update' };
        }
    } catch (error) {
        console.error('Error saving vacate:', error);
        return { success: false, message: 'Failed to update record' };
    }
};
