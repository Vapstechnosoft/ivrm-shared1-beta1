
export interface IInvRGRNLoadData {
    get_grn_item_supplier: IInvRGRNItemSupplier[];
    get_grnreport: IInvRGRNReportData[];
}

export interface IInvRGRNItemSupplier {
    invmgrN_Id?: number; // For GRN
    invmgrN_GRNNo?: string;
    invmI_Id?: number; // For Item
    invmI_ItemName?: string;
    invmS_Id?: number; // For Supplier
    invmS_SupplierName?: string;
    // Common selection flag
    checked?: boolean;
}

export interface IInvRGRNReportData {
    // Common
    rowNumber?: number;
    invmgrN_PurchaseDate?: string;
    invmgrn_purchasedate?: string; // from API

    // Detailed/All
    invmgrN_GRNNo?: string;
    invmgrn_grnno?: string; // from API

    invmS_SupplierName?: string;
    invms_suppliername?: string; // from API
    invms_supplierconatctperson?: string; // From API

    invmI_ItemName?: string;
    invmi_itemname?: string; // from API

    invmuoM_UOMName?: string;
    invmuom_uomname?: string; // from API

    invtgrN_Qty?: number;
    invtgrn_qty?: number; // from API

    invtgrN_PurchaseRate?: number;
    invtgrn_purchaserate?: number; // from API

    invtgrN_MRP?: number;
    invtgrn_mrp?: number; // from API

    invtgrN_SalesPrice?: number;
    invtgrn_salesprice?: number; // from API

    invtgrN_DiscountAmt?: number;
    invtgrn_discountamt?: number; // from API

    invtgrN_TaxAmt?: number;
    invtgrn_taxamt?: number; // from API

    invtgrN_Amount?: number;
    invtgrn_amount?: number; // from API

    invtgrN_BatchNo?: string;
    invtgrn_batchno?: string; // from API

    // Overall fields
    invmI_ItemCode?: string;
    invmi_itemcode?: string; // from API
    grnQuantity?: number;
    grnquantity?: number;
    grnRate?: number;
    grnrate?: number;
    grnMRP?: number;
    grnmrp?: number;
    grnSalePrice?: number;
    grnsaleprice?: number;
    grnDiscount?: number;
    grndiscount?: number;
    grnTax?: number;
    grntax?: number;
    grnAmount?: number;
    grnamount?: number;

    // Supplier Specific
    invmS_SupplierCode?: string;
    invmS_SupplierConatctNo?: string;
    invms_supplierconatctno?: string; // from API

    invmS_EmailId?: string;
    invms_emailid?: string; // from API

    invms_supplieraddress?: string; // from API
    invtgrn_activeflg?: boolean; // from API
    invmgrn_invoiceno?: string; // from API
}

export interface IInvRGRNPayload {
    optionflag: string;
    typeflag: string;
    startdate?: string | Date; // Formatted date string
    enddate?: string | Date;
    bwdateflag: boolean;
    grnArray?: IInvRGRNItemSupplier[];
    itemArray?: IInvRGRNItemSupplier[];
    supplierArray?: IInvRGRNItemSupplier[];
}
