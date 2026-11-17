export interface IInvTSales {
    invmsL_Id: number;
    invmsL_SalesNo: string;
    invmsL_SalesDate: string;
    invmsL_SalesValue: number;
    invmsL_TotDiscount: number;
    invmsL_TotTaxAmt: number;
    invmsL_TotalAmount: number;
    invmsL_Remarks: string;
    invmsL_StuOtherFlg: string;
    invmsT_Id: number;
    invmS_StoreName?: string;
    invmsL_ActiveFlg: boolean;
    // For specific types
    amsT_Id?: number;
    studentName?: string;
    hrmE_Id?: number;
    employeeName?: string;
    invmC_Id?: number;
    customerName?: string;
}

export interface IInvTSalesItem {
    invtsL_Id: number;
    invmsL_Id: number;
    invmI_Id: number;
    invmI_ItemName?: string;
    invmuoM_Id: number;
    invmuoM_UOMName?: string;
    invtsL_BatchNo: string;
    invtsL_SalesQty: number;
    invtsL_SalesPrice: number;
    invtsL_DiscountAmt: number;
    invtsL_TaxAmt: number;
    invtsL_Amount: number;
    invtsL_Naration: string;
    invtsL_ActiveFlg: boolean;
}

export interface IInvTSalesLoadData {
    get_Sale: IInvTSales[];
    total: number;
    get_Store: any[];
    get_Product: any[];
    get_employee: any[];
    get_customer: any[];
    get_item?: any[]; // For item dropdown
}
