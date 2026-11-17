'use server';

import { api } from '@/lib/apiService';
import { InstitutionDTO, ModuleDTO, MainMenuDTO } from '@/types/super-admin/configuration-setting/master-sub-menu-ins';

const API_KEY = 'sadmin';

// Facades
const COMMON_FACADE = 'MasterInstitutionRoleandModuleMappingFacade';
const MENU_FACADE = 'MasterSubMenuFacade'; // Reusing for Main Menu Dropdown
const INST_SUB_FACADE = 'InstituteSubMenuFacade';

export async function getInstitutionDropdown() {
    try {
        return await api.get<{ institutionList: InstitutionDTO[] }>(API_KEY, `${INST_SUB_FACADE}/get_institution_drop_down`);
    } catch (error: any) {
        console.error("getInstitutionDropdown error:", error);
        return { success: false, message: error.message || 'Failed to fetch institutions', data: null };
    }
}

export async function getModuleDropdown(mi_id: number) {
    try {
        const response = await api.get<ModuleDTO[]>(API_KEY, `${INST_SUB_FACADE}/get_module_drop_down/${mi_id}`);
        // Response data is directly the array based on user JSON snippet
        if (response.success && Array.isArray(response.data)) {
            return {
                success: true,
                message: response.message,
                data: { moduleList: response.data }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch modules', data: null };
    } catch (error: any) {
        console.error("getModuleDropdown error:", error);
        return { success: false, message: error.message || 'Failed to fetch modules', data: null };
    }
}

export async function getMainMenuDropdown(mi_id: number, ivrmm_id: number) {
    try {
        const response = await api.get<MainMenuDTO[]>(API_KEY, `${INST_SUB_FACADE}/get_mainmenu_drop_down/${mi_id}/${ivrmm_id}`);

        if (response.success && Array.isArray(response.data)) {
            return {
                success: true,
                message: response.message,
                data: { mainMenuList: response.data }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch main menus', data: null };
    } catch (error: any) {
        console.error("getMainMenuDropdown error:", error);
        return { success: false, message: error.message || 'Failed to fetch main menus', data: null };
    }
}

export async function getSubMenuOnChange(ivrmmm_id: number, mi_id: number) {
    try {
        console.log(`Fetching Sub Menu List for MainMenuID: ${ivrmmm_id}, MI_ID: ${mi_id}`);
        // NOTE: User specified double underscore in 'get_onload__Sub_Menu_onchangeof_mainmenu'
        // Endpoint: /api/InstituteSubMenuFacade/get_onload__Sub_Menu_onchangeof_mainmenu/{ivrmmm_id}/{mi_id}
        const url = `${INST_SUB_FACADE}/get_onload__Sub_Menu_onchangeof_mainmenu/${ivrmmm_id}/${mi_id}`;

        const response = await api.get<{ records: import("@/types/super-admin/configuration-setting/master-sub-menu-ins").SubMenuOnChangeDTO[] }>(API_KEY, url);
        console.log("Sub Menu List Response:", JSON.stringify(response, null, 2));

        if (response.success && response.data?.records) {
            return {
                success: true,
                message: response.message,
                data: { subMenuList: response.data.records }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch sub menu list', data: null };

    } catch (error: any) {
        console.error("getSubMenuOnChange error:", error);
        return { success: false, message: error.message || 'Failed to fetch sub menu list', data: null };
    }
}

export async function saveMasterSubMenuINS(payload: import("@/types/super-admin/configuration-setting/master-sub-menu-ins").SaveSubMenuINSRequest) {
    try {
        console.log("Saving Master Sub Menu INS Payload:", JSON.stringify(payload, null, 2));
        const response = await api.post<any>(API_KEY, `${INST_SUB_FACADE}`, payload);
        console.log("Save Response:", JSON.stringify(response, null, 2));

        if (response.success) {
            return { success: true, message: response.message || 'Saved successfully' };
        }
        return { success: false, message: response.message || 'Failed to save' };

    } catch (error: any) {
        console.error("saveMasterSubMenuINS error:", error);
        return { success: false, message: error.message || 'Failed to save', data: null };
    }
}

export async function getMasterSubMenuINSList(mi_id: number = 0) {
    try {
        let url = `${INST_SUB_FACADE}/get_onload_master_Sub_Menu`;
        if (mi_id > 0) {
            url += `?mi_id=${mi_id}&page_size=10000`;
        } else {
            url += `?page_size=10000`;
        }

        console.log(`Fetching Master Sub Menu INS List. MI_ID: ${mi_id}, URL: ${url}`);
        const response = await api.get<{ records: import("@/types/super-admin/configuration-setting/master-sub-menu-ins").MasterSubMenuINSDTO[] }>(API_KEY, url);

        console.log("Master Sub Menu INS API Response:", JSON.stringify(response, null, 2));

        if (response.success && response.data?.records) {
            return {
                success: true,
                message: response.message,
                data: { gridDetails: response.data.records }
            };
        }

        console.warn("Master Sub Menu INS: No records found or invalid structure");
        return { success: false, message: response.message || 'Failed to fetch grid data', data: null };

    } catch (error: any) {
        console.error("getMasterSubMenuINSList error:", error);
        return { success: false, message: error.message || 'Failed to fetch grid data', data: null };
    }
}

export async function setMasterSubMenuINSOrder(payload: import("@/types/super-admin/configuration-setting/master-sub-menu-ins").SetOrderRequest) {
    try {
        console.log("Setting Master Sub Menu INS Order Payload:", JSON.stringify(payload, null, 2));
        // Reverting to consistent pattern used in this file. 
        // If INST_SUB_FACADE works for other calls, it should work here.
        // User's "/api/..." request likely referred to the full route, but our wrapper handles base URL.
        const response = await api.post<any>(API_KEY, `${INST_SUB_FACADE}/set_order`, payload);
        console.log("Set Order Response:", JSON.stringify(response, null, 2));

        if (response.success) {
            return { success: true, message: response.message || 'Order updated successfully' };
        }
        return { success: false, message: response.message || 'Failed to update order', data: response };
    } catch (error: any) {
        console.error("setMasterSubMenuINSOrder error full object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        if (error?.response) {
            console.error("Error Response Status:", error.response.status);
            console.error("Error Response Data:", JSON.stringify(error.response.data));
        }

        // ApiService throws a string, but we want to see if we can get more info if it was an object before being caught by ApiService?
        // Actually ApiService catch block throws `this.handleError(error)`.
        // So `error` here is ALREADY a string if it came from ApiService.

        // However, if the error happened inside THIS try block (e.g. JSON.stringify or something else), it might be an object.

        let errorMessage = 'Failed to update order';
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error?.message) {
            errorMessage = error.message;
        }

        return { success: false, message: errorMessage, data: null };
    }
}
