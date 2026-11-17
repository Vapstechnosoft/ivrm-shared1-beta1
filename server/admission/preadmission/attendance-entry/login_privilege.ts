'use server';

import { api } from '@/lib/apiService';
import type { ILoginPrivilegeDTO } from '@/types/admission/preadmission/login_privilege';

const CONTROLLER = 'LoginPrivelege';

export async function getLoginPrivileges() {
    try {
        const res = await api.post<any>('admission', `/${CONTROLLER}/GetStaffWiseGrid`, {});
        // Ensure we return the array if wrapped in a data property
        // Common pattern: res.data might be the array, or res itself.
        // apiService usually returns response.data, so 'res' here is the response body.
        // Check if $values or similar exists
        return res?.data || res || [];
    } catch (error) {
        console.error('Error fetching login privileges:', error);
        return [];
    }
}

export async function saveLoginPrivilege(data: ILoginPrivilegeDTO) {
    try {
        return await api.post('admission', `/${CONTROLLER}/SaveLoginPrivilege`, data);
    } catch (error) {
        console.error('Error saving login privilege:', error);
        throw error;
    }
}

export async function deleteLoginPrivilege(id: number) {
    try {
        // Assuming delete uses query param.
        return await api.delete('admission', `/${CONTROLLER}/DeleteAttPrivileges?id=${id}`);
    } catch (error) {
        console.error('Error deleting login privilege:', error);
        throw error;
    }
}

export async function getEmployeeData(data: any) {
    try {
        return await api.post('admission', `/${CONTROLLER}/GetEmployeeData`, data);
    } catch (error) {
        console.error('Error fetching employee data:', error);
        return [];
    }
}

export async function getEditData(id: number) {
    try {
        return await api.post('admission', `/${CONTROLLER}/GetEditData`, { id });
    } catch (error) {
        console.error('Error fetching edit data:', error);
        return null;
    }
}

export async function getDataByTypeSelected(data: any) {
    try {
        const queryParams = new URLSearchParams(data).toString();
        return await api.post('admission', `/${CONTROLLER}/GetDataByTypeSelected?${queryParams}`, {});
    } catch (error) {
        console.error('Error fetching data by type:', error);
        return [];
    }
}

export async function getStaffWiseGrid(asmayId: number, entryType: number, hrmeId: number) {
    try {
        const queryParams = `ASMAY_Id=${asmayId}&ASALU_EntryTypeFlag=${entryType}&HRME_Id=${hrmeId}`;
        const res = await api.post<any>('admission', `/${CONTROLLER}/GetStaffWiseGrid?${queryParams}`, {});
        return res?.data || res || {};
    } catch (error) {
        console.error('Error fetching staff wise grid:', error);
        return {};
    }
}

export async function deleteAttPrivileges(asalucId: number, asalucsId: number) {
    try {
        const queryParams = `ASALUC_Id=${asalucId}&ASALUCS_Id=${asalucsId}`;
        return await api.delete('admission', `/${CONTROLLER}/DeleteAttPrivileges?${queryParams}`);
    } catch (error) {
        console.error('Error deleting privilege:', error);
        throw error;
    }
}
