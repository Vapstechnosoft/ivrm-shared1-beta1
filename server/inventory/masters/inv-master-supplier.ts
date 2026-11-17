'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvMasterSupplier } from '@/types/inventory/masters/inv-master-supplier';

export async function getInvMasterSupplier(searchParams?: ApiSearchparams) {
    console.log("getInvMasterSupplier: TRIGGERED (POST Mode).");
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    const url = `/INV_MasterSupplierFacade/getloaddata?${urlParams}`;

    try {
        const response: any = await api.post<any>('inventory', url, {});

        if (response.success === false && response.total === 0) {
            return {
                success: true,
                data: {
                    get_supplier: [],
                    total: 0
                },
                message: response.message
            };
        }

        const extractData = (res: any) => {
            if (Array.isArray(res)) return res;
            if (res?.data && Array.isArray(res.data)) return res.data;
            if (res?.data?.$values && Array.isArray(res.data.$values)) return res.data.$values;
            if (res?.data?.get_supplier && Array.isArray(res.data.get_supplier)) return res.data.get_supplier;
            if (res?.get_supplier && Array.isArray(res.get_supplier)) return res.get_supplier;
            return [];
        };

        const rawSuppliers = extractData(response);

        const suppliers: IInvMasterSupplier[] = rawSuppliers.map((sup: any) => ({
            invmS_Id: sup.invmS_Id || sup.INVMST_Id || sup.INVMS_Id || sup.Id || 0,
            invmS_SupplierName: sup.invmS_SupplierName || sup.INVMS_SupplierName || '',
            invmS_SupplierCode: sup.invmS_SupplierCode || sup.INVMS_SupplierCode || '',
            invmS_SupplierConatctPerson: sup.invmS_SupplierConatctPerson || sup.INVMS_SupplierConatctPerson || '',
            invmS_SupplierConatctNo: sup.invmS_SupplierConatctNo || sup.INVMS_SupplierConatctNo || '',
            invmS_EmailId: sup.invmS_EmailId || sup.INVMS_EmailId || '',
            invmS_GSTNo: sup.invmS_GSTNo || sup.INVMS_GSTNo || '',
            invmS_SupplierAddress: sup.invmS_SupplierAddress || sup.INVMS_SupplierAddress || '',
            invmS_ActiveFlg: sup.invmS_ActiveFlg ?? sup.INVMST_ActiveFlg ?? sup.INVMS_ActiveFlg ?? false
        }));

        return {
            success: true,
            data: {
                get_supplier: suppliers,
                total: response?.total || rawSuppliers.length
            }
        } as any;

    } catch (error: any) {
        console.error('getInvMasterSupplier: FAILED', error);
        return {
            success: false,
            data: { get_supplier: [], total: 0 }
        };
    }
}

export async function saveInvMasterSupplier(data: any) {
    console.log("saveInvMasterSupplier: Incoming data:", JSON.stringify(data));
    const params = new URLSearchParams();

    // Mapping internal camelCase keys to PascalCase keys required by API
    // Using mapping seen in Store module (INVMST_Id) to be safe if INVMS_Id failed
    const mapping: Record<string, string> = {
        invmS_Id: 'INVMS_Id',
        invmS_SupplierName: 'INVMS_SupplierName',
        invmS_SupplierCode: 'INVMS_SupplierCode',
        invmS_SupplierConatctPerson: 'INVMS_SupplierConatctPerson',
        invmS_SupplierConatctNo: 'INVMS_SupplierConatctNo',
        invmS_EmailId: 'INVMS_EmailId',
        invmS_GSTNo: 'INVMS_GSTNo',
        invmS_SupplierAddress: 'INVMS_SupplierAddress',
        invmS_ActiveFlg: 'INVMST_ActiveFlg' // Consistent with Store pattern
    };

    for (const key in data) {
        let apiKey = mapping[key] || key;
        const val = data[key];

        // Handling the potential INVMST_Id issue
        if (key === 'invmS_Id') {
            // We'll append both to be safe or just try one. 
            // Previous feedback suggested INVMST_Id for store.
            if (val !== 0 && val !== null && val !== undefined) {
                params.append('INVMST_Id', val.toString());
                params.append('INVMS_Id', val.toString());
                continue;
            }
            continue; // Skip if 0
        }

        if (val !== undefined && val !== null) {
            params.append(apiKey, val.toString());
        }
    }

    const url = `/INV_MasterSupplierFacade/savedetails?${params.toString()}`;
    console.log("saveInvMasterSupplier: Posting to", url);
    return await api.post<any>('inventory', url, {});
}

export async function deactivateInvMasterSupplier(data: IInvMasterSupplier) {
    const url = `/INV_MasterSupplierFacade/deactive?id=${data.invmS_Id}`;
    console.log("deactivateInvMasterSupplier: Posting to", url);
    return await api.post<any>('inventory', url, {});
}
