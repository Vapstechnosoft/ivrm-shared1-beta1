export interface AcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface StudentInfo {
    amst_Id: number;
    amsT_FirstName: string;
    amsT_MiddleName: string;
    amsT_LastName: string;
    amsT_RegistrationNo: string;
    amsT_AdmNo: string;
    classname: string;
    sectionname: string;
    amst_email_id: string;
    asmcL_ID: number;
    amst_mobile: number;
    asmaY_Id: number;
    amaY_RollNo: string;
    amsT_PerCity?: string;
    amsT_Address?: string;
}

export interface FeeGroup {
    fmgG_Id: string;
    fmgG_GroupName: string;
    checkedgrplst: boolean;
    grpdisable: boolean;
    cantuncheck?: boolean;
}

export interface FeeTerm {
    fmT_Id: string;
    fmT_Name: string;
    fmgG_Id: string;
    checkedheadlst: boolean;
    termdisablechk: boolean;
    cantuncheck?: boolean;
}

export interface GroupTermMapping {
    grp: FeeGroup;
    trm_list: FeeTerm[];
}

export interface FeeStructure {
    fmH_FeeName: string;
    ftI_Name: string;
    fsS_OBArrearAmount: number;
    fsS_NetAmount: number;
    fsS_TotalToBePaid: number;
    fsS_ConcessionAmount: number;
    fsS_FineAmount: number;
    fsS_ToBePaid: number;
    isSelected: boolean;
    fmG_Id?: string;
    fmH_Id?: string;
    fsS_PaidAmount?: number;
    fsS_WaivedAmount?: number;
    fsS_CurrentYrCharges?: number;
    Head_Flag?: string | 'H' | 'SH';
    fma_id?: number;
}

export interface PaymentGateway {
    fpgD_PGName: string;
    fpgD_Image: string;
}

export interface PaymentOrderResponse {
    fyP_Receipt_No: string;
    fmA_Amount: number;
    merchantkey: string;
    trans_id: string;
    fillstudent: StudentInfo[];
    splitpayinformation: string;
    mI_Id: string;
    asmaY_Id: string;
    amst_Id: string;
    url?: string;
    paydet?: PaymentDetails[];
}

export interface PaymentDetails {
    marchanT_ID?: string;
    trans_id?: string;
    amount?: string;
    productinfo?: string;
    firstname?: string;
    email?: string;
    phone?: string;
    surl?: string;
    furl?: string;
    hash?: string;
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    udf6?: string;
    service_provider?: string;
    hash_string?: string;
    payu_URL?: string;
    mid?: string;
    ordeR_ID?: string;
    cusT_ID?: string;
    txN_AMOUNT?: string;
    channeL_ID?: string;
    industrY_TYPE_ID?: string;
    website?: string;
    checksumhash?: string;
    merC_UNQ_REF?: string;
    mobilE_NO?: string;
}

export interface RazorpayOptions {
    key: string;
    amount: number;
    name: string;
    order_id: string;
    currency: string;
    description: string;
    image?: string;
    callback_url: string;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    notes: {
        notes_1: string;
        notes_2: string;
        notes_3: string;
        notes_4: string;
        notes_5: string;
        notes_6: string;
        notes_7: string;
        notes_8: string;
        notes_9: string;
    };
    theme: {
        color: string;
    };
    external: {
        wallets: string[];
    };
}

export interface PaymentData {
    txnamt: number;
    SaltKey: string;
    orderid: string;
    institutioname: string;
    institulogo: string;
    stuname: string;
    stuemailid: string;
    stuaddress: string;
    stumobileno: string;
    stuadmno: string;
    splitpayinfor: string;
    mI_Id: string;
    asmaY_Id: string;
    amst_Id: string;
}

export interface FeeConfig {
    fmC_Online_Payment_Aca_Yr_Flag: string;
    fmC_EnablePartialPaymentFlg: number;
    fmC_AutoReceiptFeeGroupFlag: boolean;
}

export interface InstitutionDetails {
    inT_NAME: string;
    institutioN_LOGO: string;
    mI_Id: number;
}

export interface PaymentCharges {
    payu: {
        netBanking: number;
        creditCard: string;
        debitCardBelow: string;
        debitCardAbove: string;
    };
    razorpay: {
        creditCardDomestic: string;
        debitCardBelow: string;
        debitCardAbove: string;
        creditCardDinersAmex: string;
        netBankingHDFC: number;
        netBankingICICI: number;
        netBankingRest: number;
        wallets: string;
        emi: string;
        internationalCards: string;
        upi: number;
    };
    paytm: {
        creditCard: string;
        debitCardBelow: string;
        debitCardAbove: string;
        netBanking: number;
        wallets: string;
        amexCard: string;
        postpaid: string;
        upiBelow: string;
        upiAbove: string;
    };
}

export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface PaymentStatusResponse {
    success: boolean;
    receiptNo?: string;
    message: string;
    status?: string;
}

export interface SpecialHead {
    fmsfH_Id: number;
    fmsfH_Name: string;
}

export interface SpecialHeadDetails {
    fmsfH_Id: number;
    fmH_ID: number;
}

export interface InstallmentSpecial {
    ftI_Id: string;
    ftI_Name: string;
    sp_list: {
        ftI_Id: string;
        ftI_Name: string;
        sp_list: {
            sp_id: number;
            sp_name: string;
            sp_ind_list: FeeStructure[];
        }[];
    }[];
}

export interface DisableTerm {
    FMGG_Id: string;
    fmt_id: string;
    payable: number;
    paid: number;
}

export interface TransNumConfig {
    imN_Flag: string;
    imN_AutoManualFlag: string;
}

export interface PageDisplay {
    ivrmimP_DisplayContent: string;
}

export interface FeeOnlinePaymentResponse {
    pagelist?: PageDisplay[];
    institutiondet?: InstitutionDetails[];
    readterms?: FeeConfig[];
    academicyrlist?: AcademicYear[];
    customgrplist?: FeeGroup[];
    termlist?: FeeTerm[];
    disableterms?: DisableTerm[];
    fillinstallment?: any[];
    fillstudent?: StudentInfo[];
    filonlinepaymentgrid?: FeeStructure[];
    specialheadlist?: SpecialHead[];
    specialheaddetails?: SpecialHeadDetails[];
    transnumconfig?: TransNumConfig[];
    staffdisableterms?: DisableTerm[];
}
