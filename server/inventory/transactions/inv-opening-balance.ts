
'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvOpeningBalanceLoadData, IInvOpeningBalance } from '@/types/inventory/transactions/inv-opening-balance';

// Mock Data
// Mock OBS for edit details
const MOCK_OBS: IInvOpeningBalance[] = Array.from({ length: 25 }, (_, i) => ({
    invoB_Id: i + 1,
    invmsT_Id: i % 2 === 0 ? 1 : 2,
    invmS_StoreName: i % 2 === 0 ? 'Main Store' : 'Sub Store',
    invmI_Id: (i % 3) + 1,
    invmI_ItemName: 'Mock Item',
    invmuoM_Id: 1,
    invmuoM_UOMName: 'Nos',
    invoB_BatchNo: `BATCH-${2024000 + i}`,
    invoB_PurchaseDate: new Date(2024, 0, i + 1).toISOString(),
    invoB_Qty: 10 + (i * 2),
    invoB_PurchaseRate: 50 + i,
    invoB_SaleRate: 70 + i,
    invoB_TAmount: (10 + (i * 2)) * (50 + i),
    invoB_Naration: `Opening Balance record ${i + 1}`,
    invoB_ActiveFlg: i % 5 !== 0,
}));

const extractData = (res: any, key?: string) => {
    if (!res) return [];
    // If it's wrapped in { success: true, data: ... } from a previous helper, unwrap
    const data = res.data ?? res;
    if (key && data[key]) {
        if (Array.isArray(data[key])) return data[key];
        if (data[key].$values) return data[key].$values;
    }
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [];
};

export async function getInvOpeningBalanceLoadData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/INV_OpeningBalanceFacade/GetOpeningBalance?${urlParams}`;

    try {
        const response = await api.get<any>('inventory', url);

        // The new API returns the list directly in `data`
        const rawOBs = response.data || [];

        const obList = rawOBs.map((item: any) => ({
            ...item,
            invoB_ActiveFlg: !!item.invoB_ActiveFlg,
            // Calculate Total Amount for display in grid (Qty * Purchase Rate)
            invoB_TAmount: item.invoB_TAmount ?? ((item.invoB_Qty || 0) * (item.invoB_PurchaseRate || 0))
        }));

        return {
            success: true,
            data: {
                get_openingbalance: obList,
                total: response.total || obList.length,
                // Provide empty arrays for stores/items as they are fetched via separate APIs/mutations now
                get_Store: [],
                get_item: []
            }
        };

    } catch (error) {
        console.error('Error fetching Opening Balance data:', error);
        return {
            success: false,
            data: {
                get_Store: [],
                get_item: [],
                get_openingbalance: [],
                total: 0,
            }
        };
    }
}

export async function saveInvOpeningBalance(data: any) {
    const url = `/INV_OpeningBalanceFacade/savedetails`;
    const payload = {
        INVOB_Id: data.invoB_Id || 0,
        INVMST_Id: data.invmsT_Id,
        IMFY_Id: data.imfY_Id || 0,
        OBItem: data.transrows?.map((row: any) => ({
            INVMI_Id: row.invmI_Id,
            INVMUOM_Id: row.invmuoM_Id,
            INVOB_BatchNo: row.invoB_BatchNo,
            INVOB_PurchaseDate: row.invoB_PurchaseDate,
            INVOB_Qty: row.invoB_Qty,
            INVOB_PurchaseRate: row.invstO_PurchaseRate,
            INVOB_SaleRate: row.invstO_SalesRate,
            INVOB_Naration: row.invoB_Naration || '',
            INVOB_MfgDate: row.invoB_MfgDate,
            INVOB_ExpDate: row.invoB_ExpDate
        }))
    };
    return await api.post<any>('inventory', url, payload);
}

export async function deactiveInvOpeningBalance(data: any) {
    const url = `/INV_OpeningBalanceFacade/deactive`;
    const payload = {
        INVOB_Id: data.invoB_Id,
        INVMST_Id: data.invmsT_Id
    };
    return await api.post<any>('inventory', url, payload);
}

export async function getInvOpeningBalanceStores() {
    const url = `/INV_T_SalesFacade/loadStores`;
    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: true,
            data: response.data || extractData(response)
        };
    } catch (error) {
        console.error("Error fetching stores:", error);
        return { success: false, data: [] };
    }
}

export async function getInvOpeningBalanceItems(data: { INVMST_Id: number, INVC_LIFOFIFOFlg?: string }) {
    // Default flag to LIFO if not provided, as per common patterns or user request
    const flag = data.INVC_LIFOFIFOFlg || 'LIFO';
    const url = `/INV_T_SalesFacade/getitem?INVMST_Id=${data.INVMST_Id}&INVC_LIFOFIFOFlg=${flag}`;
    try {
        const response = await api.get<any>('inventory', url);
        // The user says response has { success: ..., message: ..., data: [...] }
        // extractData handles this structure.
        return {
            success: true,
            data: extractData(response)
        };
    } catch (error) {
        console.error("Error fetching items:", error);
        return { success: false, data: [] };
    }
}

export async function getSelectionItemDetails(data: { INVMI_Id: number }) {
    const url = `/INV_T_GRNFacade/getItemDetail?id=${data.INVMI_Id}`;
    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: true,
            data: extractData(response)
        };
    } catch (error) {
        console.error("Error fetching item details:", error);
        return { success: false, data: [] };
    }
}

export async function getOpeningBalanceDetails(data: { INVOB_Id: number }) {
    const url = `/INV_OpeningBalanceFacade/getobdetails?INVOB_Id=${data.INVOB_Id}`;
    const response = await api.get<any>('inventory', url);
    return {
        get_obdetails: extractData(response, 'get_obdetails')
    };
}



