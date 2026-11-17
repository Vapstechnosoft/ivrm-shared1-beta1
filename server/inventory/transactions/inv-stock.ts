
'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { InvStock } from '@/types/inventory/transactions/inv-stock';

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

export async function getInvStockLoadData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/INV_StockFacade/GetStockLoadData?${urlParams}`;

    try {
        const response = await api.get<any>('inventory', url);

        return {
            success: response.success,
            message: response.message,
            data: {
                get_stock: response.data || [],
                get_store: [], // Not provided in the sample response
                get_item: [],  // Not provided in the sample response
                total: response.total || (response.data?.length ?? 0)
            }
        };

    } catch (error) {
        console.error("Error fetching Stock load data:", error);
        return {
            success: false,
            data: {
                get_stock: [],
                get_store: [],
                get_item: [],
                total: 0
            }
        };
    }
}

export async function saveInvStock(data: any) {
    const url = `/INV_StockFacade/SaveStockDetails`;
    // The Angular code pushes into stocklist array
    // Map data to match the expected format
    const payload = {
        stocklist: data.stocklist.map((item: any) => ({
            invmsT_Id: item.invmsT_Id,
            invmI_Id: item.invmI_Id,
            invstO_BatchNo: item.invstO_BatchNo,
            invstO_PurchaseDate: item.invstO_PurchaseDate,
            invstO_PurchaseRate: item.invstO_PurchaseRate,
            invstO_ItemConQty: item.invstO_ItemConQty,
            invstO_PurOBQty: item.invstO_PurOBQty,
            invstO_PurRetQty: item.invstO_PurRetQty,
            invstO_SalesRate: item.invstO_SalesRate,
            invstO_SalesQty: item.invstO_SalesQty,
            invstO_SalesRetQty: item.invstO_SalesRetQty,
            invstO_MatIssPlusQty: item.invstO_MatIssPlusQty,
            invstO_MatIssMinusQty: item.invstO_MatIssMinusQty,
            invstO_PhyPlusQty: item.invstO_PhyPlusQty,
            invstO_PhyMinQty: item.invstO_PhyMinQty,
            invstO_AvaiableStock: item.invstO_AvaiableStock,
            invstO_Id: item.invstO_Id || 0
        }))
    };
    return await api.post<any>('inventory', url, payload);
}


export async function getInvStockLoadStores() {
    const url = `/INV_T_SalesFacade/loadStores`;
    const response = await api.get<any>('inventory', url);
    return {
        success: response.success,
        data: extractData(response)
    };
}

export async function getInvStockItems(storeId: number) {
    const url = `/INV_T_SalesFacade/getitem?INVMST_Id=${storeId}&INVC_LIFOFIFOFlg=LIFO`;
    try {
        const response = await api.get<any>('inventory', url);
        return {
            success: response.success,
            data: extractData(response)
        };
    } catch (error) {
        console.error("Error fetching items:", error);
        return {
            success: false,
            data: []
        };
    }
}

export async function getInvStockEditData(id: number) {
    const url = `/INV_StockFacade/EditStock?INVSTO_Id=${id}`;
    const response = await api.get<any>('inventory', url);
    return {
        success: response.success,
        data: response.data
    };
}
