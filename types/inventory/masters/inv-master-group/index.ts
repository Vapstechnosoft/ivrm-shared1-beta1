export interface IInvMasterMainGroup {
    invmG_Id: number;
    invmG_GroupName: string;
    invmG_AliasName: string;
    invmG_ParentId?: number;
    invmG_Level?: string;
    invmG_MGUGIGFlg?: string;
    invmG_GroupPrefix?: string;
    invmG_GroupSuffix?: string;
    invmG_GroupStartingNo?: string;
    invmG_ActiveFlg: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IInvMasterUserGroup {
    invmG_Id: number;
    invmG_GroupName: string;
    invmG_AliasName: string;
    invmG_ParentId: number;
    invmG_GroupName_mn?: string;
    invmG_ActiveFlg: boolean;
}

export interface IInvMasterItemGroup {
    invmG_Id: number;
    invmG_GroupName: string;
    invmG_AliasName: string;
    invmG_ParentId: number;
    invmG_ActiveFlg: boolean;
}

export interface IInvMasterGroupLoadResponse {
    success?: boolean;
    get_maingroup: IInvMasterMainGroup[];
    get_maingroupdd: IInvMasterMainGroup[];
    get_usergroup: IInvMasterUserGroup[];
    get_itemgroup: IInvMasterItemGroup[];
    get_usergp: IInvMasterUserGroup[];
    maingroupTotal: number;
    usergroupTotal: number;
    itemgroupTotal: number;
}
