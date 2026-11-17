
export interface IInvRStockLoadData {
    // This will handle the dynamic list based on option flag
    stockDetails?: IInvRStockEntity[];
}

export interface IInvRStockEntity {
    // Common ID/Name or specific ones
    id: number;
    name: string;

    // Item
    invmI_Id?: number;
    invmI_ItemName?: string;
    invmI_ItemCode?: string;

    // Store
    invmsT_Id?: number;
    invmS_StoreName?: string;

    // Group
    invmG_Id?: number;
    invmG_GroupName?: string;
}

export interface IInvRStockReportData {
    sno?: number;
    invmI_ItemName?: string;
    // Common fields
    purOBQty?: number;     // Opening Balance
    salesQty?: number;     // Sale Qty
    invstO_ItemConQty?: number; // Item Consumption
    invstO_CheckedOutQty?: number; // Checked Out
    invstO_PhyPlusQty?: number; // Stock +
    invstO_PhyMinQty?: number; // Stock -
    invstO_AvaiableStock?: number; // Balance / Available / Closing Stock

    // Non-Overall specific fields
    invstO_PurchaseRate?: number; // Rate
    obAmount?: number; // OB Amount
}

export interface IInvRStockPayload {
    optionflag: string; // All, Item, Store, Group
    overallflag: boolean; // mapped to "Overall" or ""
    bw_dates: boolean;
    startdate?: string;
    enddate?: string;

    // IDs
    invmI_Id?: number;
    invmsT_Id?: number;
    invmG_Id?: number;
}
