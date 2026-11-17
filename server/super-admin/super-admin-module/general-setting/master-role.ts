'use server';

import { api } from '@/lib/apiService';
import { IMasterRole } from '@/types/super-admin/super-admin-module/general-setting/master-role';
import { getSearchParamsUrl } from '@/lib/apiService';

export async function getMasterRoles(searchParams: any) {
    const query = getSearchParamsUrl(searchParams);
    const url = `MasterRoleFacade/get_onload_grid_master_role?${query}`;

    try {
        const response = await api.get<any>('sadmin', url);
        
        if (response.success && response.data) {
            const dataList = response.data.pagesdata || [];
            return {
                success: true,
                data: dataList as IMasterRole[],
                total: response.total || dataList.length,
                page: response.page || 1,
                page_size: response.page_size || 10
            };
        }
    } catch (error) {
        console.error("Error fetching master roles", error);
    }
    return { success: false, data: [], total: 0, page: 0, page_size: 0 };
}

export async function saveMasterRole(data: any) {
    const url = `MasterRoleFacade/`;
    // Payload mapping based on user request
    const payload = {
        ivrmrT_Id: 0, // Default as 0 per request structure implication or extra table
        ivrmrT_Role: data.name, // Assuming Role matches Name or is derived
        ivrmR_Id: data.id || 0,
        ivrmrT_RoleFlag: "", // Default string
        flag: "", // Default string
        normalizedName: data.normalizedName,
        name: data.name
    };

    try {
        const response = await api.post<any>('sadmin', url, payload);
        if (response.success) {
            return { success: true, message: response.message || 'Saved Successfully' };
        } else {
            return { success: false, message: response.message || 'Failed to save' };
        }
    } catch (error) {
        console.error("Error saving master role", error);
        return { success: false, message: 'An unexpected error occurred' };
    }
}

export async function getMasterRoleById(id: number) {
    const url = `MasterRoleFacade/get_details_editbyid/${id}`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data && response.data.length > 0) {
            // API returns array, we need single object. Based on user snippet.
            return { success: true, data: response.data[0] };
        }
    } catch (error) {
        console.error("Error fetching master role details", error);
        return { success: false, message: 'An unexpected error occurred' };
    }
}

export async function deleteMasterRole(id: number) {
    const url = `MasterRoleFacade/activate_deactivate_master_role/${id}`;
    try {
        const response = await api.put<any>('sadmin', url, {});
        if (response.success) {
            return { success: true, message: response.message || 'Updated Successfully' };
        }
        return { success: false, message: response.message || 'Failed to update' };
    } catch (error: any) {
        console.error("Error updating master role status", error);
        return { success: false, message: error?.message || 'An unexpected error occurred during activation/deactivation' };
    }
}
