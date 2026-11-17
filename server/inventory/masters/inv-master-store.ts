'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvMasterStore, IEmployeeDropdown } from '@/types/inventory/masters/inv-master-store';

export async function getInvMasterStore(searchParams?: ApiSearchparams) {
    console.log("getInvMasterStore: TRIGGERED (POST Mode).");
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    // URLs - appended query string because C# [FromQuery] reads from URL even on POST
    const storeListUrl = `/INV_MasterStoreFacade/GetStoreList?${urlParams}`;
    const employeeListUrl = `/INV_MasterStoreFacade/GetEmployeeList`;

    try {
        const [storeResponse, employeeResponse] = await Promise.all([
            api.post<any>('inventory', storeListUrl, {}),
            api.post<any>('inventory', employeeListUrl, {})
        ]);

        if (storeResponse.success === false && storeResponse.total === 0) {
            return {
                success: true,
                data: {
                    get_store: [],
                    empname_list: [],
                    total: 0
                },
                message: storeResponse.message
            };
        }

        const extractData = (res: any) => {
            if (Array.isArray(res)) return res;
            if (res?.data && Array.isArray(res.data)) return res.data;
            if (res?.data?.$values && Array.isArray(res.data.$values)) return res.data.$values;
            if (res?.data?.get_store && Array.isArray(res.data.get_store)) return res.data.get_store;
            if (res?.get_store && Array.isArray(res.get_store)) return res.get_store;
            return [];
        };

        const rawStores = extractData(storeResponse);
        const rawEmployees = extractData(employeeResponse);

        const stores: IInvMasterStore[] = rawStores.map((store: any) => ({
            invmsT_Id: store.invmsT_Id || store.INVMST_Id || store.INVMS_Id || store.invmS_Id || store.Id || 0,
            invmS_StoreName: store.invmS_StoreName || store.INVMS_StoreName || store.StoreName || '',
            invmS_StoreLocation: store.invmS_StoreLocation || store.INVMS_StoreLocation || store.StoreLocation || '',
            invmS_ContactPerson: store.invmS_ContactPerson || store.INVMS_ContactPerson || store.ContactPerson || '',
            invmS_ContactNo: store.invmS_ContactNo || store.INVMS_ContactNo || store.ContactNo || '',
            invmS_ActiveFlg: store.invmS_ActiveFlg ?? store.INVMST_ActiveFlg ?? store.INVMS_ActiveFlg ?? store.ActiveFlg ?? false,
            hrmE_Id: store.hrmE_Id || store.HRME_Id || 0,
            employeename: store.employeename || store.EMPLOYEENAME || store.EmployeeName || ''
        }));

        const employees: IEmployeeDropdown[] = rawEmployees.map((emp: any) => ({
            hrmE_Id: emp.hrmE_Id || emp.HRME_Id || 0,
            employeename: emp.employeename || emp.EMPLOYEENAME || emp.EmployeeName || '',
            hrmE_MobileNo: emp.hrmE_MobileNo || emp.HRME_MobileNo || emp.MobileNo || ''
        }));

        return {
            success: true,
            data: {
                get_store: stores,
                empname_list: employees,
                total: storeResponse?.total || stores.length
            }
        } as any;

    } catch (error: any) {
        console.error('getInvMasterStore: FAILED', error);
        return {
            success: false,
            data: { get_store: [], empname_list: [], total: 0 }
        };
    }
}

export async function saveInvMasterStore(data: any) {
    const params = new URLSearchParams();

    // Mapping internal camelCase keys to PascalCase keys required by API
    const mapping: Record<string, string> = {
        invmsT_Id: 'INVMST_Id',
        invmS_StoreName: 'INVMS_StoreName',
        invmS_StoreLocation: 'INVMS_StoreLocation',
        invmS_ContactPerson: 'INVMS_ContactPerson',
        invmS_ContactNo: 'INVMS_ContactNo',
        hrmE_Id: 'HRME_Id',
        invmS_ActiveFlg: 'INVMST_ActiveFlg'
    };

    for (const key in data) {
        const apiKey = mapping[key] || key;
        const val = data[key];

        // Skip ID if it's 0 (new record)
        if (apiKey === 'INVMST_Id' && (val === 0 || !val)) continue;

        if (val !== undefined && val !== null) {
            params.append(apiKey, val.toString());
        }
    }

    const url = `/INV_MasterStoreFacade/savedetails?${params.toString()}`;
    console.log("saveInvMasterStore: Posting to", url);
    return await api.post<any>('inventory', url, {});
}

export async function deactivateInvMasterStore(data: IInvMasterStore) {
    const url = `/INV_MasterStoreFacade/deactive?id=${data.invmsT_Id}`;
    console.log("deactivateInvMasterStore: Posting to", url);
    return await api.post<any>('inventory', url, {});
}
