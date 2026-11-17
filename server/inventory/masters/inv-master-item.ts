'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvMasterItem, IInvMasterItemTax, IInvMasterItemLoadResponse } from '@/types/inventory/masters/inv-master-item';

export async function getInvMasterItem(searchParams?: ApiSearchparams) {
    console.log("getInvMasterItem: TRIGGERED.");
    const urlParams = getSearchParamsUrl(searchParams ?? {});

    // Using simple GET for load if it follows standard pattern, but previous patterns used POST.
    // AngularJS code used apiService.getURI.
    const url = `/INV_MasterItemFacade/getloaddata?${urlParams}`;

    try {
        const [response, mainGroupDropdownResponse, userGroupDropdownResponse, uomDropdownResponse, taxListResponse] = await Promise.all([
            api.post<any>('inventory', url, {}),
            api.post<any>('inventory', `/INV_MasterGroupFacade/loadMainGroupDropdown`, {}).catch(e => { console.error('MainGroupDropdown failed', e); return { data: [] }; }),
            api.post<any>('inventory', `/INV_MasterGroupFacade/loadUserGroupDropdown`, {}).catch(e => { console.error('UserGroupDropdown failed', e); return { data: [] }; }),
            api.post<any>('inventory', `/INV_MasterItemFacade/get_uomdropdown`, {}).catch(e => { console.error('UOMDropdown failed', e); return { data: [] }; }),
            api.post<any>('inventory', `/INV_MasterItemFacade/get_taxlist`, {}).catch(e => { console.error('TaxList failed', e); return { data: [] }; })
        ]);

        if (response.success === false && response.total === 0) {
            return {
                success: true,
                data: {
                    get_item: [],
                    get_tax: [],
                    get_itemgroup: [],
                    get_maingroup: [],
                    get_usergroup: [],
                    get_UOM: [],
                    companynames: [],
                    ledgernames: [],
                    companyconfig: [],
                    total: 0
                },
                message: response.message
            };
        }

        const extractArray = (res: any, key?: string): any[] => {
            if (!res) return [];
            const root = res.data || res;
            if (key) {
                const nested = root[key] || root[key.toLowerCase()] || root[key.toUpperCase()] || root.data?.[key];
                if (Array.isArray(nested)) return nested;
                if (nested?.$values && Array.isArray(nested.$values)) return nested.$values;
            }
            if (Array.isArray(root)) return root;
            if (root.$values && Array.isArray(root.$values)) return root.$values;
            if (Array.isArray(root.data)) return root.data;
            if (root.data?.$values && Array.isArray(root.data.$values)) return root.data.$values;
            return [];
        };

        const itemsRaw = extractArray(response, 'get_item');
        const items = itemsRaw.map((item: any) => ({
            ...item,
            invmI_Id: item.invmI_Id ?? item.INVMI_Id ?? item.id ?? 0,
            invmI_ItemName: item.invmI_ItemName ?? item.INVMI_ItemName ?? '',
            invmI_ItemCode: item.invmI_ItemCode ?? item.INVMI_ItemCode ?? '',
            invmG_Id: item.invmG_Id ?? item.INVMG_Id ?? 0,
            invmuoM_Id: item.invmuoM_Id ?? item.INVMUOM_Id ?? 0,
            invmI_TaxAplFlg: !!(item.invmI_TaxAplFlg ?? item.INVMI_TaxAplFlg),
            invmI_ActiveFlg: !!(item.invmI_ActiveFlg ?? item.INVMI_ActiveFlg ?? true)
        }));

        const taxesRaw = extractArray(taxListResponse, 'get_taxlist') || extractArray(taxListResponse);
        const taxes = taxesRaw.map((item: any) => ({
            invmT_Id: item.invmT_Id ?? item.INVMT_Id ?? item.id ?? 0,
            invmT_TaxName: item.invmT_TaxName ?? item.INVMT_TaxName ?? '',
            invmT_TaxAliasName: item.invmT_TaxAliasName ?? item.INVMT_TaxAliasName ?? '',
            invmiT_TaxValue: item.invmiT_TaxValue ?? item.INVMIT_TaxValue ?? 0,
            invmiT_Id: item.invmiT_Id ?? item.INVMIT_Id ?? 0
        }));

        const groupsRaw = extractArray(response, 'get_itemgroup');
        const groups = groupsRaw.map((item: any) => ({
            invmG_Id: item.invmG_Id ?? item.INVMG_Id ?? item.id ?? 0,
            invmG_GroupName: item.invmG_GroupName ?? item.INVMG_GroupName ?? '',
            invmG_ParentId: item.invmG_ParentId ?? item.INVMG_ParentId ?? 0
        }));

        const uomsRaw = extractArray(uomDropdownResponse);
        const uoms = uomsRaw.map((item: any) => ({
            invmuoM_Id: item.invmuoM_Id ?? item.INVMUOM_Id ?? item.id ?? 0,
            invmuoM_UOMName: item.invmuoM_UOMName ?? item.INVMUOM_UOMName ?? ''
        }));

        const companiesRaw = extractArray(response, 'companynames');
        const companies = companiesRaw.map((item: any) => ({
            famcomP_Id: item.famcomP_Id ?? item.FAMCOMP_Id ?? item.id ?? 0,
            famcomP_CompanyName: item.famcomP_CompanyName ?? item.FAMCOMP_CompanyName ?? ''
        }));

        const ledgersRaw = extractArray(response, 'ledgernames');
        const ledgers = ledgersRaw.map((item: any) => ({
            famleD_Id: item.famleD_Id ?? item.FAMLED_Id ?? item.id ?? 0,
            famleD_LedgerName: item.famleD_LedgerName ?? item.FAMLED_LedgerName ?? ''
        }));

        const configs = extractArray(response, 'companyconfig');

        // Extract and normalize main group dropdown data
        const mainGroupsRaw = extractArray(mainGroupDropdownResponse, 'get_maingroupdd');
        const mainGroups = mainGroupsRaw.map((item: any) => ({
            invmG_Id: item.invmG_Id ?? item.INVMG_Id ?? item.id ?? 0,
            invmG_GroupName: item.invmG_GroupName ?? item.INVMG_GroupName ?? ''
        }));

        // Extract and normalize user group dropdown data
        const userGroupsRaw = extractArray(userGroupDropdownResponse, 'get_usergroup');
        const userGroups = userGroupsRaw.map((item: any) => ({
            invmG_Id: item.invmG_Id ?? item.INVMG_Id ?? item.id ?? 0,
            invmG_GroupName: item.invmG_GroupName ?? item.INVMG_GroupName ?? '',
            invmG_ParentId: item.invmG_ParentId ?? item.INVMG_ParentId ?? 0
        }));

        return {
            success: true,
            data: {
                get_item: items,
                get_tax: taxes,
                get_itemgroup: groups,
                get_maingroup: mainGroups,
                get_usergroup: userGroups,
                get_UOM: uoms,
                companynames: companies,
                ledgernames: ledgers,
                companyconfig: configs,
                total: response?.total || items.length
            }
        } as any;

    } catch (error: any) {
        console.error('getInvMasterItem: FAILED', error);
        return {
            success: false,
            data: { get_item: [], get_tax: [], get_itemgroup: [], get_UOM: [], companynames: [], ledgernames: [], companyconfig: [], total: 0 }
        };
    }
}

export async function getItemTax(itemId: number) {
    const url = `/INV_MasterItemFacade/get_itemTax?id=${itemId}`;
    console.log("getItemTax: Calling URL:", url);
    try {
        const response: any = await api.post<any>('inventory', url, {});

        const extractData = (res: any) => {
            if (Array.isArray(res)) return res;
            if (res?.data && Array.isArray(res.data)) return res.data;
            if (res?.data?.$values && Array.isArray(res.data.$values)) return res.data.$values;
            return [];
        };

        const rawData = extractData(response);

        const normalize = (list: any[]) => list.map(t => ({
            invmiT_Id: t.invmiT_Id ?? t.INVMIT_Id ?? 0,
            invmT_Id: t.invmT_Id ?? t.INVMT_Id ?? 0,
            invmiT_TaxValue: t.invmiT_TaxValue ?? t.INVMIT_TaxValue ?? 0,
            invmT_TaxName: t.invmT_TaxName ?? t.INVMT_TaxName ?? '',
            invmT_TaxAliasName: t.invmT_TaxAliasName ?? t.INVMT_TaxAliasName ?? '',
            invmiT_ActiveFlg: t.invmiT_ActiveFlg ?? t.INVMIT_ActiveFlg ?? false
        }));

        const finalData = normalize(rawData);

        return {
            success: true,
            get_itemTax: finalData,
            data: response?.data || response
        };
    } catch (error) {
        console.error('getItemTax: FAILED', error);
        return { success: false, get_itemTax: [], data: null };
    }
}

export async function saveInvMasterItem(data: any) {
    const url = `/INV_MasterItemFacade/savedetails`;

    // Constructing exact payload structure as requested
    const payload = {
        invmg_Id: Number(data.invmG_Id) || 0,
        invmUOM_Id: Number(data.invmuoM_Id) || 0,
        invmi_ItemName: data.invmI_ItemName || '',
        invmi_MaxStock: Number(data.invmI_MaxStock) || 0,
        invmi_TaxAplFlg: !!data.invmI_TaxAplFlg,
        invmi_ItemCode: data.invmI_ItemCode || '',
        invmi_ReorderStock: Number(data.invmI_ReorderStock) || 0,
        invmi_HSNCode: data.invmI_HSNCode || '',
        invmi_RawMatFlg: !!data.invmI_RawMatFlg,
        invmi_ForSaleFlg: !!data.invmI_ForSaleFlg,
        invmi_MaintenanceAplFlg: !!data.invmI_MaintenanceAplFlg,
        INVMI_Id: Number(data.invmI_Id) || 0,
        tax_Applicable: (data.tax_Applicable || []).map((t: any) => ({
            invmiT_Id: Number(t.invmiT_Id) || 0,
            invmT_Id: Number(t.invmT_Id) || 0,
            invmiT_TaxValue: Number(t.invmiT_TaxValue) || 0,
            invmiT_ActiveFlg: true
        }))
    };

    console.log("saveInvMasterItem: Final Payload:", JSON.stringify(payload, null, 2));

    // According to the request, simple post to the URL with the JSON body
    return await api.post<any>('inventory', url, payload);
}

export async function deactivateInvMasterItem(data: IInvMasterItem) {
    const url = `/INV_MasterItemFacade/deactive?id=${data.invmI_Id}`;
    return await api.post<any>('inventory', url, {});
}

export async function deactivateItemTax(tax: any) {
    const url = `/INV_MasterItemFacade/deactiveitax?id=${tax.invmiT_Id}`;
    return await api.post<any>('inventory', url, {});
}
