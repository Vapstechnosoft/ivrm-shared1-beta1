export interface InvVendorPayment {
    invspT_Id: number;
    invmS_Id: number;
    invmS_SupplierName?: string;
    invspT_PaymentDate: string | Date;
    invspT_ModeOfPayment: string;
    invspT_BankName?: string;
    invspT_ChequeDDNo?: string;
    invspT_ChequeDDDate?: string | Date;
    invspT_PaymentReference?: string;
    invspT_Amount: number;
    invspT_Remarks?: string;
    invspT_ActiveFlg?: boolean;
    invmpI_Id?: number;
    invpitS_Id?: number;
    mI_Id?: number;
    asmaY_Id?: number;
    createdDate?: string | Date;
    updatedDate?: string | Date;
    paymentArray?: InvVendorPaymentDetail[];
}

export interface InvVendorPaymentDetail {
    invsptgrN_Id: number;
    invmgrN_Id: number;
    invmgrN_GRNNo?: string;
    invmgrN_PurchaseValue: number;
    invmgrN_TotalPaid: number;
    invmgrN_TotalBalance: number;
    invsptgrN_Amount: number;
    invsptgrN_Remarks?: string;
    invsptgrN_ActiveFlg?: boolean;
    checkedvalue?: boolean;
    // Helper fields for UI
    paystatus?: string;
    INVMGRN_TotalBalance_New?: number;
    INVSPTGRN_Amount_New?: number;
    finalamount?: number;
}
