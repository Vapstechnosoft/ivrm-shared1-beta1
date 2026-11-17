'use server';

import type { AcademicYear, FeeReceipt, ReceiptDetailsResponse } from './types';

// Mock Data
const MOCK_ACADEMIC_YEARS: AcademicYear[] = [
    { asmaY_Id: 1, asmaY_Year: '2023-2024', Selected: true },
    { asmaY_Id: 2, asmaY_Year: '2022-2023', Selected: false },
    { asmaY_Id: 3, asmaY_Year: '2021-2022', Selected: false }
];

const MOCK_RECEIPTS: FeeReceipt[] = [
    { fyP_Id: 101, fyP_Receipt_No: 'REC/2023/001', fyP_Date: '2023-04-10' },
    { fyP_Id: 102, fyP_Receipt_No: 'REC/2023/002', fyP_Date: '2023-05-15' },
    { fyP_Id: 103, fyP_Receipt_No: 'REC/2023/003', fyP_Date: '2023-06-20' }
];

const MOCK_RECEIPT_DETAILS: ReceiptDetailsResponse = {
    htmldata: '',
    fillstudentviewdetails: [
        {
            amsT_FirstName: 'Rahul',
            amsT_MiddleName: 'Kumar',
            amsT_LastName: 'Sharma',
            classname: 'X',
            sectionname: 'A',
            rollno: 12,
            admno: 'ADM2020001',
            fathername: 'Rajesh Sharma',
            mothername: 'Sunita Sharma',
            fmcC_ConcessionName: 'General',
            amst_mobile: 9876543210,
            fyP_Receipt_No: 'REC/2023/001',
            fyP_Date: '2023-04-10',
            fyP_Bank_Or_Cash: 'O',
            totalcharges: 15000,
            ftP_Paid_Amt: 15000,
            ftP_Concession_Amt: 0,
            ftP_Fine_Amt: 0,
            fmH_FeeName: 'Tuition Fee',
            ftP_Waived_Amt: 0
        },
        {
            amsT_FirstName: 'Rahul',
            amsT_MiddleName: 'Kumar',
            amsT_LastName: 'Sharma',
            classname: 'X',
            sectionname: 'A',
            rollno: 12,
            admno: 'ADM2020001',
            fathername: 'Rajesh Sharma',
            mothername: 'Sunita Sharma',
            fmcC_ConcessionName: 'General',
            amst_mobile: 9876543210,
            fyP_Receipt_No: 'REC/2023/001',
            fyP_Date: '2023-04-10',
            fyP_Bank_Or_Cash: 'O',
            totalcharges: 5000,
            ftP_Paid_Amt: 5000,
            ftP_Concession_Amt: 0,
            ftP_Fine_Amt: 0,
            fmH_FeeName: 'Transport Fee',
            ftP_Waived_Amt: 0
        }
    ],
    currpaymentdetails: [
        {
            ftP_Paid_Amt: 20000,
            ftP_Concession_Amt: 0,
            fyP_Bank_Or_Cash: 'O',
            fyP_Remarks: 'Online Payment via Razorpay',
            FYP_Date: '2023-04-10'
        }
    ],
    masterinstitution: [
        {
            mI_Address1: '123 School Lane',
            mI_Address2: 'Education City',
            mI_Address3: 'State, 123456',
            mI_Pincode: 123456
        }
    ],
    dueamount: 0,
    date: '2023-04-10',
    month: 'April',
    year: '2023-2024',
    duration: 'April - June',
    filltotaldetails: [
        {
            fmH_FeeName: 'Tuition Fee',
            totalcharges: 15000,
            ftP_Paid_Amt: 15000
        },
        {
            fmH_FeeName: 'Transport Fee',
            totalcharges: 5000,
            ftP_Paid_Amt: 5000
        }
    ]
};

export async function getPortalFeeReceiptLoadData() {
    // In a real application, fetch from API
    // const response = await apiService.getDATA("FeeReceipt/getloaddata");
    // return response;

    return {
        yearlist: MOCK_ACADEMIC_YEARS
    };
}

export async function getReceipts(_yearId: number) {
    return {
        recnolist: MOCK_RECEIPTS
    };
}

export async function getReceiptDetails(_data: any) {
    return MOCK_RECEIPT_DETAILS;
}
