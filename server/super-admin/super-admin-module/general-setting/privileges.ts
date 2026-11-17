'use server';

import { api } from '@/lib/apiService';
import { revalidatePath } from 'next/cache';

const FACADE = 'MasterRolePreviledgeFacade';

export async function getRoleDropdown() {
    const url = `${FACADE}/get_role_dropdown`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            return {
                success: true,
                roles: response.data.fillroletype || []
            };
        }
    } catch (error) {
        console.error("Error fetching role dropdown", error);
    }
    return { success: false, roles: [] };
}



const PageMappingFacade = 'MasterPageModuleMappingFacade';

export async function getModulesList() {
    const url = `${PageMappingFacade}/get_saved_pages_mapping_list_onchange_of_modulename`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            return {
                success: true,
                modules: response.data || []
            };
        }
    } catch (error) {
        console.error("Error fetching modules list", error);
    }
    return { success: false, modules: [] };
}

export async function getModuleDropdown() {
    const url = `${FACADE}/get_module_dropdown`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            return {
                success: true,
                modules: response.data.fillmodulepagesdata || []
            };
        }
    } catch (error) {
        console.error("Error fetching module dropdown", error);
    }
    return { success: false, modules: [] };
}

export async function getOnLoadData() {
    // Keeping this for modules if needed, or we might retire it if modules have specific API
    const url = `${FACADE}/get_onload`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            return {
                success: true,
                roles: response.data.fillroletype || [],
                modules: response.data.modpages || []
            };
        }
    } catch (error) {
        console.error("Error fetching onload data", error);
    }
    return { success: false, roles: [], modules: [] };
}

export async function searchPages(data: any) {
    const url = `${FACADE}/getpagesname`;
    try {
        const response = await api.post<any>('sadmin', url, data);
        if (response.success && response.data) {
            return {
                success: true,
                pages: response.data.grid1 || [], // Legacy grid1
                savedPrivileges: response.data.previousgrid || [] // Legacy previousgrid
            };
        }
    } catch (error) {
        console.error("Error searching pages", error);
    }
    return { success: false, pages: [], savedPrivileges: [] };
}

export async function savePrivileges(data: any) {
    const url = `${FACADE}/savadata`;
    try {
        const response = await api.post<any>('sadmin', url, data);
        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/general-setting/privileges');
            return { success: true, message: response.message || 'Saved Successfully' };
        }
        return { success: false, message: response.message || 'Failed to save' };
    } catch (error) {
        console.error("Error saving privileges", error);
        return { success: false, message: 'An unexpected error occurred' };
    }
}

export async function deletePrivilege(data: any) {
    const url = `${FACADE}/deletesecondgriddata`; // Use legacy endpoint name if possible, or standard delete
    try {
        // Legacy 'deletesecondgriddata' implies deleting from cart or DB? 
        // HTML 'deletesecondgriddata' removes from UI grid. 
        // 'deletrec' removes from DB (Rolewise Module Page list - Grid 4).

        // Let's implement 'deletrec' equivalent for DB deletion
        const deleteUrl = `${FACADE}/deletrec`;
        const response = await api.post<any>('sadmin', deleteUrl, data);

        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/general-setting/privileges');
            return { success: true, message: response.message || 'Deleted Successfully' };
        }
        return { success: false, message: response.message || 'Failed to delete' };
    } catch (error) {
        console.error("Error deleting privilege", error);
        return { success: false, message: 'An unexpected error occurred' };
    }
}

export async function getRolePrivilegesList(searchParams: any) {
    const query = new URLSearchParams(searchParams).toString();
    const url = `MasterRolePreviledgeFacade/get_onload_grid_master_priviledge?${query}`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            return {
                success: true,
                data: response.data.thirdgriddata || [],
                total: response.total || 0,
                page: response.page || 1,
                page_size: response.page_size || 10
            };
        }
    } catch (error) {
        console.error("Error fetching role privileges list", error);
    }
    return { success: false, data: [], total: 0, page: 0, page_size: 10 };
}
