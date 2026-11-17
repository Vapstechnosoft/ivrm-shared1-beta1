'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { mobileMasterPageSchema } from '@/schemas/super-admin/configuration-setting/mobilemasterpage';
import type { IMobileMasterPage } from '@/types/super-admin/configuration-setting/mobilemasterpage';
import { revalidatePath } from 'next/cache';

const FACADE = 'Mobile_Master_Page';

export async function getMobileMasterPages(searchParams: any = {}) {
    try {
        const query = getSearchParamsUrl(searchParams);
        const url = `${FACADE}/get_all_details_grid_mobile_master?${query}`;
        const response = await api.get<any>('sadmin', url);

        if (response.success && Array.isArray(response.data)) {
            return {
                success: true,
                data: response.data as IMobileMasterPage[],
                message: response.message,
                total: response.total || response.data.length,
                page: response.page || 1,
                page_size: response.page_size || 10
            };
        }

        return {
            success: false,
            data: [],
            message: response.message || 'Failed to fetch mobile master pages',
            total: 0,
            page: 1,
            page_size: 10
        };
    } catch (error) {
        console.error('Error fetching mobile master pages:', error);
        return {
            success: false,
            data: [],
            message: 'An error occurred while fetching mobile master pages'
        };
    }
}

export async function saveMobileMasterPage(data: any) {
    try {
        const validation = mobileMasterPageSchema.safeParse(data);
        if (!validation.success) {
            return {
                success: false,
                message: 'Validation failed',
                errors: validation.error.flatten().fieldErrors
            };
        }

        const payload = {
            ivrmmaP_Id: data.ivrmmaP_Id || 0,
            ivrmmaP_AppPageName: data.ivrmmaP_AppPageName,
            ivrmmaP_Displayname: data.ivrmmaP_Displayname,
            ivrmmaP_AppPageDesc: data.ivrmmaP_AppPageDesc,
            ivrmmaP_AppPageURL: data.ivrmmaP_AppPageURL
        };

        const response = await api.post<any>('sadmin', FACADE, payload);

        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/configuration-setting/mobilemasterpage');
            return {
                success: true,
                message: response.message || 'Mobile Master Page saved successfully!',
                data: response.data
            };
        }

        return {
            success: false,
            message: response.message || 'Failed to save mobile master page'
        };
    } catch (error) {
        console.error('Error saving mobile master page:', error);
        return {
            success: false,
            message: 'An error occurred while saving the mobile master page'
        };
    }
}

export async function deleteMobileMasterPage(id: number) {
    try {
        const url = `${FACADE}/delete_mobile_master/${id}`;
        const response = await api.delete<any>('sadmin', url);

        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/configuration-setting/mobilemasterpage');
            return {
                success: true,
                message: response.message || 'Record deleted successfully'
            };
        }

        return {
            success: false,
            message: response.message || 'Failed to delete record'
        };
    } catch (error) {
        console.error('Error deleting mobile master page:', error);
        return {
            success: false,
            message: 'An error occurred while deleting the record'
        };
    }
}

export async function getMobileMasterPageById(id: number) {
    try {
        const url = `${FACADE}/get_mobile_master_details_edit_byID/${id}`;
        const response = await api.get<any>('sadmin', url);

        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
            return {
                success: true,
                data: response.data[0] as IMobileMasterPage,
                message: response.message
            };
        }

        return {
            success: false,
            data: null,
            message: response.message || 'Failed to fetch record details'
        };
    } catch (error) {
        console.error('Error fetching mobile master page by ID:', error);
        return {
            success: false,
            data: null,
            message: 'An error occurred while fetching record details'
        };
    }
}
