
'use server';

import { api } from '@/lib/apiService';
import { IInvRStockPayload, IInvRStockReportData } from '@/types/inventory/reports/inv-r-stock';

// MOCK DATA


export async function getInvRStockDetails(optionflag: string) {
    try {
        const response = await api.get<any>('inventory', `/INV_R_StockFacade/getloaddata?optionflag=${optionflag}`);

        let data = response.data;
        if (data && data.$values) data = data.$values;
        if (!Array.isArray(data)) data = [];

        let mappedData = data;

        if (optionflag === 'Group') {
            mappedData = data.map((item: any) => ({
                invmG_Id: item.id,
                invmG_GroupName: item.name,
                ...item
            }));
        }
        // Add other mappings if needed for Item/Store, assuming similar id/name structure or existing properties
        // For now, passing data through for others or mapping if they match id/name pattern.
        else if (optionflag === 'Store') {
            mappedData = data.map((item: any) => ({
                invmsT_Id: item.id ?? item.invmsT_Id,
                invmS_StoreName: item.name ?? item.invmS_StoreName,
                ...item
            }));
        } else if (optionflag === 'Item') {
            mappedData = data.map((item: any) => ({
                invmI_Id: item.id ?? item.invmI_Id,
                invmI_ItemName: item.name ?? item.invmI_ItemName,
                invmI_ItemCode: item.code ?? item.invmI_ItemCode,
                ...item
            }));
        }

        return {
            success: true,
            data: {
                get_stockdetails: mappedData
            }
        };
    } catch (error) {
        console.error("Error fetching stock details:", error);
        return {
            success: false,
            data: {
                get_stockdetails: []
            }
        };
    }
}




import { getSearchParamsUrl } from '@/lib/apiService';
import { ApiSearchparams } from '@/types';

// Helper for extracting data consistently
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


export async function getInvRStockReport(payload: IInvRStockPayload, searchParams?: ApiSearchparams) {
    try {
        // Construct payload based on user instruction: use 'overallflag' instead of 'optionflag'
        const apiPayload: any = {
            ...payload,
            overallflag: payload.optionflag
        };
        delete apiPayload.optionflag;

        const params: any = {
            ...searchParams
        };

        const urlParams = getSearchParamsUrl(params);
        const url = `/INV_R_StockFacade/onreport?${urlParams}`;

        const response = await api.post<any>('inventory', url, apiPayload);


        return {
            success: response.success ?? true,
            data: {
                get_StockReport: extractData(response, 'data')
            },
            total: Number(response.totalItems || response.total || 0),
            // Note: using totalItems/total based on flexible API response, inv-r-grn uses total
            message: response.message || 'Report generated successfully'
        };
    } catch (error: any) {
        console.error("Report Error:", error);
        return {
            success: false,
            data: {
                get_StockReport: []
            },
            total: 0,
            message: error.message || 'Failed to generate report'
        };
    }
}
