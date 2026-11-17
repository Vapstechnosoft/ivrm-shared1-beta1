
'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { InvTItemConsumption } from '@/types/inventory/transactions/inv-t-item-consumption';

const MOCK_DATA: InvTItemConsumption[] = [];

const extractData = (res: any, key?: string) => {
    if (!res) return [];
    const data = res.data ?? res;
    if (key && data[key]) {
        if (Array.isArray(data[key])) return data[key];
        if (data[key].$values) return data[key].$values;
    }
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [];
};

export async function getInvTItemConsumptionLoadData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/INV_ItemConsumptionFacade/GetItemConsumption?${urlParams}`;

    try {
        const response = await api.get<any>('inventory', url);

        return {
            success: response.success,
            message: response.message,
            data: {
                get_itemconsumption: extractData(response, 'data'), // The main list is often in 'data' or direct
                total: response.total || extractData(response, 'data').length,
                get_Store: [],
                get_employee: [],
                get_Department: [],
                get_Student: [],
                get_Product: []
            }
        };

    } catch (error) {
        console.error("Error fetching Item Consumption load data:", error);
        return {
            success: false,
            data: {
                get_itemconsumption: [],
                total: 0,
                get_Store: [],
                get_employee: [],
                get_Department: [],
                get_Student: [],
                get_Product: []
            }
        };
    }
}

export async function saveInvTItemConsumption(data: any) {
    const url = `/INV_ItemConsumptionFacade/SaveItemConsumptionDetails`;
    return await api.post<any>('inventory', url, data);
}

export async function deactiveInvTItemConsumption(data: any) {
    const url = `/INV_ItemConsumptionFacade/deactive?INVMIC_Id=${data.invmiC_Id}&INVMIC_StuOtherFlg=${data.invmiC_StuOtherFlg}`;
    return await api.post<any>('inventory', url, {});
}

export async function getItemConsumptionDetails(data: any) {
    const url = `/INV_ItemConsumption/getICDetails`;
    return await api.post<any>('inventory', url, data);
}

export async function getItemsOnStoreChange(data: { INVMST_Id: number, INVC_LIFOFIFOFlg?: string }) {
    const params = new URLSearchParams();
    params.append('INVMST_Id', data.INVMST_Id.toString());
    if (data.INVC_LIFOFIFOFlg) {
        params.append('INVC_LIFOFIFOFlg', data.INVC_LIFOFIFOFlg);
    }

    const url = `/INV_T_SalesFacade/getitem?${params.toString()}`;
    return await api.get<any>('inventory', url);
}

export async function getItemStockDetails(data: any) {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            params.append(key, data[key].toString());
        }
    });

    const url = `/INV_T_SalesFacade/getitemDetail?${params.toString()}`;
    return await api.get<any>('inventory', url);
}


export async function getInvTItemConsumptionStores() {
    const url = `/INV_T_GRNFacade/loadstores`;
    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: true,
            data: extractData(response)
        };
    } catch (error) {
        console.error("Error fetching stores for item consumption:", error);
        return { success: false, data: [] };
    }
}

export async function getInvTItemConsumptionDepartments() {
    const url = '/INV_ItemConsumptionFacade/GetDepartment';
    const response = await api.get<any>('inventory', url);
    return {
        success: true,
        data: extractData(response)
    };
}

export async function getInvTItemConsumptionProducts() {
    const url = '/INV_ItemConsumptionFacade/GetProducts';
    const response = await api.get<any>('inventory', url);
    return {
        success: true,
        data: extractData(response)
    };
}

export async function getInvTItemConsumptionEmployees() {
    const url = `/INV_T_SalesFacade/loadEmployees`;
    const response = await api.get<any>('inventory', url);
    return {
        success: true,
        data: extractData(response)
    };
}


export async function getStudentClsSec(type: string) {
    const url = `/INV_T_SalesFacade/getStudentClsSec?type=${type}`;
    return await api.get<any>('inventory', url);
}

export async function getStudentList(data: any) {
    const params = new URLSearchParams();
    if (data.ASMCL_Id) params.append('ASMCL_Id', data.ASMCL_Id.toString());
    if (data.ASMS_Id) params.append('ASMS_Id', data.ASMS_Id.toString());
    if (data.type) params.append('type', data.type);

    const url = `/INV_T_SalesFacade/getStudentlist?${params.toString()}`;
    return await api.get<any>('inventory', url);
}

export async function getSectionList(data: any) {
    const url = `/INV_T_SalesFacade/getsectionlist?ASMCL_Id=${data.ASMCL_Id}`;
    return await api.get<any>('inventory', url);
}

export async function getICUserDetails(INVMIC_Id: number, userflag: string) {
    const url = `/INV_ItemConsumptionFacade/getICUserDetails?INVMIC_Id=${INVMIC_Id}&userflag=${userflag}`;
    return await api.get<any>('inventory', url);
}

export async function getICItemDetails(INVMIC_Id: number) {
    const url = `/INV_ItemConsumptionFacade/getICItemDetails?INVMIC_Id=${INVMIC_Id}`;
    return await api.get<any>('inventory', url);
}
