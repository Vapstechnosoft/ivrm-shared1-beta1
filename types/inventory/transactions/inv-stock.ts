
export interface InvStock {
    invstO_Id: number;
    invmsT_Id: number;
    invmS_StoreName?: string;
    invmI_Id: number;
    invmI_ItemName?: string;
    invstO_BatchNo: string;
    invstO_PurchaseDate: string;
    invstO_PurchaseRate: number;
    invstO_SalesRate: number;
    invstO_ItemConQty: number;
    invstO_PurOBQty: number;
    invstO_PurRetQty: number;
    invstO_SalesQty: number;
    invstO_SalesRetQty: number;
    invstO_MatIssPlusQty: number;
    invstO_MatIssMinusQty: number;
    invstO_PhyPlusQty: number;
    invstO_PhyMinQty: number;
    invstO_AvaiableStock: number;
    createdDate?: string;
    updatedDate?: string;
}

export interface InvStockInput {
    stocklist: {
        invmsT_Id: number;
        invmI_Id: number;
        invstO_BatchNo: string;
        invstO_PurchaseDate: Date;
        invstO_PurchaseRate: number;
        invstO_ItemConQty: number;
        invstO_PurOBQty: number;
        invstO_PurRetQty: number;
        invstO_SalesRate: number;
        invstO_SalesQty: number;
        invstO_SalesRetQty: number;
        invstO_MatIssPlusQty: number;
        invstO_MatIssMinusQty: number;
        invstO_PhyPlusQty: number;
        invstO_PhyMinQty: number;
        invstO_AvaiableStock: number;
        invstO_Id: number;
    }[];
}
