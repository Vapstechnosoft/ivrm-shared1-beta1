export interface IInvItemStoreMapping {
    invmsT_Id: number;
    invmsT_StoreName: string;
    invmI_Id: number;
    invmI_ItemName: string;
    invmG_Id: number;
    invmG_GroupName: string;
    invmisM_Id: number;
    invmisM_ActiveFlg: boolean;
}

export interface IInvItemStoreMappingLoadData {
    get_store: Array<{ invmsT_Id: number; invmS_StoreName: string }>;
    get_maingroup: Array<{ invmG_Id: number; invmG_GroupName: string }>;
    get_usergroup: Array<{ invmG_Id: number; invmG_GroupName: string; invmG_ParentId: number }>;
    get_itemgroup: Array<{ invmG_Id: number; invmG_GroupName: string; invmG_ParentId: number }>;
    get_item: Array<{ invmI_Id: number; invmI_ItemName: string; invmG_Id: number }>;
    get_mapped_items: IInvItemStoreMapping[];
}
