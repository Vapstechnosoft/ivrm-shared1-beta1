'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { masterSubMenuSchema } from '@/schemas/super-admin/super-admin-module/general-setting/master-sub-menu';
import { IMasterSubMenu, IModuleDropdownItem, IMainMenuDropdownItem } from '@/types/super-admin/super-admin-module/general-setting/master-sub-menu';
import { revalidatePath } from 'next/cache';

const FACADE_URL = '/MasterSubMenuFacade'; // Assumed FACADE URL based on convention

export async function getMasterSubMenuData(searchParams: any) {
    const page = searchParams?.page || 1;
    const pageSize = searchParams?.page_size || 10;
    const query = getSearchParamsUrl(searchParams);
    const url = `${FACADE_URL}/get_onload_grid_master_sub_menu?${query}`;
    try {
        const response = await api.get<any>('sadmin', url);

        if (response.success && response.data) {
            const rawRecords = response.data?.pagesdata || [];
            const records = rawRecords.map((record: any) => ({
                ...record,
                ivrmmS_Id: record.ivrmmM_Id, // API returns SubMenuID as ivrmmM_Id in this grid
                ivrmmS_SubMenuName: record.subMenuName,
                ivrmmS_Order: record.ivrmmM_MenuOrder,
                mainMenuName: record.ivrmmM_MenuName // For column display
            }));

            return {
                success: true,
                message: response.message,
                data: records,
                total: response.total || records.length,
                page: response.page || page,
                pageSize: response.page_size || pageSize
            };
        }

        return response;
    } catch (error) {
        console.error("Error fetching Master Sub Menu data:", error);
        return {
            success: false,
            message: "Failed to fetch data",
            data: [],
        };
    }
}

export async function saveMasterSubMenu(data: any) {
    const validation = masterSubMenuSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            message: 'Validation failed',
            errors: validation.error.flatten().fieldErrors,
        };
    }

    const url = `/MasterSubMenuFacade`;

    // Map form data to API payload
    const payload = {
        ivrmmM_Id: data.ivrmmS_Id || 0, // Sub Menu ID (PK)
        ivrmM_Id: data.ivrmM_Id,
        ivrmmM_ParentId: data.ivrmmM_Id, // Main Menu ID (Parent)
        ivrmmM_MenuName: data.ivrmmS_SubMenuName,
        ivrmmM_MenuOrder: parseInt(data.ivrmmS_Order as string), // Ensure number
        ivrmmM_PageNonPageFlag: true
    };

    console.log("Saving Master Sub Menu Payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await api.post('sadmin', url, payload);
        console.log("Save Response:", response);
        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/general-setting/master-sub-menu');
        }
        return response;
    } catch (error) {
        console.error("Save Error:", error);
        return {
            success: false,
            message: 'Failed to save data. Check server logs.',
            error: error
        };
    }
}

export async function deleteMasterSubMenu(id: number) {
    try {
        const response = await api.post('sadmin', `${FACADE_URL}/delete_master_sub_menu/${id}`, {});
        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/general-setting/master-sub-menu');
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

export async function getMainMenuDropdown(moduleId: number) {
    const url = `${FACADE_URL}/get_main_menu_drop_down`;
    try {
        const response = await api.get<IMainMenuDropdownItem[]>('sadmin', url);

        // API returns all menus, so we filter by moduleId
        if (response.success && Array.isArray(response.data)) {
            const allMenus = response.data;
            const filteredMenus = allMenus.filter((item: IMainMenuDropdownItem) => item.ivrmM_Id === moduleId);
            return {
                ...response,
                data: filteredMenus
            };
        }

        return response;
    } catch (error) {
        console.error("Error fetching Main Menu Dropdown:", error);
        return {
            success: false,
            message: "Failed to fetch main menu dropdown",
            data: [],
        };
    }
}

export async function getMasterSubMenuDetails(id: number) {
    const url = `${FACADE_URL}/get_edit_detailsby_id/${id}`;
    try {
        const response = await api.get<any>('sadmin', url);
        return response;
    } catch (error) {
        console.error("Error fetching Master Sub Menu details:", error);
        return {
            success: false,
            message: "Failed to fetch details",
        };
    }
}
