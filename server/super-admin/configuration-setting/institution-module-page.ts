'use server';

import { api } from '@/lib/apiService';
import { InstitutionDTO, ModuleDTO, RoleDTO, InstitutionRolePrivilegeDTO, PageDTO } from '@/types/super-admin/configuration-setting/institution-module-page';

const API_KEY = 'sadmin';

// ... (existing code)

export async function getPageList(moduleId: number) {
    try {
        interface PageListResponse {
            totalRecords: number;
            page: number;
            pageSize: number;
            records: PageDTO[];
        }

        const response = await api.get<PageListResponse>(API_KEY, `MasterInstitutionRoleandModuleMappingFacade/get_page_list_onchange_module/${moduleId}`);
        console.log("getPageList API Response:", JSON.stringify(response, null, 2));

        if (response.success && response.data?.records) {
            return {
                success: true,
                data: {
                    pageList: response.data.records
                }
            };
        }

        return { success: false, message: response.message || 'Failed to fetch page list', data: null };

    } catch (error: any) {
        console.error("getPageList error:", error);
        return { success: false, message: error.message || 'Failed to fetch page list', data: null };
    }
}

// ... (existing imports)

export async function saveInstitutionRolePrivileges(payload: any) {
    try {
        const response = await api.post(API_KEY, 'MasterInstitutionRoleandModuleMappingFacade/', payload);
        console.log("saveInstitutionRolePrivileges API Response:", JSON.stringify(response, null, 2));

        if (response.success) {
            return { success: true, message: response.message || 'Saved successfully' };
        }
        return { success: false, message: response.message || 'Failed to save' };

    } catch (error: any) {
        console.error("saveInstitutionRolePrivileges error:", error);
        return { success: false, message: error.message || 'Failed to save' };
    }
}

export async function getInstitutionDropdown() {
    try {
        return await api.get<{ institutionList: InstitutionDTO[] }>(API_KEY, 'MasterInstitutionRoleandModuleMappingFacade/get_institution_drop_down');
    } catch (error: any) {
        console.error("getInstitutionDropdown error:", error);
        return { success: false, message: error.message || 'Failed to fetch institutions', data: null };
    }
}

export async function deleteInstitutionRolePrivileges(payload: any) {
    try {
        console.log("deleteInstitutionRolePrivileges Payload Sent to API:", JSON.stringify(payload, null, 2));
        const response = await api.post(API_KEY, 'MasterInstitutionRoleandModuleMappingFacade/delete_saved_records', payload);
        console.log("deleteInstitutionRolePrivileges API Response:", JSON.stringify(response, null, 2));

        if (response.success) {
            return { success: true, message: response.message || 'Deleted successfully' };
        }
        return { success: false, message: response.message || 'Failed to delete' };

    } catch (error: any) {
        console.error("deleteInstitutionRolePrivileges error:", error);
        return { success: false, message: error.message || 'Failed to delete' };
    }
}

export async function getModuleDropdown() {
    try {
        // Updated to use the correct facade provided by user: MasterInstitutionRoleandModuleMappingFacade
        // Response is an array, so we map it to { moduleList: ... } to match frontend expectation
        const response = await api.get<ModuleDTO[]>(API_KEY, 'MasterInstitutionRoleandModuleMappingFacade/get_module_drop_down');

        if (response.success && Array.isArray(response.data)) {
            return {
                success: true,
                message: response.message,
                data: { moduleList: response.data },
                total: response.total,
                page: response.page,
                page_Size: response.page_Size
            };
        }

        return { success: false, message: response.message || 'Failed to fetch modules', data: null, page: 0, total: 0, page_Size: 0 };
    } catch (error: any) {
        console.error("getModuleDropdown error:", error);
        return { success: false, message: error.message || 'Failed to fetch modules', data: null, page: 0, total: 0, page_Size: 0 };
    }
}

export async function getRoleDropdown() {
    try {
        // Updated to use the correct facade provided by user: MasterInstitutionRoleandModuleMappingFacade
        const response = await api.get<{ roleList: RoleDTO[] }>(API_KEY, 'MasterInstitutionRoleandModuleMappingFacade/get_role_drop_down');

        if (response.success && response.data?.roleList) {
            return {
                success: true,
                message: response.message,
                data: { roleList: response.data.roleList },
                total: response.total,
                page: response.page,
                page_Size: response.page_Size
            };
        }
        return { success: false, message: response.message || 'Failed to fetch roles', data: null, page: 0, total: 0, page_Size: 0 };

    } catch (error: any) {
        console.error("getRoleDropdown error:", error);
        return { success: false, message: error.message || 'Failed to fetch roles', data: null, page: 0, total: 0, page_Size: 0 };
    }
}

export async function getInstitutionRolePrivileges() {
    try {
        // Using endpoint provided by user
        interface GridResponse {
            totalRecords: number;
            page: number;
            pageSize: number;
            records: InstitutionRolePrivilegeDTO[];
        }

        const response = await api.get<GridResponse>(API_KEY, 'MasterInstitutionRoleandModuleMappingFacade/get_onload_grid_seach_list');
        console.log("getInstitutionRolePrivileges API Response:", JSON.stringify(response, null, 2));

        if (response.success && response.data?.records) {
            console.log("Mapped Records:", response.data.records.length);
            return {
                success: true,
                message: response.message,
                data: {
                    institutionRolePrivilegesList: response.data.records
                },
                total: response.data.totalRecords,
                page: response.data.page,
                page_Size: response.data.pageSize
            };
        }

        console.warn("API succeeded but no records found or success false:", response);
        return { success: false, message: response.message || 'Failed to fetch grid data', data: null, page: 0, total: 0, page_Size: 0 };

    } catch (error: any) {
        console.error("getInstitutionRolePrivileges error:", error);
        return { success: false, message: error.message || 'Failed to fetch grid data', data: null, page: 0, total: 0, page_Size: 0 };
    }
}
