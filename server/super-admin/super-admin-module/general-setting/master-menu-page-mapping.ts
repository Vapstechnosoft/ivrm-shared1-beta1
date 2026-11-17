'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { IMasterMenuPageMapping } from '@/types/super-admin/super-admin-module/general-setting/master-menu-page-mapping';

const FACADE_URL = '/MasterMenuPageMappingFacade';

export async function getOnLoadData(searchParams: any) {
    const page = searchParams?.page || 1;
    const pageSize = searchParams?.page_size || 10;
    const query = getSearchParamsUrl(searchParams);
    const url = `${FACADE_URL}/get_onload_grid?${query}`;

    try {
        const response = await api.get<any>('sadmin', url);

        if (response.success && response.data) {
            const records = response.data.records || [];
            return {
                success: true,
                message: response.message,
                data: {
                    GridDetails: records,
                    modulename: [],
                    pages: []
                },
                total: response.total || records.length,
                page: response.page || page,
                pageSize: response.page_size || pageSize
            };
        }

        return {
            success: false,
            message: response.message || "Failed to fetch data",
            data: { GridDetails: [], modulename: [], pages: [] },
            total: 0
        };
    } catch (error) {
        console.error("Error fetching Master Menu Page Mapping data:", error);
        return {
            success: false,
            message: "Failed to fetch data",
            data: { GridDetails: [], modulename: [], pages: [] },
            total: 0
        };
    }
}

export async function deleteMasterMenuPageMapping(id: number) {
    try {
        const response = await api.post('sadmin', `${FACADE_URL}/delete_master_menu/${id}`, {});
        if (response?.returnval === true) {
            return {
                success: true,
                message: 'Deleted Successfully'
            };
        } else {
            return {
                success: false,
                message: 'Record Already Mapped'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Failed to delete data',
        };
    }
}

export async function saveMasterMenuPageMapping(data: any) {
    const url = `${FACADE_URL}`;
    try {
        const response = await api.post('sadmin', url, data);
        return response;
    } catch (error) {
        return {
            success: false,
            message: 'Failed to save data',
        };
    }
}

export async function getMainMenuDropdown(moduleId: number) {
    const url = `${FACADE_URL}/get_mainmenu_drop_down`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && Array.isArray(response.data)) {
            const allMenus = response.data;
            const filteredMenus = allMenus.filter((item: any) => item.ivrmM_Id === moduleId);
            return {
                ...response,
                data: filteredMenus
            };
        }
        return response;
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch main menu dropdown",
            data: [],
        };
    }
}

export async function getSubMenuDropdown(moduleId: number) {
    const url = `${FACADE_URL}/get_submenu_dropdown`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && Array.isArray(response.data)) {
            const allMenus = response.data;
            // Filter by Module ID to get all submenus for the module
            const filteredMenus = allMenus.filter((item: any) => item.ivrmM_Id === moduleId);

            // Map to ISubMenuDropdownItem format required by frontend
            const mappedMenus = filteredMenus.map((item: any) => ({
                ivrmmS_Id: item.ivrmmM_Id,
                ivrmmS_SubMenuName: item.ivrmmM_MenuName,
                ivrmmM_Id: item.ivrmmM_ParentId
            }));

            return {
                ...response,
                data: mappedMenus
            };
        }
        return response;
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch sub menu dropdown",
            data: [],
        };
    }
}
// ... existing code ...

export async function getModuleDropdown() {
    const url = `${FACADE_URL}/get_module_drop_down`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            return {
                success: true,
                message: response.message,
                data: response.data
            };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch module dropdown",
            data: []
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch module dropdown",
            data: [],
        };
    }
}

export async function getMasterPagesOnChangeSubMenu(subMenuId: number) {
    const url = `${FACADE_URL}/get_masterpage_onchange_submenu/${subMenuId}`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data && Array.isArray(response.data.records)) {
            return {
                success: true,
                message: response.message,
                data: response.data.records,
                total: response.total
            };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch master pages",
            data: [],
            total: 0
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch master pages",
            data: [],
            total: 0
        };
    }
}

export async function getSavedMasterMenuOnChangeSubMenu(moduleId: number, subMenuId: number) {
    const url = `${FACADE_URL}/get_savedmastermenu_onchange_submenu/${moduleId}/${subMenuId}`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data && Array.isArray(response.data.records)) {
            return {
                success: true,
                message: response.message,
                data: response.data.records,
            };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch saved master menus",
            data: [],
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch saved master menus",
            data: [],
        };
    }
}
