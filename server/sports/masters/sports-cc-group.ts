'use server';

import { type ApiResponse, api } from '@/lib/apiService';
import type { IMasterSportsCCGroup } from '@/types/sports/masters/sports-cc-group';

export const fetchMasterSportsCCGroup = async (): Promise<ApiResponse<IMasterSportsCCGroup[]>> => {
    try {
        const url = `/MasterSportsCCGroup/getDetails`;
        const response = await api.post<IMasterSportsCCGroup[]>('sports', url, {});
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { success: false, message: 'Failed to fetch data', data: [] };
    }
};

export const saveMasterSportsCCGroup = async (data: any): Promise<ApiResponse<any>> => {
    try {
        const params = new URLSearchParams();
        if (data.spccmsccG_Id) params.append('SPCCMSCCG_Id', data.spccmsccG_Id.toString());
        params.append('SPCCMSCCG_SportsCCGroupName', data.spccmsccG_SportsCCGroupName);
        params.append('SPCCMSCCG_SportsCCGroupDesc', data.spccmsccG_SportsCCGroupDesc);
        params.append('SPCCMSCCG_SCCFlag', data.spccmsccG_SCCFlag);

        const url = `/MasterSportsCCGroup/save?${params.toString()}`;
        const response = await api.post<any>('sports', url, {});
        return response;
    } catch (error) {
        console.error('Error saving data:', error);
        return { success: false, message: 'Failed to save data', data: null };
    }
};

export const editMasterSportsCCGroup = async (id: number): Promise<ApiResponse<IMasterSportsCCGroup[]>> => {
    try {
        const url = `/MasterSportsCCGroup/EditDetails/${id}`;
        const response = await api.post<IMasterSportsCCGroup[]>('sports', url, {});
        return response;
    } catch (error) {
        console.error('Error fetching edit details:', error);
        return { success: false, message: 'Failed to fetch details', data: null };
    }
};

export const deactivateMasterSportsCCGroup = async (data: any): Promise<ApiResponse<any>> => {
    try {
        const params = new URLSearchParams();
        params.append('SPCCMSCCG_Id', data.spccmD_Id ? data.spccmD_Id.toString() : data.spccmsccG_Id.toString());
        params.append('SPCCMSCCG_ActiveFlag', data.spccmD_ActiveFlag !== undefined ? data.spccmD_ActiveFlag.toString() : data.spccmsccG_ActiveFlag.toString());

        // Note: The toggle form in page.tsx currently uses 'spccmD_Id' (likely copy-paste from Division). 
        // I should check if the toggle form sends the correct keys. 
        // Division toggle form sent: spccmD_Id, spccmD_ActiveFlag.
        // MasterSportsCCGroup toggle form should send: spccmsccG_Id, spccmsccG_ActiveFlag.
        // I will assume the component update (if done right) sends the right keys, but I'll add fallback just in case 
        // to handle potential mismatch if I missed updating the toggle form keys. 
        // Wait, I didn't update the toggle form yet! The previous view showed it using 'spccmD_...'.
        // I'll fix the toggle form in the next step. Here I will use the correct keys 'spccmsccG...'.

        const url = `/MasterSportsCCGroup/deactivate?${params.toString()}`;
        const response = await api.post<any>('sports', url, {});
        return response;
    } catch (error) {
        console.error('Error deactivating data:', error);
        return { success: false, message: 'Failed to deactivate data', data: null };
    }
};
