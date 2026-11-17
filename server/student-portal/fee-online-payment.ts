'use server';

import { api } from '@/lib/apiService';

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
    payu: any;
    razorpay: any;
    paytm: any;
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

export interface OnlinePaymentDetailsResponse {
    success: boolean;
    message: string;
    data: {
        fillstudentviewdetails: FeeStructure[] | null;
        configset: string;
        fmt_order: any;
        amst_email_id: string | null;
        amst_mobile: string | null;
        sectionname: string | null;
        classname: string | null;
        staffdisableterms: any;
        fillpaymentgateway: PaymentGateway[];
        selected_list: GroupTermMapping[];
        headflag: string | null;
        pagelist: any[];
        institutiondet: InstitutionDetails[];
        readterms: FeeConfig[];
        academicyrlist: AcademicYear[];
        customgrplist: FeeGroup[];
        termlist: FeeTerm[];
        disableterms: any[];
        fillinstallment: any[];
        fillstudent: StudentInfo[];
        filonlinepaymentgrid: FeeStructure[];
        specialheadlist: any[];
        specialheaddetails: any[];
        transnumconfig: any[];
        feeconfiglist: FeeConfig[];
        asmaY_Id: number;
        mI_Id: number;
        ivrmimP_DisplayContent: any;
        fmT_Name: string | null;
        amst_Id: number;
        readmissionfeeschecking: any;
        amsT_FirstName: string | null;
        amsT_MiddleName: string | null;
        amsT_LastName: string | null;
        amsT_RegistrationNo: string | null;
        amaY_RollNo: string | null;
        asysT_Id: number | null;
        amsT_AdmNo: string | null;
        asmcL_ID: number;
        fpgD_Id: number;
        fpgD_Image: string | null;
        fpgD_PGName: string | null;
        fmC_Online_Payment_Aca_Yr_Flag: string | null;
        asmaY_Order: number;
        fmG_Id: number;
        fmG_GroupName: string | null;
        fmT_Id: number;
        fsS_NetAmount: number;
        fsS_PaidAmount: number;
        fsS_ConcessionAmount: number;
        fsS_ToBePaid: number;
        fsS_FineAmount: number;
        fmA_Id: number;
        fmgG_Id: number;
        ftI_Id: number;
        fmH_Id: number;
        fmH_FeeName: string | null;
        ftI_Name: string | null;
        fmH_Order: number;
        fmH_Flag: string | null;
        fsS_WaivedAmount: number | null;
        fsS_TotalToBePaid: number | null;
        fsS_CurrentYrCharges: number | null;
        fsS_RefundAmount: number | null;
        studwisepartialpayment: any;
        fsS_OBArrearAmount: number;
        total: any;
        page: any;
        page_size: any;
    };
}

export async function getOnlinePaymentDetails(
    amstId?: number,
    configset?: string,
    selectedList?: GroupTermMapping[]
): Promise<OnlinePaymentDetailsResponse> {
    try {
        const url = '/OnlinePayment/getdetails';
        const requestData: any = {};

        if (amstId) requestData.Amst_Id = amstId;
        if (configset) requestData.configset = configset;
        if (selectedList) requestData.selected_list = selectedList;

        const response = await api.post<any>('portal', url, requestData);
        return response.data;
    } catch (error) {
        console.error('Error fetching online payment details:', error);
        throw error;
    }
}

export async function getOnlinePaymentAmountDetails(
    selectedList: GroupTermMapping[],
    academicYearId?: number,
    classId?: number,
    userId?: number,
    headFlag?: string
): Promise<{
    feeStructures: FeeStructure[];
    paymentGateways: PaymentGateway[];
    totalRebate: number;
    feeConfig: any;
    fillstudentviewdetails?: FeeStructure[];
    finearray?: FeeStructure[];
    fsS_RebateAmount?: number;
    filonlinepaymentgrid?: FeeStructure[];
    instalaspecial?: any[];
    special_head_list?: any[];
    special_head_details?: any[];
}> {
    try {
        const url = '/OnlinePayment/getamountdetails';
        const requestData: any = {
            selected_list: selectedList
        };

        if (userId) requestData.userid = userId;
        if (headFlag) requestData.headflag = headFlag;
        if (academicYearId) requestData.ASMAY_Id = academicYearId;
        if (classId) requestData.ASMCL_Id = classId;

        const response = await api.post<any>('portal', url, requestData);
        console.log('response.data', response.data);
        const feeStructures: FeeStructure[] =
            response.data?.fillstudentviewdetails?.map((item: any) => ({
                fmH_FeeName: item.fmH_FeeName,
                ftI_Name: item.ftI_Name,
                fsS_OBArrearAmount: item.fsS_OBArrearAmount || 0,
                fsS_NetAmount: item.fsS_NetAmount || 0,
                fsS_TotalToBePaid: item.fsS_TotalToBePaid || 0,
                fsS_ConcessionAmount: item.fsS_ConcessionAmount || 0,
                fsS_FineAmount: item.fsS_FineAmount || 0,
                fsS_ToBePaid: item.fsS_ToBePaid || 0,
                isSelected: true,
                fmG_Id: item.fmG_Id,
                fmH_Id: item.fmH_Id,
                fma_id: item.fma_id
            })) || [];

        const paymentGateways: PaymentGateway[] =
            response.data?.fillpaymentgateway?.map((pg: any) => ({
                fpgD_PGName: pg.fpgD_PGName,
                fpgD_Image: pg.fpgD_Image
            })) || [];

        return {
            feeStructures,
            paymentGateways,
            totalRebate: response.data?.fsS_RebateAmount || 0,
            feeConfig: response.data?.feeconfiglist?.[0] || null,
            fillstudentviewdetails: response.data?.fillstudentviewdetails || [],
            finearray: response.data?.finearray || [],
            fsS_RebateAmount: response.data?.fsS_RebateAmount || 0,
            filonlinepaymentgrid: response.data?.filonlinepaymentgrid || [],
            instalaspecial: response.data?.instalaspecial || [],
            special_head_list: response.data?.special_head_list || [],
            special_head_details: response.data?.special_head_details || []
        };
    } catch (error) {
        console.error('Error fetching online payment amount details:', error);
        return {
            feeStructures: [],
            paymentGateways: [],
            totalRebate: 0,
            feeConfig: null
        };
    }
}

export async function generateOnlinePaymentOrder(
    feeStructures: FeeStructure[],
    totalAmount: number,
    studentInfo: StudentInfo,
    selectedList: GroupTermMapping[],
    paymentGateway: string,
    academicYearId: number,
    classId: number
): Promise<PaymentOrderResponse> {
    try {
        // TODO: Replace with actual API call when ready
        // const url = '/OnlinePayment/generatehashsequence';

        // Mock response for now
        const mockResponse: PaymentOrderResponse = {
            fyP_Receipt_No: 'REC_' + Date.now(),
            fmA_Amount: totalAmount,
            merchantkey: 'rzp_test_1234567890abcdef', // Mock Razorpay key
            trans_id: 'order_' + Date.now(),
            fillstudent: [studentInfo],
            splitpayinformation: JSON.stringify(selectedList),
            mI_Id: studentInfo.asmcL_ID.toString(),
            asmaY_Id: academicYearId.toString(),
            amst_Id: studentInfo.amst_Id.toString(),
            paydet: [
                {
                    marchanT_ID: 'rzp_test_1234567890abcdef',
                    trans_id: 'order_' + Date.now(),
                    amount: (totalAmount * 100).toString(),
                    productinfo: 'Fee Payment',
                    firstname: studentInfo.amsT_FirstName,
                    email: studentInfo.amst_email_id,
                    phone: studentInfo.amst_mobile?.toString(),
                    ordeR_ID: 'order_' + Date.now(),
                    cusT_ID: studentInfo.amst_Id.toString(),
                    txN_AMOUNT: (totalAmount * 100).toString(),
                    website: 'https://your-school-website.com',
                    checksumhash: 'mock_hash_' + Date.now()
                }
            ]
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return mockResponse;
    } catch (error) {
        console.error('Error generating online payment order:', error);
        throw new Error('Failed to generate payment order');
    }
}

export async function processOnlineRazorpayPayment(
    paymentData: PaymentOrderResponse,
    razorpayResponse: any
): Promise<{
    success: boolean;
    receiptNo?: string;
    message: string;
}> {
    try {
        // TODO: Replace with actual API call when ready
        // const url = '/OnlinePayment/razorpaypaymentresponse';
        // const response = await api.post<any>('portal', url, {
        //   razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        //   razorpay_order_id: razorpayResponse.razorpay_order_id,
        //   razorpay_signature: razorpayResponse.razorpay_signature,
        //   receiptNo: paymentData.fyP_Receipt_No,
        //   ...paymentData
        // });

        // Mock successful payment response for now
        console.log('Mock payment processing:', {
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_signature: razorpayResponse.razorpay_signature,
            receiptNo: paymentData.fyP_Receipt_No
        });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock successful response
        return {
            success: true,
            receiptNo: paymentData.fyP_Receipt_No,
            message: 'Payment processed successfully'
        };
    } catch (error) {
        console.error('Error processing online Razorpay payment:', error);
        return {
            success: false,
            message: 'Failed to process payment'
        };
    }
}
