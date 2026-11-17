'use server';

import { api } from '@/lib/apiService';
import type {
    FeeReceiptRecord,
    IFeeReceiptReportHeadDropdownList,
    ReceiptReportReceiptDropdownList,
    ReceiptReportStudentDropdownList
} from '@/types/fees/reports/reports';

export async function getFeeReceiptReportHeadDropdown(asmay_Id: number, amst_Id: number) {
    // const url = 'FeeSpecialHead/fee-special-head-dropdown';
    const url = `feeitreport/get-mapped-head-list?asmay_id=${asmay_Id}&amst_id=${amst_Id}`;
    return await api.get<IFeeReceiptReportHeadDropdownList[]>('fees', url);
}

export async function getFeeReceiptReportStudentDropdown(asmay_Id: number, asmcl_Id: number, asms_Id: number) {
    const url = `feeitreport/get-student-list?asmay_id=${asmay_Id}&acmcl_id=${asmcl_Id}&asms_id=${asms_Id}`;

    console.info('getFeeReceiptReportStudentDropdown url:', url);
    return await api.get<ReceiptReportStudentDropdownList[]>('fees', url);
}

export async function getFeeReceiptReportReceiptDropdown(data: any) {
    const url = '/feeitreport/get-receipt-list';
    return await api.post<ReceiptReportReceiptDropdownList[]>('fees', url, data);
}

export async function getFeeReceiptLogo() {
    const url = '/FeesCommon/get-institution-logo';
    return await api.get<any[]>('fees', url);
}

export async function getReceiptReportDetails(data: any) {
    const url = '/feeitreport/get-it-receipt-report';
    return await api.post<FeeReceiptRecord[]>('fees', url, data);
}
