'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvItemStoreMapping, IInvItemStoreMappingLoadData } from '@/types/inventory/masters/inv-item-store-mapping';

export async function getInvItemStoreMappingLoadData(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/INV_ItemStoreMapping/getloaddata?${urlParams}`;

    try {
        const response = await api.get<IInvItemStoreMappingLoadData>('inventory', url);
        if (response.success && response.data) {
            return response;
        }

        if (response.success === false && (response as any).total === 0) {
            return {
                success: true,
                message: response.message,
                data: {
                    get_store: [],
                    get_maingroup: [],
                    get_usergroup: [],
                    get_itemgroup: [],
                    get_item: [],
                    get_mapped_items: []
                }
            };
        }

        // Dummy Data Fallback
        return {
            success: true,
            message: 'Data fetched successfully (Dummy)',
            data: {
                get_store: [
                    { invmsT_Id: 1, invmS_StoreName: 'Main Store' },
                    { invmsT_Id: 2, invmS_StoreName: 'Sub Store 1' }
                ],
                get_maingroup: [
                    { invmG_Id: 10, invmG_GroupName: 'Group A' }
                ],
                get_usergroup: [],
                get_itemgroup: [],
                get_item: [
                    { invmI_Id: 101, invmI_ItemName: 'Item 1', invmG_Id: 10 },
                    { invmI_Id: 102, invmI_ItemName: 'Item 2', invmG_Id: 10 }
                ],
                get_mapped_items: [
                    {
                        invmsT_Id: 1,
                        invmsT_StoreName: 'Main Store',
                        invmI_Id: 101,
                        invmI_ItemName: 'Item 1',
                        invmG_Id: 10,
                        invmG_GroupName: 'Group A',
                        invmisM_Id: 501,
                        invmisM_ActiveFlg: true
                    }
                ]
            }
        };
    } catch (error) {
        console.error('Error fetching Item Store Mapping data:', error);
        return {
            success: false,
            message: 'Failed to fetch data',
            data: null
        } as any;
    }
}

export async function saveInvItemStoreMapping(data: any) {
    const url = `/INV_ItemStoreMapping/savedetails`;
    return await api.post<any>('inventory', url, data);
}

export async function deactivateInvItemStoreMapping(data: any) {
    const url = `/INV_ItemStoreMapping/deactive`;
    return await api.post<any>('inventory', url, data);
}
