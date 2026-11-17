
'use server';

import { api } from '@/lib/apiService';
import { IInvRGRNLoadData, IInvRGRNPayload, IInvRGRNReportData } from '@/types/inventory/reports/inv-r-grn';



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

export async function getInvRGRNLoadData(optionflag: string) {
    if (!optionflag) return { success: true, data: { get_grn_item_supplier: [], get_grnreport: [] } };

    const url = `/INV_R_GRNFacade/getloaddata?flg=${optionflag}`;

    try {
        // Using POST as per C# [HttpPost] attribute
        const response = await api.post<any>('inventory', url, {});
        const rawData = extractData(response, 'data');

        let mappedData: any[] = [];

        if (optionflag === 'Item_1') {
            mappedData = rawData.map((item: any) => ({
                invmI_Id: item.id,
                invmI_ItemName: item.name,
                invmI_ItemCode: item.code, // Potential extra field
                ...item
            }));
        } else if (optionflag === 'Supplier') {
            mappedData = rawData.map((item: any) => ({
                invmS_Id: item.id,
                invmS_SupplierName: item.name,
                invmS_SupplierCode: item.code,
                ...item
            }));
        } else if (optionflag === 'Individual_1') {
            // Assuming similar pattern for GRN
            mappedData = rawData.map((item: any) => ({
                invmgrN_Id: item.id,
                invmgrN_GRNNo: item.name,
                ...item
            }));
        } else {
            mappedData = rawData;
        }

        return {
            success: true,
            data: {
                get_grn_item_supplier: mappedData,
                get_grnreport: []
            },
            message: 'Data loaded successfully'
        };
    } catch (error) {
        console.error("Error loading GRN data:", error);
        return {
            success: false,
            data: {
                get_grn_item_supplier: [],
                get_grnreport: []
            },
            message: 'Failed to load data'
        };
    }
}

import { getSearchParamsUrl } from '@/lib/apiService';
import { ApiSearchparams } from '@/types';

export async function getInvRGRNReport(payload: IInvRGRNPayload, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/INV_R_GRNFacade/onreport?${urlParams}`;

    try {
        const response = await api.post<any>('inventory', url, payload);
        return {
            success: response.success ?? true,
            data: {
                get_grnreport: extractData(response, 'data'),
                get_grn_item_supplier: []
            },
            total: response.total ?? 0,
            page: response.page ?? 1,
            page_size: response.page_size ?? 10,
            message: response.message || 'Report generated successfully'
        };
    } catch (error: any) {
        console.error("Error generating GRN Report:", error);
        return {
            success: false,
            data: {
                get_grnreport: [],
                get_grn_item_supplier: []
            },
            total: 0,
            message: error.response?.data?.message || error.message || 'Failed to generate report'
        };
    }
}
