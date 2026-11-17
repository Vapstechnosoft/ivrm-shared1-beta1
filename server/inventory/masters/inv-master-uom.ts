'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvMasterUOM } from '@/types/inventory/masters/inv-master-uom';

export async function getInvMasterUOM(searchParams?: ApiSearchparams) {
    console.log("getInvMasterUOM: TRIGGERED (POST Mode).");
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    const url = `/INV_MasterUOMFacade/getloaddata?${urlParams}`;

    try {
        const response: any = await api.post<any>('inventory', url, {});

        if (response.success === false && response.total === 0) {
            return {
                success: true,
                data: {
                    get_uom: [],
                    total: 0
                },
                message: response.message
            };
        }

        const extractData = (res: any) => {
            if (Array.isArray(res)) return res;
            if (res?.data && Array.isArray(res.data)) return res.data;
            if (res?.data?.$values && Array.isArray(res.data.$values)) return res.data.$values;
            if (res?.data?.get_uom && Array.isArray(res.data.get_uom)) return res.data.get_uom;
            if (res?.get_uom && Array.isArray(res.get_uom)) return res.get_uom;
            return [];
        };

        const rawUOMs = extractData(response);

        const uoms: IInvMasterUOM[] = rawUOMs.map((uom: any) => ({
            invmuoM_Id: uom.invmuoM_Id || uom.INVMUOM_Id || uom.Id || 0,
            invmuoM_UOMName: uom.invmuoM_UOMName || uom.INVMUOM_UOMName || '',
            invmuoM_UOMAliasName: uom.invmuoM_UOMAliasName || uom.INVMUOM_UOMAliasName || '',
            invmuoM_Qty: uom.invmuoM_Qty || uom.INVMUOM_Qty || '',
            invmuoM_ActiveFlg: uom.invmuoM_ActiveFlg ?? uom.INVMUOM_ActiveFlg ?? false
        }));

        return {
            success: true,
            data: {
                get_uom: uoms,
                total: response?.total || rawUOMs.length
            }
        } as any;

    } catch (error: any) {
        console.error('getInvMasterUOM: FAILED', error);
        return {
            success: false,
            data: { get_uom: [], total: 0 }
        };
    }
}

export async function saveInvMasterUOM(data: any) {
    console.log("saveInvMasterUOM: Incoming data:", JSON.stringify(data));
    const params = new URLSearchParams();

    // Mapping internal camelCase keys to PascalCase keys required by API
    const mapping: Record<string, string> = {
        invmuoM_Id: 'INVMUOM_Id',
        invmuoM_UOMName: 'INVMUOM_UOMName',
        invmuoM_UOMAliasName: 'INVMUOM_UOMAliasName',
        invmuoM_Qty: 'INVMUOM_Qty',
        invmuoM_ActiveFlg: 'INVMUOM_ActiveFlg'
    };

    for (const key in data) {
        const apiKey = mapping[key] || key;
        const val = data[key];

        // Handling the potential ID binding issue (consistent with Store/Supplier pattern)
        if (key === 'invmuoM_Id') {
            if (val !== 0 && val !== null && val !== undefined) {
                // Send both as fallback to resolve binding ambiguity in facade
                params.append('INVMUOM_Id', val.toString());
                params.append('INVMS_Id', val.toString()); // Some facades might reuse this parameter name
            }
            continue;
        }

        if (val !== undefined && val !== null) {
            params.append(apiKey, val.toString());
        }
    }

    const url = `/INV_MasterUOMFacade/savedetails?${params.toString()}`;
    console.log("saveInvMasterUOM: Posting to", url);
    return await api.post<any>('inventory', url, {});
}

export async function deactivateInvMasterUOM(data: IInvMasterUOM) {
    // Standardized deactive pattern with fallback id parameter
    const url = `/INV_MasterUOMFacade/deactive?id=${data.invmuoM_Id}`;
    console.log("deactivateInvMasterUOM: Posting to", url);
    return await api.post<any>('inventory', url, {});
}
