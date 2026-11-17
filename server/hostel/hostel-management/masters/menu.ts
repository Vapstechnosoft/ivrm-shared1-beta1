'use server';

import { api } from '@/lib/apiService';
import { MessMenuSchemaType } from '@/schemas/hostel/mess-menu.schema';
import { revalidatePath } from 'next/cache';

const URL_GET_DATA = 'HS_Master/get_MessMenudata';
const URL_SAVE_DATA = 'HS_Master/save_MessMenudata';
const URL_DEACTIVATE = 'HS_Master/deactiveY_MessMenudata';

export interface IMessMenu {
    hlmmN_Id: number;
    hlmmN_MenuName: string;
    hlmmN_MenuDesc: string;
    hlmM_Name: string;
    hlmmC_Name: string;
    hlmmN_ActiveFlag: boolean;
    hlmM_Id: number;
    hlmmC_Id: number;
}

interface MessMenuDataResponse {
    get_messlist: { hlmM_Id: number; hlmM_Name: string }[];
    get_messCategorylist: { hlmmC_Id: number; hlmmC_Name: string }[];
    griddata: IMessMenu[];
}

// Mock data constant
const MOCK_DATA: MessMenuDataResponse = {
    get_messlist: [
        { hlmM_Id: 1, hlmM_Name: 'Central Mess' }, 
        { hlmM_Id: 2, hlmM_Name: 'North Wing Mess' }
    ],
    get_messCategorylist: [
        { hlmmC_Id: 1, hlmmC_Name: 'Standard' },
        { hlmmC_Id: 2, hlmmC_Name: 'Premium' }
    ],
    griddata: [
        {
            hlmmN_Id: 1,
            hlmmN_MenuName: 'Monday Breakfast',
            hlmmN_MenuDesc: 'Idli, Vada, Sambar, Chutney',
            hlmM_Name: 'Central Mess',
            hlmmC_Name: 'Standard',
            hlmmN_ActiveFlag: true,
            hlmM_Id: 1,
            hlmmC_Id: 1
        },
        {
            hlmmN_Id: 2,
            hlmmN_MenuName: 'Monday Lunch',
            hlmmN_MenuDesc: 'Rice, Dal, Curd, Pickle, Papad',
            hlmM_Name: 'Central Mess',
            hlmmC_Name: 'Standard',
            hlmmN_ActiveFlag: true,
            hlmM_Id: 1,
            hlmmC_Id: 1
        },
        {
            hlmmN_Id: 3,
            hlmmN_MenuName: 'Special Dinner',
            hlmmN_MenuDesc: 'Paneer Butter Masala, Roti, Jeera Rice',
            hlmM_Name: 'North Wing Mess',
            hlmmC_Name: 'Premium',
            hlmmN_ActiveFlag: false,
            hlmM_Id: 2,
            hlmmC_Id: 2
        }
    ]
};

export const getMessMenuData = async () => {
    try {
        const response = await api.post<MessMenuDataResponse>('default', URL_GET_DATA, {
             pageid: 2 
        });

        return response.data ?? MOCK_DATA;
    } catch (error) {
        console.error('Error fetching mess menu data:', error);
        return MOCK_DATA;
    }
};

export const saveMessMenu = async (data: MessMenuSchemaType) => {
    try {
        const payload = {
            HLMMN_Id: data.hlmmN_Id ?? 0,
            HLMM_Id: data.hlmM_Id,
            HLMMC_Id: data.hlmmC_Id,
            HLMMN_MenuName: data.hlmmN_MenuName,
            HLMMN_MenuDesc: data.hlmmN_MenuDesc,
        };

        const response = await api.post<{ returnval: boolean; duplicate: boolean }>('default', URL_SAVE_DATA, payload);

        revalidatePath('/hostel/masters/mess-menu');
        
        if (response.data?.duplicate) {
             return { success: false, message: 'Record already exists' };
        }

        if (response.data?.returnval) {
             return { success: true, message: data.hlmmN_Id ? 'Record Updated Successfully' : 'Record Saved Successfully' };
        }

        return { success: false, message: 'Operation failed' };
    } catch (error) {
        console.error('Error saving mess menu:', error);
        return { success: false, message: 'An error occurred while saving' };
    }
};

export const deleteMessMenu = async (data: IMessMenu) => {
    try {
        const payload = {
            HLMMN_Id: data.hlmmN_Id,
            HLMMN_ActiveFlag: data.hlmmN_ActiveFlag,
        };
        const response = await api.post<{ returnval: boolean }>('default', URL_DEACTIVATE, payload);
        revalidatePath('/hostel/masters/mess-menu');
        return { 
            success: response.data?.returnval ?? false, 
            message: response.data?.returnval ? (data.hlmmN_ActiveFlag ? 'Deactivated Successfully' : 'Activated Successfully') : 'Operation failed' 
        };
    } catch (error) {
        console.error('Error deactivating mess menu:', error);
        return { success: false, message: 'An error occurred' };
    }
};
