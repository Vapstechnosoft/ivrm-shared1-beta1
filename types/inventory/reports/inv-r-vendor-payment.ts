
export interface IInvVendorPaymentReportPayload {
    Fromdate: string;
    Todate: string;
    reporttype: "Overall" | "Vendor";
    page?: number;
    page_size?: number;
}

export interface IInvVendorPaymentOverallReport {
    invmS_Id: string;
    invmS_SupplierName: string;
    invspT_PaymentDate: string;
    invspT_ModeOfPayment: string;
    invspT_ChequeDDNo?: string;
    invspT_BankName?: string;
    invspT_ChequeDDDate?: string;
    invmgrN_Id: string;
    invmgrN_GRNNo: string;
    invsptgrN_Amount: string | number;
    invmgrN_TotalPaid: string | number;
    invmgrN_TotalBalance: string | number;
    invsptgrN_ActiveFlg: string;
    invspT_Remarks: string;
}

export interface IInvVendorPaymentVendorReport {
    invmS_Id: number;
    vendorName: string;
    gstNo: string;
    totalAmount: number;
    totalPaidAmount: number;
    balanceAmount: number;
}

export interface IInvVendorPaymentDetailsPayload {
    INVMS_Id: number;
    Fromdate: string;
    Todate: string;
}

export interface IInvVendorPaymentDetails {
    grnno: string;
    invmgrN_PurchaseDate: string;
    totalAmount: number;
    totalPaidAmount: number;
    balanceAmount: number;
}

export interface IInvVendorPaymentResponse {
    success: boolean;
    message: string;
    data: IInvVendorPaymentOverallReport[] | any;
    total?: number;
    page?: number;
    page_size?: number;
}
