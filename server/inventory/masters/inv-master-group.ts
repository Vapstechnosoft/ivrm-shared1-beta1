'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IInvMasterGroupLoadResponse,
    IInvMasterMainGroup,
    IInvMasterUserGroup,
    IInvMasterItemGroup
} from '@/types/inventory/masters/inv-master-group';

const DUMMY_MAIN_GROUPS: IInvMasterMainGroup[] = [
    { invmG_Id: 1, invmG_GroupName: 'Electronics', invmG_AliasName: 'Elec', invmG_GroupPrefix: 'EL', invmG_GroupSuffix: 'S', invmG_GroupStartingNo: '100', invmG_ActiveFlg: true },
    { invmG_Id: 2, invmG_GroupName: 'Furniture', invmG_AliasName: 'Furn', invmG_GroupPrefix: 'FU', invmG_GroupSuffix: 'N', invmG_GroupStartingNo: '200', invmG_ActiveFlg: true },
    { invmG_Id: 3, invmG_GroupName: 'Stationery', invmG_AliasName: 'Stat', invmG_GroupPrefix: 'ST', invmG_GroupSuffix: 'Y', invmG_GroupStartingNo: '300', invmG_ActiveFlg: true },
    { invmG_Id: 4, invmG_GroupName: 'Sports Equipment', invmG_AliasName: 'Sport', invmG_GroupPrefix: 'SP', invmG_GroupSuffix: 'E', invmG_GroupStartingNo: '400', invmG_ActiveFlg: true },
    { invmG_Id: 5, invmG_GroupName: 'Lab Instruments', invmG_AliasName: 'Lab', invmG_GroupPrefix: 'LB', invmG_GroupSuffix: 'I', invmG_GroupStartingNo: '500', invmG_ActiveFlg: true },
    { invmG_Id: 6, invmG_GroupName: 'Library Books', invmG_AliasName: 'Lib', invmG_GroupPrefix: 'LI', invmG_GroupSuffix: 'B', invmG_GroupStartingNo: '600', invmG_ActiveFlg: true },
    { invmG_Id: 7, invmG_GroupName: 'Housekeeping', invmG_AliasName: 'House', invmG_GroupPrefix: 'HK', invmG_GroupSuffix: 'P', invmG_GroupStartingNo: '700', invmG_ActiveFlg: true },
    { invmG_Id: 8, invmG_GroupName: 'Uniforms', invmG_AliasName: 'Uni', invmG_GroupPrefix: 'UN', invmG_GroupSuffix: 'M', invmG_GroupStartingNo: '800', invmG_ActiveFlg: true },
    { invmG_Id: 9, invmG_GroupName: 'Vehicles', invmG_AliasName: 'Veh', invmG_GroupPrefix: 'VE', invmG_GroupSuffix: 'H', invmG_GroupStartingNo: '900', invmG_ActiveFlg: true },
    { invmG_Id: 10, invmG_GroupName: 'IT Peripherals', invmG_AliasName: 'IT', invmG_GroupPrefix: 'IT', invmG_GroupSuffix: 'P', invmG_GroupStartingNo: '1000', invmG_ActiveFlg: true },
    { invmG_Id: 11, invmG_GroupName: 'Medical Supplies', invmG_AliasName: 'Med', invmG_GroupPrefix: 'MD', invmG_GroupSuffix: 'S', invmG_GroupStartingNo: '1100', invmG_ActiveFlg: true },
    { invmG_Id: 12, invmG_GroupName: 'Cafeteria', invmG_AliasName: 'Cafe', invmG_GroupPrefix: 'CF', invmG_GroupSuffix: 'T', invmG_GroupStartingNo: '1200', invmG_ActiveFlg: true },
    { invmG_Id: 13, invmG_GroupName: 'Gardening', invmG_AliasName: 'Gard', invmG_GroupPrefix: 'GR', invmG_GroupSuffix: 'D', invmG_GroupStartingNo: '1300', invmG_ActiveFlg: true },
    { invmG_Id: 14, invmG_GroupName: 'Music Instruments', invmG_AliasName: 'Music', invmG_GroupPrefix: 'MU', invmG_GroupSuffix: 'I', invmG_GroupStartingNo: '1400', invmG_ActiveFlg: true },
    { invmG_Id: 15, invmG_GroupName: 'Art Supplies', invmG_AliasName: 'Art', invmG_GroupPrefix: 'AR', invmG_GroupSuffix: 'S', invmG_GroupStartingNo: '1500', invmG_ActiveFlg: true },
    { invmG_Id: 16, invmG_GroupName: 'Building Material', invmG_AliasName: 'Build', invmG_GroupPrefix: 'BM', invmG_GroupSuffix: 'T', invmG_GroupStartingNo: '1600', invmG_ActiveFlg: true },
    { invmG_Id: 17, invmG_GroupName: 'Electricals', invmG_AliasName: 'Elect', invmG_GroupPrefix: 'EC', invmG_GroupSuffix: 'L', invmG_GroupStartingNo: '1700', invmG_ActiveFlg: true },
    { invmG_Id: 18, invmG_GroupName: 'Plumbing', invmG_AliasName: 'Plumb', invmG_GroupPrefix: 'PL', invmG_GroupSuffix: 'B', invmG_GroupStartingNo: '1800', invmG_ActiveFlg: true },
    { invmG_Id: 19, invmG_GroupName: 'Software Licenses', invmG_AliasName: 'Soft', invmG_GroupPrefix: 'SW', invmG_GroupSuffix: 'L', invmG_GroupStartingNo: '1900', invmG_ActiveFlg: true },
    { invmG_Id: 20, invmG_GroupName: 'Events', invmG_AliasName: 'Event', invmG_GroupPrefix: 'EV', invmG_GroupSuffix: 'T', invmG_GroupStartingNo: '2000', invmG_ActiveFlg: true }
];

const DUMMY_USER_GROUPS: IInvMasterUserGroup[] = [
    { invmG_Id: 101, invmG_GroupName: 'Computers', invmG_AliasName: 'Comp', invmG_ParentId: 1, invmG_GroupName_mn: 'Electronics', invmG_ActiveFlg: true },
    { invmG_Id: 102, invmG_GroupName: 'Chairs', invmG_AliasName: 'Cha', invmG_ParentId: 2, invmG_GroupName_mn: 'Furniture', invmG_ActiveFlg: true },
    { invmG_Id: 103, invmG_GroupName: 'Pens & Pencils', invmG_AliasName: 'Pen', invmG_ParentId: 3, invmG_GroupName_mn: 'Stationery', invmG_ActiveFlg: true },
    { invmG_Id: 104, invmG_GroupName: 'Footballs', invmG_AliasName: 'FBall', invmG_ParentId: 4, invmG_GroupName_mn: 'Sports Equipment', invmG_ActiveFlg: true },
    { invmG_Id: 105, invmG_GroupName: 'Microscopes', invmG_AliasName: 'Micro', invmG_ParentId: 5, invmG_GroupName_mn: 'Lab Instruments', invmG_ActiveFlg: true },
    { invmG_Id: 106, invmG_GroupName: 'Science Books', invmG_AliasName: 'SciBk', invmG_ParentId: 6, invmG_GroupName_mn: 'Library Books', invmG_ActiveFlg: true },
    { invmG_Id: 107, invmG_GroupName: 'Cleaning Agents', invmG_AliasName: 'Clean', invmG_ParentId: 7, invmG_GroupName_mn: 'Housekeeping', invmG_ActiveFlg: true },
    { invmG_Id: 108, invmG_GroupName: 'Boys Uniform', invmG_AliasName: 'BoyUni', invmG_ParentId: 8, invmG_GroupName_mn: 'Uniforms', invmG_ActiveFlg: true },
    { invmG_Id: 109, invmG_GroupName: 'School Buses', invmG_AliasName: 'Bus', invmG_ParentId: 9, invmG_GroupName_mn: 'Vehicles', invmG_ActiveFlg: true },
    { invmG_Id: 110, invmG_GroupName: 'Monitors', invmG_AliasName: 'Mon', invmG_ParentId: 1, invmG_GroupName_mn: 'Electronics', invmG_ActiveFlg: true },
    { invmG_Id: 111, invmG_GroupName: 'First Aid', invmG_AliasName: 'First', invmG_ParentId: 11, invmG_GroupName_mn: 'Medical Supplies', invmG_ActiveFlg: true },
    { invmG_Id: 112, invmG_GroupName: 'Snacks', invmG_AliasName: 'Snack', invmG_ParentId: 12, invmG_GroupName_mn: 'Cafeteria', invmG_ActiveFlg: true },
    { invmG_Id: 113, invmG_GroupName: 'Plants', invmG_AliasName: 'Plant', invmG_ParentId: 13, invmG_GroupName_mn: 'Gardening', invmG_ActiveFlg: true },
    { invmG_Id: 114, invmG_GroupName: 'Guitars', invmG_AliasName: 'Guit', invmG_ParentId: 14, invmG_GroupName_mn: 'Music Instruments', invmG_ActiveFlg: true },
    { invmG_Id: 115, invmG_GroupName: 'Paints', invmG_AliasName: 'Paint', invmG_ParentId: 15, invmG_GroupName_mn: 'Art Supplies', invmG_ActiveFlg: true },
    { invmG_Id: 116, invmG_GroupName: 'Cement', invmG_AliasName: 'Cem', invmG_ParentId: 16, invmG_GroupName_mn: 'Building Material', invmG_ActiveFlg: true },
    { invmG_Id: 117, invmG_GroupName: 'Wires', invmG_AliasName: 'Wire', invmG_ParentId: 17, invmG_GroupName_mn: 'Electricals', invmG_ActiveFlg: true },
    { invmG_Id: 118, invmG_GroupName: 'Pipes', invmG_AliasName: 'Pipe', invmG_ParentId: 18, invmG_GroupName_mn: 'Plumbing', invmG_ActiveFlg: true },
    { invmG_Id: 119, invmG_GroupName: 'Antivirus', invmG_AliasName: 'AV', invmG_ParentId: 19, invmG_GroupName_mn: 'Software Licenses', invmG_ActiveFlg: true },
    { invmG_Id: 120, invmG_GroupName: 'Annual Day', invmG_AliasName: 'AnnlDay', invmG_ParentId: 20, invmG_GroupName_mn: 'Events', invmG_ActiveFlg: true }
];

const DUMMY_ITEM_GROUPS: IInvMasterItemGroup[] = [
    { invmG_Id: 201, invmG_GroupName: 'Dell Laptops', invmG_AliasName: 'Dell', invmG_ParentId: 101, invmG_ActiveFlg: true },
    { invmG_Id: 202, invmG_GroupName: 'Plastic Chairs', invmG_AliasName: 'PCh', invmG_ParentId: 102, invmG_ActiveFlg: true },
    { invmG_Id: 203, invmG_GroupName: 'Ballpoint Pens', invmG_AliasName: 'BPen', invmG_ParentId: 103, invmG_ActiveFlg: true },
    { invmG_Id: 204, invmG_GroupName: 'Training Balls', invmG_AliasName: 'TrainB', invmG_ParentId: 104, invmG_ActiveFlg: true },
    { invmG_Id: 205, invmG_GroupName: 'Digital Microscope', invmG_AliasName: 'DigMicro', invmG_ParentId: 105, invmG_ActiveFlg: true },
    { invmG_Id: 206, invmG_GroupName: 'Physics Textbooks', invmG_AliasName: 'PhyTxt', invmG_ParentId: 106, invmG_ActiveFlg: true },
    { invmG_Id: 207, invmG_GroupName: 'Floor Cleaner', invmG_AliasName: 'FlrCln', invmG_ParentId: 107, invmG_ActiveFlg: true },
    { invmG_Id: 208, invmG_GroupName: 'Grade 1 Shirt', invmG_AliasName: 'G1Shirt', invmG_ParentId: 108, invmG_ActiveFlg: true },
    { invmG_Id: 209, invmG_GroupName: 'Mini Bus', invmG_AliasName: 'MiniB', invmG_ParentId: 109, invmG_ActiveFlg: true },
    { invmG_Id: 210, invmG_GroupName: 'HP Monitors', invmG_AliasName: 'HPMon', invmG_ParentId: 110, invmG_ActiveFlg: true },
    { invmG_Id: 211, invmG_GroupName: 'Bandages', invmG_AliasName: 'Band', invmG_ParentId: 111, invmG_ActiveFlg: true },
    { invmG_Id: 212, invmG_GroupName: 'Chips', invmG_AliasName: 'Chip', invmG_ParentId: 112, invmG_ActiveFlg: true },
    { invmG_Id: 213, invmG_GroupName: 'Rose Plants', invmG_AliasName: 'Rose', invmG_ParentId: 113, invmG_ActiveFlg: true },
    { invmG_Id: 214, invmG_GroupName: 'Acoustic Guitar', invmG_AliasName: 'AcGuit', invmG_ParentId: 114, invmG_ActiveFlg: true },
    { invmG_Id: 215, invmG_GroupName: 'Water Colors', invmG_AliasName: 'WatCol', invmG_ParentId: 115, invmG_ActiveFlg: true },
    { invmG_Id: 216, invmG_GroupName: 'Bricks', invmG_AliasName: 'Brick', invmG_ParentId: 116, invmG_ActiveFlg: true },
    { invmG_Id: 217, invmG_GroupName: 'Copper Wire', invmG_AliasName: 'CopWire', invmG_ParentId: 117, invmG_ActiveFlg: true },
    { invmG_Id: 218, invmG_GroupName: 'PVC Pipes', invmG_AliasName: 'PVC', invmG_ParentId: 118, invmG_ActiveFlg: true },
    { invmG_Id: 219, invmG_GroupName: 'Office 365', invmG_AliasName: 'O365', invmG_ParentId: 119, invmG_ActiveFlg: true },
    { invmG_Id: 220, invmG_GroupName: 'Trophies', invmG_AliasName: 'Trophy', invmG_ParentId: 120, invmG_ActiveFlg: true }
];

export async function fetchInvMasterGroupData(searchParams?: ApiSearchparams): Promise<{ success: boolean; message?: string; data?: IInvMasterGroupLoadResponse }> {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const mainGroupListUrl = `/INV_MasterGroupFacade/loadMainGroup?${urlParams}`;
    const mainGroupDropdownUrl = `/INV_MasterGroupFacade/loadMainGroupDropdown`;

    try {
        const [mainGroupResponse, mainGroupDropdownResponse] = await Promise.all([
            api.post<any>('inventory', mainGroupListUrl, {}),
            api.post<any>('inventory', mainGroupDropdownUrl, {})
        ]);

        if (mainGroupResponse.success === false && mainGroupResponse.total === 0) {
            return {
                success: true,
                data: {
                    success: true,
                    get_maingroup: [],
                    get_maingroupdd: [],
                    get_usergroup: [],
                    get_itemgroup: [],
                    get_usergp: [],
                    maingroupTotal: 0,
                    usergroupTotal: 0,
                    itemgroupTotal: 0,
                },
                message: mainGroupResponse.message
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

        const rawMainGroups = extractData(mainGroupResponse);
        const rawMainGroupDropdown = extractData(mainGroupDropdownResponse);

        const normalizeMainGroup = (list: any[]) => list.map(item => ({
            invmG_Id: item.invmG_Id ?? item.INVMG_Id ?? item.id ?? item.invmg_id ?? 0,
            invmG_GroupName: item.invmG_GroupName ?? item.INVMG_GroupName ?? item.groupName ?? item.invmg_groupname ?? '',
            invmG_AliasName: item.invmG_AliasName ?? item.INVMG_AliasName ?? item.aliasName ?? item.invmg_aliasname ?? '',
            invmG_GroupPrefix: item.invmG_GroupPrefix ?? item.INVMG_GroupPrefix ?? item.groupPrefix ?? '',
            invmG_GroupSuffix: item.invmG_GroupSuffix ?? item.INVMG_GroupSuffix ?? item.groupSuffix ?? '',
            invmG_GroupStartingNo: item.invmG_GroupStartingNo ?? item.INVMG_GroupStartingNo ?? item.groupStartingNo ?? '',
            invmG_ActiveFlg: item.invmG_ActiveFlg ?? item.INVMG_ActiveFlg ?? item.activeFlg ?? item.invmg_activeflg ?? false,
            invmG_Level: item.invmG_Level ?? item.INVMG_Level ?? item.level ?? item.invmg_level ?? '',
            invmG_MGUGIGFlg: item.invmG_MGUGIGFlg ?? item.INVMG_MGUGIGFlg ?? item.mgugigFlg ?? '',
            invmG_ParentId: item.invmG_ParentId ?? item.INVMG_ParentId ?? item.parentId ?? 0
        }));

        const mainGroups = normalizeMainGroup(rawMainGroups);
        const mainGroupDropdown = normalizeMainGroup(rawMainGroupDropdown);

        return {
            success: true,
            data: {
                success: true,
                get_maingroup: mainGroups,
                get_maingroupdd: mainGroupDropdown,
                get_usergroup: [],
                get_itemgroup: [],
                get_usergp: [],
                maingroupTotal: mainGroupResponse.total || mainGroups.length,
                usergroupTotal: 0,
                itemgroupTotal: 0,
            }
        };
    } catch (error) {
        console.error('Error fetching Master Group data:', error);
        return {
            success: false,
            message: 'Failed to fetch Master Group data',
            data: {
                get_maingroup: [],
                get_maingroupdd: [],
                get_usergroup: [],
                get_itemgroup: [],
                get_usergp: [],
                maingroupTotal: 0,
                usergroupTotal: 0,
                itemgroupTotal: 0,
            }
        };
    }
}

export async function saveInvMasterMainGroup(data: any) {
    const payload = {
        INVMG_Id: data.invmG_Id || 0,
        INVMG_GroupName: data.invmG_GroupName,
        INVMG_AliasName: data.invmG_AliasName,
        INVMG_GroupPrefix: data.invmG_GroupPrefix,
        INVMG_GroupSuffix: data.invmG_GroupSuffix,
        INVMG_GroupStartingNo: data.invmG_GroupStartingNo,
        INVMG_ActiveFlg: data.invmG_ActiveFlg,
        INVMG_MGUGIGFlg: 'MG'
    };

    const url = `/INV_MasterGroupFacade/savedetails`;
    return await api.post<any>('inventory', url, payload);
}

export async function saveInvMasterUserGroup(data: any) {
    const params = new URLSearchParams();
    const mapping: Record<string, string> = {
        invmG_Id: 'INVMG_Id',
        invmG_GroupName: 'INVMG_GroupName',
        invmG_AliasName: 'INVMG_AliasName',
        invmG_ParentId: 'INVMG_ParentId',
        invmG_ActiveFlg: 'INVMG_ActiveFlg'
    };

    for (const key in data) {
        const apiKey = mapping[key] || key;
        const val = data[key];

        // Skip ID if it's 0 (new record)
        if (apiKey === 'INVMG_Id' && (val === 0 || !val)) continue;

        if (val !== undefined && val !== null) {
            params.append(apiKey, val.toString());
        }
    }
    // Remove INVMG_MGUGIGFlg as it is not in the user provided example for savedetailsUG

    const url = `/INV_MasterGroupFacade/savedetailsUG?${params.toString()}`;
    return await api.post<any>('inventory', url, {});
}

export async function saveInvMasterItemGroup(data: any) {
    const params = new URLSearchParams();
    const mapping: Record<string, string> = {
        invmG_Id: 'INVMG_Id',
        invmG_GroupName: 'INVMG_GroupName',
        invmG_AliasName: 'INVMG_AliasName',
        invmG_ParentId: 'INVMG_ParentId',
        invmG_ActiveFlg: 'INVMG_ActiveFlg'
    };

    for (const key in data) {
        const apiKey = mapping[key] || key;
        const val = data[key];
        if (val !== undefined && val !== null) {
            params.append(apiKey, val.toString());
        }
    }
    params.append('INVMG_MGUGIGFlg', 'IG');

    const url = `/INV_MasterGroupFacade/savedetailsIG?${params.toString()}`;
    return await api.post<any>('inventory', url, {});
}

export async function deactivateInvMasterGroup(data: any) {
    const url = `/INV_MasterGroupFacade/deactive?id=${data.invmG_Id}`;
    return await api.post<any>('inventory', url, {});
}
