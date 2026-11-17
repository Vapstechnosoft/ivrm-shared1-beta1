'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvMasterItemGroup } from '@/types/inventory/masters/inv-master-group';

export async function fetchItemGroupData(searchParams?: ApiSearchparams): Promise<{ success: boolean; message?: string; data?: { get_itemgroup: IInvMasterItemGroup[]; get_usergroup: any[]; itemgroupTotal: number } }> {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const itemGroupListUrl = `/INV_MasterGroupFacade/loadItemGroup?${urlParams}`;
    const userGroupDropdownUrl = `/INV_MasterGroupFacade/loadUserGroupDropdown`;

    try {
        const [itemGroupResponse, userGroupDropdownResponse] = await Promise.all([
            api.post<any>('inventory', itemGroupListUrl, {}),
            api.post<any>('inventory', userGroupDropdownUrl, {})
        ]);

        if (itemGroupResponse.success === false && itemGroupResponse.total === 0) {
            return {
                success: true,
                data: {
                    get_itemgroup: [],
                    get_usergroup: [],
                    itemgroupTotal: 0
                },
                message: itemGroupResponse.message
            };
        }

        const extractData = (res: any): any[] => {
            if (!res) return [];
            if (Array.isArray(res)) return res;
            if (res.data && Array.isArray(res.data)) return res.data;
            if (res.data?.$values && Array.isArray(res.data.$values)) return res.data.$values;
            if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
            return [];
        };

        const rawItemGroups = extractData(itemGroupResponse);
        const rawUserGroupDropdown = extractData(userGroupDropdownResponse);

        const normalizedItemGroups = rawItemGroups.map((item: any) => ({
            invmG_Id: item.invmG_Id ?? item.INVMG_Id ?? item.id ?? item.invmg_id ?? 0,
            invmG_GroupName: item.invmG_GroupName ?? item.INVMG_GroupName ?? item.groupName ?? item.invmg_groupname ?? '',
            invmG_AliasName: item.invmG_AliasName ?? item.INVMG_AliasName ?? item.aliasName ?? item.invmg_aliasname ?? '',
            invmG_ParentId: item.invmG_ParentId ?? item.INVMG_ParentId ?? item.parentId ?? 0,
            invmG_ActiveFlg: item.invmG_ActiveFlg ?? item.INVMG_ActiveFlg ?? item.activeFlg ?? item.invmg_activeflg ?? false
        }));

        const normalizedUserGroupDropdown = rawUserGroupDropdown.map((item: any) => ({
            invmG_Id: item.invmG_Id ?? item.INVMG_Id ?? item.id ?? item.invmg_id ?? 0,
            invmG_GroupName: item.invmG_GroupName ?? item.INVMG_GroupName ?? item.groupName ?? item.invmg_groupname ?? '',
            invmG_ActiveFlg: item.invmG_ActiveFlg ?? item.INVMG_ActiveFlg ?? item.activeFlg ?? item.invmg_activeflg ?? false
        }));

        return {
            success: true,
            data: {
                get_itemgroup: normalizedItemGroups,
                get_usergroup: normalizedUserGroupDropdown,
                itemgroupTotal: itemGroupResponse.total || normalizedItemGroups.length
            }
        };
    } catch (error) {
        console.error('Error fetching Item Group data:', error);
        return {
            success: false,
            message: 'Failed to fetch Item Group data',
            data: {
                get_itemgroup: [],
                get_usergroup: [],
                itemgroupTotal: 0
            }
        };
    }
}
