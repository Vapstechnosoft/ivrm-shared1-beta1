export interface AcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    Selected?: boolean;
}

export interface FeeReceipt {
    fyP_Id: number;
    fyP_Receipt_No: string;
    fyP_Date: string;
    Selected?: boolean;
}

export interface StudentDetails {
    AMST_AdmNo: string;
    AMST_FirstName: string;
    AMST_MiddleName?: string;
    AMST_LastName?: string;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    AMST_FatherName: string;
    AMST_MotherName: string;
    FMCC_ConcessionName: string;
    AMAY_RollNo?: number;
    amst_mobile?: number;
    receiptno: string;
    Paid_Date: string;
    period?: string;
    asmaY_Year: string;
}

export interface FeeHead {
    fmH_FeeName: string;
    totalcharges: number;
    ftP_Paid_Amt: number;
    ftP_Concession_Amt: number;
    ftP_Fine_Amt: number;
    fsS_AdjustedAmount?: number;
}

export interface PaymentDetails {
    ftP_Paid_Amt: number;
    ftP_Concession_Amt: number;
    fyP_Bank_Or_Cash: string;
    fyP_DD_Cheque_No?: string;
    fyP_DD_Cheque_Date?: string;
    fyP_Bank_Name?: string;
    FYP_Date?: string;
    fyP_Remarks?: string;
}

export interface PortalFeeReceiptProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export interface LoadDataResponse {
    yearlist: AcademicYear[];
    // Add other initial load data if needed
}

export interface ReceiptDetailsResponse {
    htmldata: string; // If legacy returns html
    fillstudentviewdetails: any[]; // Or specific type
    currpaymentdetails: PaymentDetails[];
    srkvsdetails?: any[];
    receiptformathead?: any[];
    specialheadlist?: any[];
    specialheaddetails?: any[];
    filltotaldetails?: any[];
    masterinstitution?: any[];
    dueamount: number;
    date?: string;
    month?: string;
    year?: string;
    duration?: string;
    pendingamount?: number;
    termremarks?: any[];
}
