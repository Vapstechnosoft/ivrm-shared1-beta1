export interface IInvMasterUOM {
    invmuoM_Id: number;
    invmuoM_UOMName: string;
    invmuoM_UOMAliasName?: string;
    invmuoM_Qty: string;
    invmuoM_ActiveFlg: boolean;
}

export interface IInvMasterUOMResponse {
    success: boolean;
    get_uom: IInvMasterUOM[];
}
