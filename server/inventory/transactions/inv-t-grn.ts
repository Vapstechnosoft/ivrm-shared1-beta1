'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvTGRNLoadData } from '@/types/inventory/transactions/inv-t-grn';

export async function getInvTGRNLoadData(searchParams?: ApiSearchparams) {
    console.log("getInvTGRNLoadData: TRIGGERED (POST Mode).");
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const grnUrl = `/INV_T_GRNFacade/getloaddata?${urlParams}`;

    // Dropdown URLs
    const itemUrl = `/INV_T_GRNFacade/loaditems`;
    const storeUrl = `/INV_T_GRNFacade/loadstores`;
    const supplierUrl = `/INV_T_GRNFacade/loadsuppliers`;
    const taxUrl = `/INV_T_GRNFacade/loadtax`;

    try {
        console.log(`getInvTGRNLoadData: Fetching GRN from ${grnUrl} (GET)`);

        const [grnRes, itemRes, storeRes, supplierRes, taxRes] = await Promise.all([
            api.get<any>('inventory', grnUrl),
            api.get<any>('inventory', itemUrl).catch(e => { console.error("Item fetch failed", e); return { data: [] }; }),
            api.get<any>('inventory', storeUrl).catch(e => { console.error("Store fetch failed", e); return { data: [] }; }),
            api.get<any>('inventory', supplierUrl).catch(e => { console.error("Supplier fetch failed", e); return { data: [] }; }),
            api.get<any>('inventory', taxUrl).catch(e => { console.error("Tax fetch failed", e); return { data: [] }; })
        ]);

        console.log('getInvTGRNLoadData: RAW GRN Response:', JSON.stringify(grnRes, null, 2));

        const extractData = (res: any): any[] => {
            if (!res) return [];

            // 1. Root is array
            if (Array.isArray(res)) return res;

            // 2. Common keys (case-insensitive)
            const keys = Object.keys(res);
            const dataKey = keys.find(k => k.toLowerCase() === 'data');
            if (dataKey) {
                if (Array.isArray(res[dataKey])) return res[dataKey];
                if (res[dataKey]?.$values && Array.isArray(res[dataKey].$values)) return res[dataKey].$values;

                // Nested data.data
                if (typeof res[dataKey] === 'object') {
                    const nestedKeys = Object.keys(res[dataKey]);
                    const nestedDataKey = nestedKeys.find(k => k.toLowerCase() === 'data');
                    if (nestedDataKey && Array.isArray(res[dataKey][nestedDataKey])) return res[dataKey][nestedDataKey];
                }
            }

            // 3. Specific keys
            if (res.get_GRN && Array.isArray(res.get_GRN)) return res.get_GRN;

            // 4. Fallback: Deep search for ANY array of objects
            const deepFindArray = (obj: any, depth = 0): any[] | null => {
                if (depth > 3 || !obj || typeof obj !== 'object') return null;

                // If this object has $values which is an array, return it
                if (obj.$values && Array.isArray(obj.$values)) return obj.$values;

                const values = Object.values(obj);
                for (const val of values) {
                    if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
                        return val; // Found a candidate array
                    }
                    if (val && typeof val === 'object' && !Array.isArray(val)) {
                        const found = deepFindArray(val, depth + 1);
                        if (found) return found;
                    }
                }
                return null;
            };

            const foundArray = deepFindArray(res);
            if (foundArray) {
                console.log('extractData: Deep search found an array with ' + foundArray.length + ' items.');
                return foundArray;
            }

            return [];
        };

        // Detailed Debug Logging
        if (grnRes) {
            console.log('getInvTGRNLoadData: DEBUG grnRes Keys:', Object.keys(grnRes));
            const dKey = Object.keys(grnRes).find(k => k.toLowerCase() === 'data');
            if (dKey) {
                const dataVal = grnRes[dKey];
                console.log(`getInvTGRNLoadData: FOUND '${dKey}' key. IsArray: ${Array.isArray(dataVal)}. Value (slice):`, Array.isArray(dataVal) ? JSON.stringify(dataVal.slice(0, 1)) : dataVal);
            } else {
                console.log('getInvTGRNLoadData: NO "data" key found (case-insensitive).');
                console.log('getInvTGRNLoadData: FULL grnRes:', JSON.stringify(grnRes, null, 2));
            }
        }

        const rawGRNs = extractData(grnRes);
        console.log(`getInvTGRNLoadData: Loaded ${rawGRNs.length} GRN records`);

        const grnList = rawGRNs.map((item: any) => ({
            invmgrN_Id: item.invmgrN_Id ?? item.INVMGRN_Id ?? 0,
            invmgrN_GRNNo: item.invmgrN_GRNNo ?? item.INVMGRN_GRNNo ?? '',
            invmgrN_InvoiceNo: item.invmgrN_InvoiceNo ?? item.INVMGRN_InvoiceNo ?? '',
            invmgrN_PurchaseDate: item.invmgrN_PurchaseDate ?? item.INVMGRN_PurchaseDate ?? new Date().toISOString(),
            invmgrN_PurchaseValue: item.invmgrN_PurchaseValue ?? item.INVMGRN_PurchaseValue ?? 0,
            invmgrN_TotDiscount: item.invmgrN_TotDiscount ?? item.INVMGRN_TotDiscount ?? 0,
            invmgrN_TotTaxAmt: item.invmgrN_TotTaxAmt ?? item.INVMGRN_TotTaxAmt ?? 0,
            invmgrN_TotalAmount: item.invmgrN_TotalAmount ?? item.INVMGRN_TotalAmount ?? 0,
            invmgrN_Remarks: item.invmgrN_Remarks ?? item.INVMGRN_Remarks ?? '',
            invmgrN_ReturnFlg: !!(item.invmgrN_ReturnFlg ?? item.INVMGRN_ReturnFlg),
            invmgrN_PaidFlg: !!(item.invmgrN_PaidFlg ?? item.INVMGRN_PaidFlg),
            invmgrN_CreditFlg: !!(item.invmgrN_CreditFlg ?? item.INVMGRN_CreditFlg),
            invmsT_Id: item.invmsT_Id ?? item.INVMST_Id ?? 0,
            invmS_Id: item.invmS_Id ?? item.INVMS_Id ?? 0,
            invmgrN_POReference: item.invmgrN_POReference ?? item.INVMGRN_POReference ?? '',
            invmgrN_EWayBillRef: item.invmgrN_EWayBillRef ?? item.INVMGRN_EWayBillRef ?? '',
            invmgrN_TowardsProjects: item.invmgrN_TowardsProjects ?? item.INVMGRN_TowardsProjects ?? '',
            invmgrN_PODate: item.invmgrN_PODate ?? item.INVMGRN_PODate,
            invmgrN_Prepared: item.invmgrN_Prepared ?? item.INVMGRN_Prepared ?? '',
            invmgrN_SignedBy: item.invmgrN_SignedBy ?? item.INVMGRN_SignedBy ?? '',
            invmgrN_ChallanNo: item.invmgrN_ChallanNo ?? item.INVMGRN_ChallanNo ?? '',
            invmgrN_Challandate: item.invmgrN_Challandate ?? item.INVMGRN_Challandate,
            invmgrN_Challanverfied: item.invmgrN_Challanverfied ?? item.INVMGRN_Challanverfied ?? '',
            invmgrN_KitNo: item.invmgrN_KitNo ?? item.INVMGRN_KitNo ?? '',
            invmgrN_ActiveFlg: !!(item.invmgrN_ActiveFlg ?? item.INVMGRN_ActiveFlg ?? item.INVTGRN_ActiveFlg ?? item.invtgrN_ActiveFlg ?? item.invtgrn_activeflg),
            invtgrN_ActiveFlg: !!(item.invmgrN_ActiveFlg ?? item.INVMGRN_ActiveFlg ?? item.INVTGRN_ActiveFlg ?? item.invtgrN_ActiveFlg ?? item.invtgrn_activeflg),
            invmS_StoreName: item.invmS_StoreName ?? item.INVMS_StoreName ?? '',
            invmS_SupplierName: item.invmS_SupplierName ?? item.INVMS_SupplierName ?? ''
        }));

        return {
            success: true,
            data: {
                get_GRN: grnList,
                get_item: extractData(itemRes),
                get_Store: extractData(storeRes),
                get_supplier: extractData(supplierRes),
                get_tax: extractData(taxRes),
                total: grnRes.total || (grnRes.data ? grnRes.data.total : 0) || grnList.length
            }
        } as any;

    } catch (error: any) {
        console.error('getInvTGRNLoadData: FAILED', error);
        return {
            success: false,
            data: {
                get_GRN: [],
                get_item: [],
                get_Store: [],
                get_supplier: [],
                get_tax: [],
                total: 0
            }
        };
    }
}

export async function saveInvTGRNDetails(data: any) {
    const url = `/INV_T_GRNFacade/savegrn`;

    // Transform data to match DTO properties (PascalCase)
    const payload = {
        INVMGRN_Id: data.invmgrN_Id,
        INVMGRN_GRNNo: data.invmgrN_GRNNo,
        INVMGRN_InvoiceNo: data.invmgrN_InvoiceNo,
        INVMGRN_PurchaseDate: data.invmgrN_PurchaseDate,
        INVMGRN_PurchaseValue: data.invmgrN_PurchaseValue,
        INVMGRN_TotDiscount: data.invmgrN_TotDiscount,
        INVMGRN_TotTaxAmt: data.invmgrN_TotTaxAmt,
        INVMGRN_TotalAmount: data.invmgrN_TotalAmount,
        INVMGRN_Remarks: data.invmgrN_Remarks,
        INVMGRN_ReturnFlg: data.invmgrN_ReturnFlg,
        INVMGRN_PaidFlg: data.invmgrN_PaidFlg,
        INVMGRN_CreditFlg: data.invmgrN_CreditFlg,
        INVMST_Id: data.invmsT_Id,
        INVMS_Id: data.invmS_Id,
        INVMGRN_POReference: data.invmgrN_POReference,
        INVMGRN_EWayBillRef: data.invmgrN_EWayBillRef,
        INVMGRN_TowardsProjects: data.invmgrN_TowardsProjects,
        INVMGRN_PODate: data.invmgrN_PODate,
        INVMGRN_Prepared: data.invmgrN_Prepared,
        INVMGRN_SignedBy: data.invmgrN_SignedBy,
        INVMGRN_ChallanNo: data.invmgrN_ChallanNo,
        INVMGRN_Challandate: data.invmgrN_Challandate,
        INVMGRN_Challanverfied: data.invmgrN_Challanverfied,
        INVMGRN_KitNo: data.invmgrN_KitNo,
        trans_id: data.invmgrN_GRNNo, // Map GRNNo to trans_id as requested by backend logic

        // Map Items
        GRNItem: data.GRNItem?.map((item: any) => ({
            INVTGRN_Id: item.invtgrN_Id,
            INVMGRN_Id: item.invmgrN_Id,
            INVMI_Id: item.invmI_Id,
            INVMUOM_Id: item.invmuoM_Id,
            INVTGRN_BatchNo: item.invtgrN_BatchNo,
            INVTGRN_Qty: item.invtgrN_Qty,
            INVTGRN_MfgDate: item.invtgrN_MfgDate,
            INVTGRN_ExpDate: item.invtgrN_ExpDate,
            INVTGRN_PurchaseRate: item.invtgrN_PurchaseRate,
            INVTGRN_MRP: item.invtgrN_MRP,
            INVTGRN_DiscountAmt: item.invtgrN_DiscountAmt,
            INVTGRN_SalesPrice: item.invtgrN_SalesPrice,
            INVTGRN_Amount: item.invtgrN_Amount,
            INVTGRN_Naration: item.invtgrN_Naration,
            INVTGRN_TaxAmt: item.invtgrN_TaxAmt,
            INVTGRN_ActiveFlg: true,

            // Map Taxes within Item
            GRNItemTax: item.GRNItemTax?.map((tax: any) => ({
                INVTGRNT_Id: tax.invtgrnT_Id,
                INVTGRN_Id: tax.invtgrN_Id,
                INVMT_Id: tax.invmT_Id,
                INVTGRNT_TaxPer: tax.invtgrnT_TaxPer,
                INVTGRNT_TaxAmt: tax.invtgrnT_TaxAmt,
                INVTGRNT_ActiveFlg: true
            })) || []
        })) || []
    };

    console.log("saveInvTGRNDetails: Payload being sent (Body):", JSON.stringify(payload, null, 2));

    try {
        const response = await api.post<any>('inventory', url, payload);
        return response;
    } catch (error: any) {
        // The error might be a string due to apiService interceptors
        console.error('saveInvTGRNDetails: API Call FAILED (Raw Error):', error);

        return {
            success: false,
            message: typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || "Failed to connect to server")
        };
    }
}

export async function deleteInvTGRN(data: any) {
    const url = `/INV_T_GRNFacade/GRN_Delete`;
    return await api.post<any>('inventory', url, data);
}

export async function toggleInvTGRNActive(data: any) {
    const id = data.invmgrN_Id || data.INVMGRN_Id;
    const url = `/INV_T_GRNFacade/deactive?id=${id}`;
    return await api.post<any>('inventory', url, {});
}

export async function getInvTGRNItemTax(invtgrN_Id: number) {
    const data = { INVTGRN_Id: invtgrN_Id };
    const url = `/INV_T_GRNFacade/get_itemtax`;
    return await api.post<any>('inventory', url, data);
}

export async function getInvTGRNItemDetails(invmgrN_Id: number) {
    const data = { INVMGRN_Id: invmgrN_Id };
    const url = `/INV_T_GRNFacade/get_GRNitemDetails`;
    return await api.post<any>('inventory', url, data);
}

export async function getInvTGRNEditDetails(invmgrN_Id: number) {
    const url = `/INV_T_GRNFacade/editgrndetails?id=${invmgrN_Id}`;
    try {
        console.log(`getInvTGRNEditDetails: Fetching for ID ${invmgrN_Id}`);
        const response = await api.get<any>('inventory', url);

        console.log('getInvTGRNEditDetails: Raw Response:', JSON.stringify(response, null, 2));

        // Robust Extraction Logic (Same as LoadData)
        const extractData = (res: any, keyName: string): any[] => {
            if (!res) return [];

            // 1. Direct key match (case-insensitive) in root or data
            const findKey = (obj: any) => Object.keys(obj || {}).find(k => k.toLowerCase() === keyName.toLowerCase());

            let targetKey = findKey(res);
            if (targetKey && Array.isArray(res[targetKey])) return res[targetKey];

            if (res.data) {
                targetKey = findKey(res.data);
                if (targetKey && Array.isArray(res.data[targetKey])) return res.data[targetKey];
                if (targetKey && res.data[targetKey]?.$values) return res.data[targetKey].$values;
            }

            // 2. Fallback: Deep search for array with matching property pattern? 
            // Better to search for the specific array keys expected: 'edit_GRN', 'get_GRNItem', 'get_GRNItemTax'
            return [];
        };

        // Specific extractor for this edit response which likely contains multiple lists
        // Typically returns: edit_GRN, get_GRNItem, get_GRNItemTax
        const edit_GRN = extractData(response, 'edit_GRN');
        const get_GRNItem = extractData(response, 'get_GRNItem'); // or 'GRNItem'
        const get_GRNItemTax = extractData(response, 'get_GRNItemTax'); // or 'GRNItemTax'

        // If standard extraction fails, try deep recursive search for *any* array
        const deepFindArrays = (obj: any): { [key: string]: any[] } => {
            const found: { [key: string]: any[] } = {};
            if (!obj || typeof obj !== 'object') return found;

            Object.keys(obj).forEach(key => {
                if (Array.isArray(obj[key])) found[key] = obj[key];
                else if (typeof obj[key] === 'object') {
                    const nested = deepFindArrays(obj[key]);
                    Object.assign(found, nested);
                }
            });
            return found;
        };

        const allArrays = deepFindArrays(response);

        // Map extracted arrays to standardized structure based on user's API response
        // User Response Keys: grnItemDetails, grnMasterDetails, (and presumably grnTaxDetails if applicable)

        const masterDetails = extractData(response, 'grnMasterDetails');
        const itemDetails = extractData(response, 'grnItemDetails');
        const itemTaxDetails = extractData(response, 'grnTaxDetails'); // Assuming this might exist or is empty

        const final_GRN = masterDetails.length ? masterDetails : (edit_GRN.length ? edit_GRN : (allArrays['grnMasterDetails'] || []));
        const final_Items = itemDetails.length ? itemDetails : (get_GRNItem.length ? get_GRNItem : (allArrays['grnItemDetails'] || []));
        const final_Tax = itemTaxDetails.length ? itemTaxDetails : (get_GRNItemTax.length ? get_GRNItemTax : (allArrays['grnTaxDetails'] || []));

        // Ensure Items have UOM Name if available in different casing or alias
        const mappedItems = final_Items.map((item: any) => ({
            ...item,
            invmuoM_UOMName: item.invmuoM_UOMName || item.INVMUOM_UOMName || item.invmI_ItemName // Fallback or verify if data comes with UOM Name
        }));

        return {
            success: true,
            data: {
                edit_GRN: final_GRN,
                get_GRNItem: mappedItems,
                get_GRNItemTax: final_Tax
            }
        };

    } catch (error: any) {
        console.error('getInvTGRNEditDetails: FAILED', error);
        return { success: false, data: { edit_GRN: [], get_GRNItem: [], get_GRNItemTax: [] } }; // return empty structure on error
    }
}

export async function getItemTaxDetail(id: number) {
    const url = `/INV_T_GRNFacade/getItemTaxDetail?id=${id}`;
    try {
        const response = await api.get<any>('inventory', url);

        // Helper to extract array (reused logic)
        const getArray = (res: any, key: string) => {
            if (res?.data?.[key] && Array.isArray(res.data[key])) return res.data[key];
            if (res?.[key] && Array.isArray(res[key])) return res[key];
            if (res?.data?.[key]?.$values && Array.isArray(res.data[key].$values)) return res.data[key].$values;
            // Fallback: check if the response data itself is the array
            if (Array.isArray(res?.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        };

        const taxList = getArray(response, 'getItemTaxDetail'); // Try specific key, though likely it's just the root or data

        // Normalize tax properties
        const normalizedTax = taxList.map((t: any) => ({
            invmT_Id: t.invmT_Id ?? t.INVMT_Id ?? t.invmt_id,
            invmiT_TaxValue: t.invmiT_TaxValue ?? t.INVMIT_TaxValue ?? t.invmit_taxvalue ?? 0,
            invmT_TaxName: t.invmT_TaxName ?? t.INVMT_TaxName ?? t.invmt_taxname ?? '',
            invmiT_ActiveFlg: !!(t.invmiT_ActiveFlg ?? t.INVMIT_ActiveFlg ?? t.invmit_activeflg),
            invmT_TaxAliasName: t.invmT_TaxAliasName ?? t.INVMT_TaxAliasName ?? '',
            invmiT_Id: t.invmiT_Id ?? t.INVMIT_Id ?? 0
        }));

        return {
            success: true,
            data: normalizedTax
        };

    } catch (error) {
        console.error('getItemTaxDetail: FAILED', error);
        return { success: false, data: [] };
    }
}

export async function getInvItemDetail(itemId: number) {
    const data = { INVMI_Id: itemId };
    const url = `/INV_T_GRNFacade/getitemDetail`;
    try {
        const response = await api.post<any>('inventory', url, data);

        // Helper to extract array from various possible locations
        const getArray = (res: any, key: string) => {
            if (res?.data?.[key] && Array.isArray(res.data[key])) return res.data[key];
            if (res?.[key] && Array.isArray(res[key])) return res[key];
            if (res?.data?.[key]?.$values && Array.isArray(res.data[key].$values)) return res.data[key].$values;
            return [];
        };

        const itemDetails = getArray(response, 'get_itemDetail');
        const itemTax = getArray(response, 'get_itemTax');

        // Normalize tax properties to match frontend expectation
        const normalizedTax = itemTax.map((t: any) => ({
            invmT_Id: t.invmT_Id ?? t.INVMT_Id ?? t.invmt_id,
            invmiT_TaxValue: t.invmiT_TaxValue ?? t.INVMIT_TaxValue ?? t.invmit_taxvalue ?? 0,
            invmT_TaxName: t.invmT_TaxName ?? t.INVMT_TaxName ?? t.invmt_taxname ?? '',
            invmiT_ActiveFlg: !!(t.invmiT_ActiveFlg ?? t.INVMIT_ActiveFlg ?? t.invmit_activeflg),
            invmT_TaxAliasName: t.invmT_TaxAliasName ?? t.INVMT_TaxAliasName ?? '',
            invmiT_Id: t.invmiT_Id ?? t.INVMIT_Id ?? 0
        }));

        const normalizedDetails = itemDetails.map((d: any) => ({
            ...d,
            invmuoM_UOMName: d.invmuoM_UOMName ?? d.INVMUOM_UOMName
        }));

        return {
            success: true,
            data: {
                get_itemDetail: normalizedDetails,
                get_itemTax: normalizedTax
            }
        };
    } catch (error) {
        console.error('getInvItemDetail: FAILED', error);
        return { success: false, data: { get_itemDetail: [], get_itemTax: [] } };
    }
}

export async function getItemDetail(id: number) {
    const url = `/INV_T_GRNFacade/getItemDetail?id=${id}`;
    try {
        const response = await api.get<any>('inventory', url);

        // Helper to extract array from various possible locations (reused logic)
        const getArray = (res: any, key: string) => {
            if (Array.isArray(res)) return res;
            if (res && Array.isArray(res.data)) return res.data;
            if (res?.data?.[key] && Array.isArray(res.data[key])) return res.data[key];
            if (res?.[key] && Array.isArray(res[key])) return res[key];
            if (res?.data?.[key]?.$values && Array.isArray(res.data[key].$values)) return res.data[key].$values;
            return [];
        };

        const itemDetails = getArray(response, 'get_itemDetail');
        // If response.data was the array, itemDetails is now that array.

        // For itemTax, we might need a separate call or it might be in the same response if the response structure allows. 
        // But based on user input, the response above only showed item details. 
        // We'll stick to trying to find it using the key if it exists, or empty.
        const itemTax = getArray(response, 'get_itemTax');
        // Note: if itemDetails consumed the whole response as an array, itemTax might be the same array if we aren't careful? 
        // Actually if response.data is the array, getArray(..., 'get_itemTax') returns response.data again.
        // This is a risk if the API returns mixed data. 
        // refined check: 

        const getSpecificArray = (res: any, key: string) => {
            if (res?.data?.[key] && Array.isArray(res.data[key])) return res.data[key];
            if (res?.[key] && Array.isArray(res[key])) return res[key];
            if (res?.data?.[key]?.$values && Array.isArray(res.data[key].$values)) return res.data[key].$values;
            return [];
        }

        let finalItemDetails = getSpecificArray(response, 'get_itemDetail');
        if (finalItemDetails.length === 0) {
            // Fallback: Check if root or data is the array
            if (Array.isArray(response)) finalItemDetails = response;
            else if (response.data && Array.isArray(response.data)) finalItemDetails = response.data;
        }

        const finalItemTax = getSpecificArray(response, 'get_itemTax');

        // Normalize tax properties to match frontend expectation
        const normalizedTax = finalItemTax.map((t: any) => ({
            invmT_Id: t.invmT_Id ?? t.INVMT_Id ?? t.invmt_id,
            invmiT_TaxValue: t.invmiT_TaxValue ?? t.INVMIT_TaxValue ?? t.invmit_taxvalue ?? 0,
            invmT_TaxName: t.invmT_TaxName ?? t.INVMT_TaxName ?? t.invmt_taxname ?? '',
            invmiT_ActiveFlg: !!(t.invmiT_ActiveFlg ?? t.INVMIT_ActiveFlg ?? t.invmit_activeflg),
            invmT_TaxAliasName: t.invmT_TaxAliasName ?? t.INVMT_TaxAliasName ?? '',
            invmiT_Id: t.invmiT_Id ?? t.INVMIT_Id ?? 0
        }));

        const normalizedDetails = finalItemDetails.map((d: any) => ({
            ...d,
            invmuoM_UOMName: d.invmuoM_UOMName ?? d.INVMUOM_UOMName
        }));

        return {
            success: true,
            data: {
                get_itemDetail: normalizedDetails,
                get_itemTax: normalizedTax
            }
        };
    } catch (error) {
        console.error('getItemDetail: FAILED', error);
        return { success: false, data: { get_itemDetail: [], get_itemTax: [] } };
    }
}
