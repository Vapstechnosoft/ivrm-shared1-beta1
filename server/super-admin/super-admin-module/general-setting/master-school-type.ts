'use server';

import { api } from '@/lib/apiService';
import { revalidatePath } from 'next/cache';

const FACADE_URL = '/MasterBoardandSchoolTypeFacade';

export async function getMasterSchoolTypeData(searchParams: any) {
    const url = `${FACADE_URL}/get_onload_grid`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data) {
            return {
                success: true,
                message: response.message,
                data: response.data.schoolTypeList || [],
                total: response.data.totalRecords
            };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch data",
            data: [],
            total: 0
        };
    } catch (error) {
        console.error("Error fetching onload data:", error);
        return {
            success: false,
            message: "Failed to fetch data",
            data: [],
            total: 0
        };
    }
}

export async function saveMasterSchoolType(data: any) {
    const url = `${FACADE_URL}`;
    try {
        const response = await api.post('sadmin', url, data);
        if (response.success) {
            revalidatePath('/SuperAdmin/super-admin-module/general-setting/master-school-type');
        }
        return response;
    } catch (error) {
        return {
            success: false,
            message: "Failed to save data",
            error: error
        };
    }
}

export async function getMasterSchoolTypeDetails(id: number) {
    const url = `${FACADE_URL}/get_edit_details_by_id/${id}`;
    try {
        const response = await api.get<any>('sadmin', url);
        if (response.success && response.data && Array.isArray(response.data.schoolTypeList)) {
            return {
                success: true,
                message: response.message,
                data: response.data.schoolTypeList[0]
            };
        }
        return {
            success: false,
            message: response.message || "Failed to fetch details",
            data: null
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch details",
            data: null
        };
    }
}

export async function deleteMasterSchoolType(id: number) {
    const url = `${FACADE_URL}/delete_master_school_type/${id}`;
    try {
        const response = await api.post('sadmin', url, {});
        if (response.success || response.returnval === true) {
            revalidatePath('/SuperAdmin/super-admin-module/general-setting/master-school-type');
        }
        return response;
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete data",
        };
    }
}


