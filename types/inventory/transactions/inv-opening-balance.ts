
export interface IInvOpeningBalance {
    invoB_Id: number;
    invmsT_Id: number;
    invmI_Id: number;
    invmuoM_Id: number;
    invoB_BatchNo: string;
    invoB_PurchaseDate: string;
    invoB_Qty: number;
    invoB_PurchaseRate: number;
    invoB_SaleRate: number;
    invoB_Naration: string;
    invoB_ActiveFlg: boolean;
    invoB_MfgDate?: string;
    invoB_ExpDate?: string;

    // Additional display fields
    invmS_StoreName?: string;
    invmI_ItemName?: string;
    invmuoM_UOMName?: string;
    invoB_TAmount?: number; // Calculated total amount
}

export interface IInvOpeningBalanceLoadData {
    get_Store: IInvStoreDropdown[];
    get_item: IInvItemDropdown[];
    get_openingbalance: IInvOpeningBalance[];
    total: number;
}

export interface IInvStoreDropdown {
    invmsT_Id: number;
    invmS_StoreName: string;
}

export interface IInvItemDropdown {
    invmI_Id: number;
    invmI_ItemName: string;
}

export interface IInvOpeningBalanceDetail {
    invmI_Id: number;
    invmuoM_Id: number;
    invoB_BatchNo: string;
    invoB_PurchaseDate: string | Date;
    invoB_Qty: number;
    invstO_PurchaseRate: number;
    invstO_SalesRate: number;
    invoB_Naration: string;

    // UI specific
    invmI_ItemName?: string;
    invmuoM_UOMName?: string;
    invoB_TotalAmount?: number;
    itrS_Id: string; // unique id for rows
}

// For saving
export interface IInvOpeningBalanceSave {
    INVMST_Id: number;
    INVOB_Id: number;
    OBItem: IInvOpeningBalanceItemSave[];
    IMFY_Id?: number;
}

export interface IInvOpeningBalanceItemSave {
    INVMI_Id: number;
    INVOB_PurchaseDate: string;
    INVMUOM_Id: number;
    INVOB_BatchNo: string;
    INVOB_PurchaseRate: number;
    INVOB_SaleRate: number;
    INVOB_Qty: number;
    INVOB_Naration: string;
    INVOB_MfgDate?: string;
    INVOB_ExpDate?: string;
}
