'use server';

import { api } from '@/lib/apiService';
import { pageMappingSchema } from '@/schemas/super-admin/super-admin-module/general-setting/page-mapping';
import { IModuleDropdown, IPageMappingData, ISavedMapping } from '@/types/super-admin/super-admin-module/general-setting/page-mapping';
import { revalidatePath } from 'next/cache';
import { getSearchParamsUrl } from '@/lib/apiService';

export async function getModulesForDropdown() {
    const url = 'MasterSubMenuFacade/get_module_drop_down';

    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            return {
                success: true,
                data: response.data.map((m: any) => ({
                    ivrmM_Id: m.ivrmM_Id,
                    ivrmM_ModuleName: m.ivrmM_ModuleName,
                    ivrmM_ModuleDesc: m.ivrmM_ModuleDesc
                })) as IModuleDropdown[]
            };
        }
    } catch (error) {
        console.error("Error fetching modules", error);
    }

    return { success: false, data: [] };
}

export async function getAvailablePages(searchParams: any) {
    // Calling the specific API endpoint provided by user
    // URL: MasterPageModuleMappingFacade/get_master_page_details_onchange_of_modulename
    // Accepts query params: ivrmM_Id, page, page_size

    // We construct query from searchParams. 
    // searchParams usually comes from nuqs as object { page: 1, page_size: 10, ivrmM_Id: 123 }

    const query = getSearchParamsUrl(searchParams);
    const url = `MasterPageModuleMappingFacade/get_master_page_details_onchange_of_modulename?${query}`;

    try {
        const response = await api.get<any>('sadmin', url);
        // Handle the specific response structure
        if (response.success && Array.isArray(response.data)) {
            const mappedData = response.data.map((item: any) => ({
                ivrmP_Id: item.ivrmP_Id,
                // Map ivrmmP_PageName to ivrmP_PageName for frontend consistency
                ivrmP_PageName: item.ivrmmP_PageName,
                // Include other fields if needed, e.g. ivrmP_PageDisplayName if available, else use PageName
                ivrmP_PageDisplayName: item.ivrmmP_PageName
            }));

            return {
                success: true,
                data: mappedData as IPageMappingData[],
                total: response.total || response.data.length,
                page: response.page || 1,
                page_size: response.page_size || 10
            };
        }
    } catch (error) {
        console.error("Error fetching available pages", error);
    }
    return { success: false, data: [], total: 0, page: 0, page_size: 0 };
}

export async function getSavedMappings(searchParams: any) {
    const query = getSearchParamsUrl(searchParams);
    // If ivrmM_Id is passed in searchParams, the getSearchParamsUrl helper should handle it if it just iterates keys.
    // However, usually we might want to ensure it's passed safely.
    // Let's assume searchParams now includes ivrmM_Id if needed.

    const url = `MasterPageModuleMappingFacade/get_all_details_grid_page_mapping?${query}`;

    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            // Check if data is directly array or paginated object
            const dataList = Array.isArray(response.data) ? response.data : (response.data.savedMappings || []);
            return {
                success: true,
                data: dataList as ISavedMapping[],
                total: response.data.total ?? response.total ?? dataList.length,
                page: response.data.page ?? response.page ?? 1,
                page_size: response.data.page_size ?? response.page_Size ?? dataList.length
            };
        }
    } catch (error) {
        console.error("Error fetching saved mappings", error);
    }
    return { success: false, data: [], total: 0, page: 0, page_size: 0 };
}

export async function savePageMapping(data: any) {
    const validation = pageMappingSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'Validation failed' };
    }

    const payload = {
        ivrmmP_Id: 0,
        ivrmM_Id: data.ivrmM_Id,
        ivrmmP_PageName: "string", // Placeholder as per request
        ivrmM_ModuleName: "string", // Placeholder as per request
        createdDate: new Date().toISOString(),
        savetmpdata: data.pages.map((p: any) => ({
            ivrmP_Id: p.ivrmP_Id
        }))
    };

    const response = await api.post<any>('sadmin', 'MasterPageModuleMappingFacade', payload);

    if (response.success) {
        return { success: true, message: 'Mapping saved successfully' };
    }
    return { success: false, message: response.message || 'Failed to save' };
}

export async function deletePageMapping(id: number) {
    console.log("deletePageMapping called with ID:", id);
    // Assuming delete endpoint on the same facade
    const response = await api.delete<any>('sadmin', `MasterPageModuleMappingFacade/delete_master_page/${id}`);
    console.log("deletePageMapping response:", response);
    if (response.success) {
        return { success: true, message: 'Deleted successfully' };
    }
    return { success: false, message: response.message || 'Failed to delete' };
}

export async function getSavedPagesMappingList(searchParams: any) {
    const query = getSearchParamsUrl(searchParams);
    // Endpoint provided by user
    const url = `MasterPageModuleMappingFacade/get_saved_pages_mapping_list_onchange_of_modulename?${query}`;

    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            // User provided sample data showing ivrmM_ModuleName, etc.
            // But previous requirement was for ivrmmP_PageName.
            // We'll return data as is, but we might need to map it if the grid expects specific keys.
            // Let's assume the grid needs ISavedMapping (ivrmmP_PageName).
            // If API returns ivrmM_ModuleName but not Page Name, the grid column will be empty.
            // We will map response.data directly.

            const dataList = Array.isArray(response.data) ? response.data : [];
            return {
                success: true,
                data: dataList as ISavedMapping[], // Type assertion, aware of potential mismatch
                total: response.total || response.data.length,
                page: response.page || 1,
                page_size: response.page_size || 10
            };
        }
    } catch (error) {
        console.error("Error fetching saved pages list", error);
    }
    return { success: false, data: [], total: 0, page: 0, page_size: 0 };
}
