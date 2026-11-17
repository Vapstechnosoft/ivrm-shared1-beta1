'use server';

// Mock data to ensure UI renders if backend is not available
const MOCK_INITIAL_DATA = {
    pagelist: [{ ivrmimP_DisplayContent: 'Online Payment Charges apply.' }],
    institutiondet: [{ inT_NAME: 'Edumeeting School', institutioN_LOGO: '' }],
    readterms: [{ fmC_Online_Payment_Aca_Yr_Flag: 'B' }],
    academicyrlist: [
        { asmaY_Id: 1, asmaY_Year: '2023-2024' },
        { asmaY_Id: 2, asmaY_Year: '2024-2025' }
    ],
    customgrplist: [
        { fmgG_Id: 101, fmgG_GroupName: 'Tuition Fee' },
        { fmgG_Id: 102, fmgG_GroupName: 'Transport Fee' }
    ],
    termlst: [
        { fmT_Id: 201, fmT_Name: 'Term 1', fmgG_Id: 101 },
        { fmT_Id: 202, fmT_Name: 'Term 2', fmgG_Id: 101 },
        { fmT_Id: 203, fmT_Name: 'Annual', fmgG_Id: 102 }
    ],
    disableterms: [],
    fillinstallment: [],
    fillstudent: [
        {
            amsT_FirstName: 'Student',
            amsT_MiddleName: '',
            amsT_LastName: 'Name',
            amsT_AdmNo: 'ADM001',
            amsT_RegistrationNo: 'REG001',
            amaY_RollNo: 10,
            classname: 'X',
            sectionname: 'A',
            amst_mobile: 9876543210,
            amst_email_id: 'student@example.com',
            amst_Id: 500,
            asmcL_ID: 50
        }
    ],
    filonlinepaymentgrid: [],
    transnumconfig: [],
    feeconfiglist: [{ fmC_EnablePartialPaymentFlg: 1 }],
    specialheadlist: [],
    specialheaddetails: []
};

export async function getFeeOnlinePaymentLoadData(data: any) {
    // In a real scenario, uncomment the following line:
    //return await api.post('portal', '/OnlinePayment/getalldetails', data);

    //Returning mock data for development
    return {
        success: true,
        data: MOCK_INITIAL_DATA
    };
}

export async function getAmountDetails(data: any) {
    // Mock response for getting amount details
    // return await api.post('default', 'FeeOnlinePayment/getamountdetails', data);

    return {
        success: true,
        data: {
            fillstudentviewdetails: [
                {
                    fmH_FeeName: 'Tuition Fee',
                    ftI_Name: 'Term 1',
                    fmg_id: 101,
                    fsS_OBArrearAmount: 0,
                    fsS_NetAmount: 5000,
                    fsS_TotalToBePaid: 5000,
                    fsS_ConcessionAmount: 0,
                    fsS_FineAmount: 0,
                    fsS_ToBePaid: 5000,
                    fsS_WaivedAmount: 0,
                    fsS_PaidAmount: 0,
                    fma_id: 1
                }
            ],
            feeconfiglist: [{ fmC_EnablePartialPaymentFlg: 1 }],
            fillpaymentgateway: [{ fpgD_PGName: 'RAZORPAY', fpgD_Image: '/assets/images/razorpay.png' }],
            fsS_RebateAmount: 0,
            finearray: [],
            instalspecial: []
        }
    };
}

export async function savePayment(data: any) {
    // return await api.post('default', 'FeeOnlinePayment/generatehashsequence', data);
    return {
        success: true,
        data: {
            // Mock Razorpay return
            paygtw: 'RAZORPAY',
            fmA_Amount: 5000,
            merchantkey: 'rzp_test_123',
            trans_id: 'ORDER123456',
            splitpayinformation: '',
            mI_Id: 4,
            asmaY_Id: 1,
            amst_Id: 500,
            fillstudent: [
                {
                    amsT_FirstName: 'Student',
                    amst_email_id: 'student@example.com',
                    amsT_PerCity: 'Bangalore',
                    amst_mobile: 9876543210,
                    amsT_AdmNo: 'ADM001'
                }
            ]
        }
    };
}
