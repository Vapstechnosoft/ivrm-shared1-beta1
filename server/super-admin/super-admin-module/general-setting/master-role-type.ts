'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import { IMasterRoleType } from '@/types/super-admin/super-admin-module/general-setting/master-role-type';
import { revalidatePath } from 'next/cache';

export async function getMasterRoleTypes(searchParams: any) {
    const query = getSearchParamsUrl(searchParams);
    const url = `MasterRoleTypeFacade/get_onload_grid_master_role_type?${query}`;

    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            const dataList = response.data.pagesdata || [];
            const mappedData: IMasterRoleType[] = dataList.map((item: any) => ({
                id: item.ivrmrT_Id,
                roleType: item.ivrmrT_Role, // "Role Name"
                name: item.name, // "Role Type"
                masterRoleId: item.id,
                activeFlag: item.activeFlag ?? 1, // Defaulting to 1 if missing in snippet
                createdDate: item.createdDate,
                updatedDate: item.updatedDate
            }));

            return {
                success: true,
                data: mappedData,
                total: response.total || mappedData.length,
                page: response.page || 1,
                page_size: response.page_size || 10
            };
        }
    } catch (error) {
        console.error("Error fetching master role types", error);
    }
    return { success: false, data: [], total: 0, page: 0, page_size: 0 };
}

export async function saveMasterRoleType(data: any) {
    const url = `MasterRoleTypeFacade/`;

    // Ensure masterRoleIds is an array
    const roleIds = Array.isArray(data.masterRoleIds) ? data.masterRoleIds : [];

    if (roleIds.length === 0) {
        return { success: false, message: 'No Role selected' };
    }

    try {
        const promises = roleIds.map((roleId: number, index: number) => {
            // For Edit case: 
            // If data.id exists, use it for the first role in the list to update the existing record.
            // For subsequent roles (multi-select additions), use 0 to create new records.
            const idToUse = (data.id && index === 0) ? data.id : 0;

            const payload = {
                createdDate: new Date().toISOString(),
                updatedDate: new Date().toISOString(),
                ivrmrT_Id: idToUse,
                ivrmrT_Role: data.roleType,
                ivrmR_Id: roleId,
                ivrmrT_RoleFlag: data.institutionType || 'S', // Default 'S'
                flag: "" // Default to empty string as per request body template
            };
            return api.post<any>('sadmin', url, payload);
        });

        const results = await Promise.all(promises);

        // check if any failed
        const failure = results.find(r => !r.success);
        if (failure) {
            return { success: false, message: failure.message || 'Failed to save some records' };
        }

        revalidatePath('/SuperAdmin/super-admin-module/general-setting/master-role-type');
        return { success: true, message: results[0]?.message || 'Saved Successfully' };

    } catch (error) {
        console.error("Error saving master role type", error);
        return { success: false, message: 'An unexpected error occurred' };
    }
}

export async function getMasterRoleTypeById(id: number) {
    const url = `MasterRoleTypeFacade/get_details_editbyid/${id}`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data && response.data.length > 0) {
            // User indicated the API returns a list, so we must find the matching record by PK (ivrmrT_Id)
            const item = response.data.find((r: any) => r.ivrmrT_Id === id) || response.data[0];

            return {
                success: true,
                data: {
                    id: item.ivrmrT_Id,
                    roleType: item.ivrmrT_Role,
                    name: item.name,
                    masterRoleId: item.id,
                    institutionType: item.flag,
                    activeFlag: 1
                }
            };
        }
        return { success: false, message: response.message || 'No data found' };
    } catch (error) {
        console.error("Error fetching master role type details", error);
        return { success: false, message: 'An unexpected error occurred' };
    }
}

export async function activateDeactivateMasterRoleType(id: number) {
    const url = `MasterRoleTypeFacade/activate_deactivate_master_role_type/${id}`;
    try {
        const response = await api.put<any>('sadmin', url, {});
        if (response.success) {
            return { success: true, message: response.message || 'Updated Successfully' };
        }
        return { success: false, message: response.message || 'Failed to update' };
    } catch (error: any) {
        console.error("Error updating master role type status", error);
        return { success: false, message: error?.message || 'An unexpected error occurred during activation/deactivation' };
    }
}

export async function getRoleNameDropdown() {
    const url = `MasterRoleTypeFacade/get_onload_role_name_dropdown`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            return { success: true, data: response.data.roledata || [] };
        }
    } catch (error) {
        console.error("Error fetching role name dropdown", error);
    }
    return { success: false, data: [] };
}
