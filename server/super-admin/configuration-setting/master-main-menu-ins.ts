'use server';

import { api } from '@/lib/apiService';
import { MasterMainMenuINSDTO, InstitutionDTO, ModuleDTO } from '@/types/super-admin/configuration-setting/master-main-menu-ins';

const API_KEY = 'sadmin';

// Reusing specific facade as per pattern
const FACADE = 'MasterInstitutionRoleandModuleMappingFacade';

export async function getInstitutionDropdown() {
    try {
        return await api.get<{ institutionList: InstitutionDTO[] }>(API_KEY, `${FACADE}/get_institution_drop_down`);
    } catch (error: any) {
        console.error("getInstitutionDropdown error:", error);
        return { success: false, message: error.message || 'Failed to fetch institutions', data: null };
    }
}

export async function getModuleDropdown() {
    try {
        const response = await api.get<ModuleDTO[]>(API_KEY, `${FACADE}/get_module_drop_down`);
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

export async function getMainMenuListINS() {
    try {
        interface GridResponse {
            records: MasterMainMenuINSDTO[];
        }

        console.log("Fetching Grid Data for MasterMainMenuINS...");
        // Requesting a large page size to get all records for client-side pagination
        const response = await api.get<GridResponse>(API_KEY, '/InstituteMainMenuFacade/get_onload_institution_menu_list?page_size=10000');
        console.log("MasterMainMenuINS API Response:", JSON.stringify(response, null, 2));

        if (response.success && response.data?.records) {
            return {
                success: true,
                data: {
                    gridDetails: response.data.records
                }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch grid data', data: null };

    } catch (error: any) {
        console.error("getMainMenuListINS error:", error);
        return { success: false, message: error.message || 'Failed to fetch grid data', data: null };
    }
}

export async function deleteMainMenuINS(payload: MasterMainMenuINSDTO) {
    // Placeholder Delete
    try {
        const response = await api.post(API_KEY, `${FACADE}/delete_main_menu_ins`, payload);
        if (response.success) {
            return { success: true, message: 'Deleted successfully' };
        }
        return { success: false, message: 'Failed to delete' };
    } catch (error: any) {
        console.error("deleteMainMenuINS error:", error);
        return { success: false, message: error.message || 'Failed to delete', data: null };
    }
}

export async function saveMainMenuINS(payload: import("@/types/super-admin/configuration-setting/master-main-menu-ins").SaveMainMenuINSRequest) {
    try {
        console.log("Saving Master Main Menu INS Payload:", JSON.stringify(payload, null, 2));
        // Using the Controller root for POST based on MasterRole pattern and user request
        const response = await api.post<any>(API_KEY, '/InstituteMainMenuFacade', payload);
        console.log("Save Response:", JSON.stringify(response, null, 2));

        if (response.success) {
            return { success: true, message: response.message || 'Saved successfully' };
        }
        return { success: false, message: response.message || 'Failed to save' };

    } catch (error: any) {
        console.error("saveMainMenuINS error:", error);
        return { success: false, message: error.message || 'Failed to save', data: null };
    }
}

export async function getModuleMenuList() {
    try {
        interface ModuleMenuResponse {
            records: import("@/types/super-admin/configuration-setting/master-main-menu-ins").MainMenuModuleDTO[];
        }

        console.log("Fetching Module Menu List...");
        const response = await api.get<ModuleMenuResponse>(API_KEY, '/InstituteMainMenuFacade/get_onload_modules_menu_list?page_size=10000');
        console.log("Module Menu Response:", JSON.stringify(response, null, 2));

        if (response.success && response.data?.records) {
            return {
                success: true,
                data: {
                    moduleList: response.data.records
                }
            };
        }
        return { success: false, message: response.message || 'Failed to fetch module list', data: null };

    } catch (error: any) {
        console.error("getModuleMenuList error:", error);
        return { success: false, message: error.message || 'Failed to fetch module list', data: null };
    }
}


