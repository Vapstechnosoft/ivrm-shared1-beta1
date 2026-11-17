'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IInvMasterUserGroup } from '@/types/inventory/masters/inv-master-group';

export async function fetchUserGroupData(searchParams?: ApiSearchparams): Promise<{ success: boolean; message?: string; data?: { get_usergroup: IInvMasterUserGroup[]; get_maingroupdd?: any[]; usergroupTotal: number } }> {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const userGroupListUrl = `/INV_MasterGroupFacade/loadUserGroup?${urlParams}`;
    const mainGroupDropdownUrl = `/INV_MasterGroupFacade/loadMainGroupDropdown`;

    try {
        const [userGroupResponse, mainGroupDropdownResponse] = await Promise.all([
            api.post<any>('inventory', userGroupListUrl, {}),
            api.post<any>('inventory', mainGroupDropdownUrl, {})
        ]);

        if (userGroupResponse.success === false && userGroupResponse.total === 0) {
            return {
                success: true,
                data: {
                    get_usergroup: [],
                    get_maingroupdd: [],
                    usergroupTotal: 0
                },
                message: userGroupResponse.message
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

        const rawUserGroups = extractData(userGroupResponse);
        const rawMainGroupDropdown = extractData(mainGroupDropdownResponse);

        const normalizedUserGroups = rawUserGroups.map((item: any) => ({
            invmG_Id: item.invmG_Id ?? item.INVMG_Id ?? item.id ?? item.invmg_id ?? 0,
            invmG_GroupName: item.invmG_GroupName ?? item.INVMG_GroupName ?? item.groupName ?? item.invmg_groupname ?? '',
            invmG_AliasName: item.invmG_AliasName ?? item.INVMG_AliasName ?? item.aliasName ?? item.invmg_aliasname ?? '',
            invmG_ParentId: item.invmG_ParentId ?? item.INVMG_ParentId ?? item.parentId ?? 0,
            invmG_GroupName_mn: item.invmG_GroupName_mn ?? item.INVMG_GroupName_mn ?? item.groupNameMn ?? '',
            invmG_ActiveFlg: item.invmG_ActiveFlg ?? item.INVMG_ActiveFlg ?? item.activeFlg ?? item.invmg_activeflg ?? false
        }));

        const normalizedMainGroupDropdown = rawMainGroupDropdown.map((item: any) => ({
            invmG_Id: item.invmG_Id ?? item.INVMG_Id ?? item.id ?? item.invmg_id ?? 0,
            invmG_GroupName: item.invmG_GroupName ?? item.INVMG_GroupName ?? item.groupName ?? item.invmg_groupname ?? '',
            invmG_ActiveFlg: item.invmG_ActiveFlg ?? item.INVMG_ActiveFlg ?? item.activeFlg ?? item.invmg_activeflg ?? false
        }));

        return {
            success: true,
            data: {
                get_usergroup: normalizedUserGroups,
                get_maingroupdd: normalizedMainGroupDropdown,
                usergroupTotal: userGroupResponse.total || normalizedUserGroups.length
            }
        };
    } catch (error) {
        console.error('Error fetching User Group data:', error);
        return {
            success: false,
            message: 'Failed to fetch User Group data',
            data: {
                get_usergroup: [],
                usergroupTotal: 0
            }
        };
    }
}
