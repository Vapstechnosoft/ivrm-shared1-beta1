'use server';

import { api, getSearchParamsUrl, type ApiResponse } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvMasterTax, IInvMasterTaxLedger, IInvMasterTaxLedgerDTO } from '@/types/inventory/masters/inv-master-tax';

export async function getInvMasterTax(searchParams?: ApiSearchparams): Promise<ApiResponse<any>> {
    console.log("getInvMasterTax: Function called");
    const urlParams = getSearchParamsUrl(searchParams);
    const url = `/INV_MasterTaxFacade/loadtaxlist?${urlParams}`;
    console.log(`getInvMasterTax: Making GET request to ${url} using 'inventory' client`);

    try {
        const response: any = await api.get<any>('inventory', url);
        console.log("getInvMasterTax: API call successful", response ? Object.keys(response) : "null");

        // Handle success: false but with message (Search query with no results)
        if (response.success === false && response.message === "No tax records found") {
            return {
                success: true,
                data: [],
                total: 0,
                message: response.message
            };
        }

        // Ensure data exists
        if (!response.data) {
            console.warn("getInvMasterTax: No data received");
            return { success: false, data: [], total: 0, message: 'No data received' } as ApiResponse<any>;
        }

        return response;
    } catch (error) {
        console.error("getInvMasterTax: API call failed", error);
        // Return a safe fallback so the UI doesn't crash, but logged the error
        return { success: false, data: [], total: 0, message: 'Error fetching data' } as ApiResponse<any>;
    }
}

export async function getInvMasterTaxDetails(id: number) {
    const data = { INVMT_Id: id };
    const url = `/INV_MasterTaxFacade/getdetails`;
    return await api.post<any>('inventory', url, data);
}

export async function getLedgerUnder(famled_id: number) {
    const data = { FAMLED_Id: famled_id };
    const url = `/INV_MasterTaxFacade/getledgerunder`;
    return await api.post<any>('inventory', url, data);
}

export async function saveInvMasterTax(data: any) {
    const params = new URLSearchParams();
    for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
            params.append(key, data[key].toString());
        }
    }
    const url = `/INV_MasterTaxFacade/savedetails?${params.toString()}`;

    console.log("saveInvMasterTax: Posting with Query Params to", url);
    return await api.post<any>('inventory', url, {});
}

export async function saveInvMasterTaxLedger(data: IInvMasterTaxLedgerDTO) {
    const url = `/INV_MasterTaxFacade/saveledger`;
    return await api.post<any>('inventory', url, data);
}

export async function deactivateInvMasterTax(data: IInvMasterTax) {
    // User specified: /api/INV_MasterTaxFacade/deactive?id=6
    // So we use query param 'id'
    const url = `/INV_MasterTaxFacade/deactive?id=${data.invmT_Id}`;
    return await api.post<any>('inventory', url, {});
}
