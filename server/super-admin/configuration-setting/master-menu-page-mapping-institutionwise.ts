'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type {
    InstitutionDTO,
    MainMenuDTO,
    ModuleDTO,
    SubMenuDTO
} from '@/types/super-admin/configuration-setting/master-menu-page-mapping-institutionwise';

const API_KEY = 'sadmin';

// Facades
const FACADE = 'MasterMenuPageMappingInstitutionwiseFacade';

export async function getInstitutionDropdown() {
    try {
        return await api.get<{ institutionList: InstitutionDTO[] }>(API_KEY, `${FACADE}/get_institution_drop_down`);
    } catch (error: any) {
        console.error('getInstitutionDropdown error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to fetch institutions', data: null };
    }
}

export async function getModuleDropdown(mi_id: number) {
    try {
        const response = await api.get<ModuleDTO[]>(API_KEY, `${FACADE}/get_module_drop_down/${mi_id}`);
        if (response.success && Array.isArray(response.data)) {
            return {
                success: true,
                message: response.message,
                data: { moduleList: response.data }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch modules', data: null };
    } catch (error: any) {
        console.error('getModuleDropdown error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to fetch modules', data: null };
    }
}

export async function getMainMenuDropdown(mi_id: number, ivrmm_id: number) {
    try {
        const response = await api.get<MainMenuDTO[]>(API_KEY, `${FACADE}/get_mainmenu_drop_down/${mi_id}/${ivrmm_id}`);

        if (response.success && Array.isArray(response.data)) {
            return {
                success: true,
                message: response.message,
                data: { mainMenuList: response.data }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch main menus', data: null };
    } catch (error: any) {
        console.error('getMainMenuDropdown error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to fetch main menus', data: null };
    }
}

export async function getSubMenuDropdown(mi_id: number, ivrmmm_id: number) {
    try {
        // ivrmmm_id here is the Main Menu ID
        const url = `${FACADE}/get_submenu_drop_down/${mi_id}/${ivrmmm_id}`;

        const response = await api.get<SubMenuDTO[]>(API_KEY, url);

        if (response.success && Array.isArray(response.data)) {
            return {
                success: true,
                message: response.message,
                data: { subMenuList: response.data }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch sub menu list', data: null };
    } catch (error: any) {
        console.error('getSubMenuDropdown error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to fetch sub menu list', data: null };
    }
}

export async function getOnloadGrid(searchParams?: any) {
    try {
        const query = getSearchParamsUrl(searchParams);
        const url = `${FACADE}/get_onload_grid_master_menu_mapping_institute_wise${query ? `?${query}` : ''}`;

        const response = await api.get<any>(API_KEY, url);

        if (response.success) {
            // Priority: response.data.records -> response.data.gridDetails -> response.data.$values -> response.data (if array) -> response.records -> response.gridDetails
            const records =
                response.data?.records ||
                response.data?.gridDetails ||
                response.data?.$values ||
                (Array.isArray(response.data) ? response.data : null) ||
                response.records ||
                response.gridDetails ||
                [];

            return {
                success: true,
                data: { gridDetails: records },
                total: response.total || records.length || 0,
                page: response.page || searchParams?.page || 1,
                pageSize: response.page_size || response.page_Size || searchParams?.page_size || 10
            };
        }
        return { success: false, message: response.message || 'Failed to fetch grid details', data: { gridDetails: [] }, total: 0 };
    } catch (error: any) {
        console.error('getOnloadGrid error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to fetch grid details', data: { gridDetails: [] }, total: 0 };
    }
}

export async function getMasterPageGrid(mi_id: number, ivrmm_id: number, ivrmmmi_id: number) {
    try {
        const url = `${FACADE}/get_onchnage_of_submenu_master_page_grid/${mi_id}/${ivrmm_id}/${ivrmmmi_id}`;
        const response = await api.get<any>(API_KEY, url);

        if (response.success) {
            const records =
                response.data?.records ||
                response.data?.$values ||
                (Array.isArray(response.data) ? response.data : null) ||
                response.records ||
                [];

            return {
                success: true,
                message: response.message,
                data: { masterPages: records }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch master pages', data: { masterPages: [] } };
    } catch (error: any) {
        console.error('getMasterPageGrid error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to fetch master pages', data: { masterPages: [] } };
    }
}

export async function saveMasterMenuPageMapping(payload: any) {
    try {
        const response = await api.post<any>(API_KEY, FACADE, payload);
        if (response.success) {
            return {
                success: true,
                message: response.message || 'Mapping saved successfully'
            };
        }
        return { success: false, message: response.message || 'Failed to save mapping' };
    } catch (error: any) {
        console.error('saveMasterMenuPageMapping error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to save mapping' };
    }
}

export async function getSavedMappingGrid(mi_id: number, ivrmm_id: number, ivrmmmi_id: number) {
    try {
        const url = `${FACADE}/get_onchnage_of_submenu_saved_page_grid/${mi_id}/${ivrmm_id}/${ivrmmmi_id}`;
        const response = await api.get<any>(API_KEY, url);

        if (response.success) {
            const records =
                response.data?.pagesdata ||
                response.data?.records ||
                response.data?.$values ||
                (Array.isArray(response.data) ? response.data : null) ||
                response.records ||
                [];

            return {
                success: true,
                message: response.message,
                data: { savedMappings: records }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch saved mappings', data: { savedMappings: [] } };
    } catch (error: any) {
        console.error('getSavedMappingGrid error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to fetch saved mappings', data: { savedMappings: [] } };
    }
}

export async function getSetOrderList(mi_id: number, ivrmm_id: number, ivrmmmi_id: number) {
    try {
        const url = `${FACADE}/get_onchnage_of_submenu_set_order_list/${mi_id}/${ivrmm_id}/${ivrmmmi_id}`;
        const response = await api.get<any>(API_KEY, url);

        if (response.success) {
            const records =
                response.data?.records ||
                response.data?.$values ||
                (Array.isArray(response.data) ? response.data : null) ||
                response.records ||
                [];

            return {
                success: true,
                message: response.message,
                data: { setOrderList: records }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch set order list', data: { setOrderList: [] } };
    } catch (error: any) {
        console.error('getSetOrderList error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to fetch set order list', data: { setOrderList: [] } };
    }
}

export async function saveSetOrder(payload: any) {
    try {
        console.log('saveSetOrder Payload:', JSON.stringify(payload, null, 2));
        const response = await api.post<any>(API_KEY, `${FACADE}/set_order`, payload);
        console.log('saveSetOrder Response:', JSON.stringify(response, null, 2));
        if (response.success) {
            return {
                success: true,
                message: response.message || 'Order updated successfully'
            };
        }
        return { success: false, message: response.message || 'Failed to update order' };
    } catch (error: any) {
        console.error('saveSetOrder error:', error);
        if (error?.response) {
            console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, message: error.message || 'Failed to update order' };
    }
}

export async function deleteMasterMenuPageMapping(payload: any) {
    try {
        console.log('DEBUG: deleteMasterMenuPageMapping START');

        // We'll try the format that worked in Swagger if the user can provide it,
        // but for now let's try 'delete_saved_records' which is common in other sadmin files.
        const url = `${FACADE}/delete_saved_records`;

        // Ensure we send the array format the user mentioned first
        const body = {
            pageMappingIds: Array.isArray(payload.pageMappingIds) ? payload.pageMappingIds : [payload.ivrmmmpmI_Id || payload.id],
            mi_id: payload.mi_id || payload.MI_Id // Most sadmin APIs require mi_id
        };

        console.log('DEBUG: Request URL:', url);
        console.log('DEBUG: Request Body:', JSON.stringify(body));

        const response = await api.post<any>(API_KEY, url, body);
        console.log('DEBUG: Raw Response from apiService:', JSON.stringify(response, null, 2));

        if (response.success) {
            return {
                success: true,
                message: response.message || 'Mapping deleted successfully'
            };
        }
        return {
            success: false,
            message: response.message || 'Failed to delete mapping',
            data: response
        };
    } catch (error: any) {
        console.error('deleteMasterMenuPageMapping ERROR:', error);
        // If error is an object (Axios error), try to serialize it better for returning
        const detail = error?.response?.data?.message || error?.message || String(error);
        return {
            success: false,
            message: detail,
            error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
        };
    }
}
