'use server';

import { api } from '@/lib/apiService';
import { masterMainMenuSchema } from '@/schemas/super-admin/super-admin-module/general-setting/master-main-menu';
import { IMasterMainMenu, IModuleDropdownItem } from '@/types/super-admin/super-admin-module/general-setting/master-main-menu';
import { revalidatePath } from 'next/cache';

const FACADE_URL = '/MasterMainMenuFacade';

export async function getMasterMainMenuData(page: number = 1, pageSize: number = 10) {
    // URL provided by user
    // Using query parameters for pagination as path-based failed
    const url = `${FACADE_URL}/get_onload_grid_master_main_menu?page=${page}&page_size=${pageSize}`;
    console.log("Fetching Master Main Menu data from URL:", url); // Debug log

    try {
        const response = await api.get<any>('sadmin', url);
        console.log("MasterMainMenu Onload Response:", JSON.stringify(response)); // Debug log

        // Handle the specific response structure provided by user
        if (response.success) {
            // Support both data.records and data as array, just in case
            const records = response.data?.records || (Array.isArray(response.data) ? response.data : []);

            return {
                success: true,
                message: response.message,
                data: records,
                total: response.total || records.length,
                page: response.page,
                pageSize: response.page_size
            };
        }

        return response;
    } catch (error: any) {
        console.error("Error fetching Master Main Menu data:", error);
        return {
            success: false,
            message: error?.message || "Failed to fetch data",
            data: [],
        };
    }
}

export async function saveMasterMainMenu(data: any) {
    const validation = masterMainMenuSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            message: 'Validation failed',
            errors: validation.error.flatten().fieldErrors,
        };
    }

    // URL provided by user
    const url = `${FACADE_URL}`;

    try {
        // Construct payload as per user request
        const payload = {
            ivrmmM_Id: data.ivrmmM_Id || 0,
            ivrmM_Id: Number(data.ivrmM_Id),
            ivrmmM_MenuName: data.ivrmmM_MenuName,
        };



        console.log("Saving Master Main Menu with payload:", JSON.stringify(payload));

        const response = await api.post('sadmin', url, payload);
        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/general-setting/master-main-menu');
        }
        return response;

    } catch (error: any) {
        console.error("Save Error:", error);

        let errorMessage = 'Failed to save data';
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error?.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = JSON.stringify(error.response.data);
            }
        } else if (error?.message) {
            errorMessage = error.message;
        }

        console.log("Error Message:", errorMessage);

        return {
            success: false,
            message: errorMessage,
            error: error
        };
    }
}

export async function deleteMasterMainMenu(id: number) {
    try {
        const response = await api.post('sadmin', `${FACADE_URL}/delete_master_main_menu/${id}`, {});
        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/general-setting/master-main-menu');
        }
        return response;
    } catch (error) {
        return {
            success: false,
            message: 'Failed to delete data',
        };
    }
}

export async function getModuleDropdown() {
    const url = `${FACADE_URL}/get_module_drop_down`;
    try {
        const response = await api.get<IModuleDropdownItem[]>('sadmin', url);
        return response;
    } catch (error) {
        console.error("Error fetching Module Dropdown:", error);
        return {
            success: false,
            message: "Failed to fetch module dropdown",
            data: [],
        };
    }
}

export async function getMasterMainMenuDetails(id: number) {
    const url = `${FACADE_URL}/get_edit_detailsby_id/${id}`;
    try {
        const response = await api.get<any>('sadmin', url);
        return response; // allowing the component to handle the specific structure for now as it handles multiple variants
    } catch (error) {
        console.error("Error fetching Master Main Menu details:", error);
        return {
            success: false,
            message: "Failed to fetch details",
        };
    }
}
