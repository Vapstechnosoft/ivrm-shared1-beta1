'use server';

import { api } from '@/lib/apiService';
import type {
    IMasterPageRecord,
    IMobilePrivilegeRecord,
    InstitutionDropdown,
    RoleDropdown
} from '@/types/super-admin/configuration-setting/mobileroleprivileges';
import { revalidatePath } from 'next/cache';

const FACADE = 'Mobile_role_priviledges';

export async function getInstitutionDropdown() {
    try {
        // Try the specific facade first
        const url = `${FACADE}/get_institution_drop_down`;
        const response = await api.get<any>('sadmin', url);

        if (response && (response.success || response.data || response.institutionList)) {
            // Priority: response.data.institutionList -> response.institutionList -> response.data -> response
            const list =
                response.data?.institutionList ||
                response.institutionList ||
                response.data?.institutionDropDown ||
                response.institutionDropDown ||
                (Array.isArray(response.data) ? response.data : null) ||
                (Array.isArray(response) ? response : null);

            if (list && Array.isArray(list)) {
                return {
                    success: true,
                    data: list as InstitutionDropdown[],
                    message: response.message || 'Institutions fetched successfully'
                };
            }
        }

        return {
            success: false,
            data: [],
            message: response?.message || 'Failed to fetch institutions'
        };
    } catch (error) {
        console.error('Error fetching mobile institution dropdown:', error);
        return {
            success: false,
            data: [],
            message: 'An error occurred while fetching institutions'
        };
    }
}

export async function getRoleNameDropdown() {
    try {
        const url = `${FACADE}/get_role_name_down`;
        const response = await api.get<any>('sadmin', url);

        if (response && (response.success || response.data || response.roleTypeList)) {
            const list =
                response.data?.roleTypeList ||
                response.roleTypeList ||
                response.data?.roles ||
                response.roles ||
                response.data?.fillroletype ||
                response.fillroletype ||
                (Array.isArray(response.data) ? response.data : null) ||
                (Array.isArray(response) ? response : null);

            if (list && Array.isArray(list)) {
                return {
                    success: true,
                    data: list as RoleDropdown[],
                    message: response.message || 'Roles fetched successfully'
                };
            }
        }

        return {
            success: false,
            data: [],
            message: response?.message || 'Failed to fetch roles'
        };
    } catch (error) {
        console.error('Error fetching mobile role dropdown:', error);
        return {
            success: false,
            data: [],
            message: 'An error occurred while fetching roles'
        };
    }
}

export async function getOnLoadData() {
    try {
        const url = `${FACADE}/get_onload`;
        const [onloadRes, instRes, roleRes] = await Promise.all([
            api.get<any>('sadmin', url).catch((err) => ({ success: false, data: null, message: err.message })),
            getInstitutionDropdown(),
            getRoleNameDropdown()
        ]);

        const institutions =
            instRes.success && instRes.data?.length
                ? instRes.data
                : onloadRes.data?.institutionDropDown || onloadRes.data?.institutionList || [];

        const roles =
            roleRes.success && roleRes.data?.length
                ? roleRes.data
                : onloadRes.data?.roles || onloadRes.data?.roleList || onloadRes.data?.fillroletype || [];

        return {
            success: true,
            institutions,
            roles,
            message: onloadRes.message || instRes.message || roleRes.message
        };
    } catch (error) {
        console.error('Error fetching mobile role privileges onload data:', error);
        return {
            success: false,
            institutions: [],
            roles: [],
            message: 'An error occurred while fetching onload data'
        };
    }
}

export async function getPages(mi_id: number, ivrmrT_id: number) {
    try {
        const url = `${FACADE}/getpagesname`;
        const payload = {
            MI_Id: mi_id,
            IVRMRT_Id: ivrmrT_id
        };

        const response = await api.post<any>('sadmin', url, payload);

        if (response.success && response.data) {
            return {
                success: true,
                availablePages: response.data.availablePages || [],
                savedPrivileges: response.data.savedPrivileges || [],
                message: response.message
            };
        }

        return {
            success: false,
            availablePages: [],
            savedPrivileges: [],
            message: response.message || 'Failed to fetch pages'
        };
    } catch (error) {
        console.error('Error fetching pages for mobile role privileges:', error);
        return {
            success: false,
            availablePages: [],
            savedPrivileges: [],
            message: 'An error occurred while fetching pages'
        };
    }
}

export async function savePrivileges(payload: any) {
    try {
        const url = `${FACADE}`;
        const response = await api.post<any>('sadmin', url, payload);

        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/configuration-setting/mobileroleprivileges');
            return {
                success: true,
                message: response.message || 'Privileges saved successfully'
            };
        }

        return {
            success: false,
            message: response.message || 'Failed to save privileges'
        };
    } catch (error) {
        console.error('Error saving mobile role privileges:', error);
        return {
            success: false,
            message: 'An error occurred while saving'
        };
    }
}

export async function deletePrivilege(id: number) {
    try {
        const url = `${FACADE}/delete_mobile_priviledge/${id}`;
        const response = await api.delete<any>('sadmin', url);

        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/configuration-setting/mobileroleprivileges');
            return {
                success: true,
                message: response.message || 'Privilege deleted successfully'
            };
        }

        return {
            success: false,
            message: response.message || 'Failed to delete privilege'
        };
    } catch (error) {
        console.error('Error deleting mobile role privilege:', error);
        return {
            success: false,
            message: 'An error occurred while deleting'
        };
    }
}

export async function getOnLoadGrid(page: number, pageSize: number, search = '') {
    try {
        const url = `${FACADE}/get_onload_grid_mobile_priviledge?page=${page}&page_size=${pageSize}&search_query=${search}`;
        const response = await api.get<any>('sadmin', url);

        if (response.success && response.data) {
            return {
                success: true,
                data: (response.data.records || []) as IMobilePrivilegeRecord[],
                total: response.total || 0,
                message: response.message
            };
        }

        return {
            success: false,
            data: [],
            total: 0,
            message: response.message || 'Failed to fetch privilege grid'
        };
    } catch (error) {
        console.error('Error fetching mobile role privileges grid:', error);
        return {
            success: false,
            data: [],
            total: 0,
            message: 'An error occurred while fetching grid'
        };
    }
}

export async function getMasterPagesGlobalGrid(page: number, pageSize: number, search = '') {
    try {
        const url = `${FACADE}/get_onchange_grid_masterpage?page=${page}&page_size=${pageSize}&search_query=${search}`;
        const response = await api.get<any>('sadmin', url);

        if (response.success && response.data) {
            return {
                success: true,
                data: (response.data.records || []) as IMasterPageRecord[],
                total: response.total || 0,
                message: response.message
            };
        }

        return {
            success: false,
            data: [],
            total: 0,
            message: response.message || 'Failed to fetch global master pages'
        };
    } catch (error) {
        console.error('Error fetching global master pages grid:', error);
        return {
            success: false,
            data: [],
            total: 0,
            message: 'An error occurred while fetching global master pages'
        };
    }
}
