export interface IInvTGRN {
    invmgrN_Id: number;
    invmgrN_GRNNo?: string;
    invmgrN_InvoiceNo?: string;
    invmgrN_PurchaseDate: string | Date;
    invmgrN_PurchaseValue: number;
    invmgrN_TotDiscount: number;
    invmgrN_TotTaxAmt: number;
    invmgrN_TotalAmount: number;
    invmgrN_Remarks?: string;
    invmgrN_ReturnFlg: boolean;
    invmgrN_PaidFlg: boolean;
    invmgrN_CreditFlg: boolean;
    invmsT_Id: number;
    invmS_Id: number;
    invmgrN_POReference?: string;
    invmgrN_EWayBillRef?: string;
    invmgrN_TowardsProjects?: string;
    invmgrN_PODate?: string | Date;
    invmgrN_Prepared?: string;
    invmgrN_SignedBy?: string;
    invmgrN_ChallanNo?: string;
    invmgrN_Challandate?: string | Date;
    invmgrN_Challanverfied?: string;
    invmgrN_KitNo?: string;
    invmgrN_ActiveFlg: boolean;
    invmS_StoreName?: string;
    invmS_SupplierName?: string;
    invtgrN_ActiveFlg?: boolean;
}

export interface IInvTGRNItem {
    invtgrN_Id: number;
    invmgrN_Id: number;
    invmI_Id: number;
    invmuoM_Id: number;
    invtgrN_BatchNo: string;
    invtgrN_Qty: number;
    invtgrN_MfgDate?: string | Date;
    invtgrN_ExpDate?: string | Date;
    invtgrN_PurchaseRate: number;
    invtgrN_MRP: number;
    invtgrN_DiscountAmt: number;
    invtgrN_SalesPrice: number;
    invtgrN_Amount: number;
    invtgrN_Naration?: string;
    invtgrN_TaxAmt: number;
    invtgrN_ActiveFlg: boolean;
    invmI_ItemName?: string;
    invmuoM_UOMName?: string;
    GRNItemTax?: IInvTGRNItemTax[];
}

export interface IInvTGRNItemTax {
    invtgrnT_Id: number;
    invtgrN_Id: number;
    invmT_Id: number;
    invtgrnT_TaxPer: number;
    invtgrnT_TaxAmt: number;
    invtgrnT_ActiveFlg: boolean;
    invmT_TaxName?: string;
}

export interface IInvTGRNLoadData {
    get_item: any[];
    get_Store: any[];
    get_supplier: any[];
    get_tax: any[];
    get_GRN: IInvTGRN[];
    total?: number;
}
