'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterpaymentGatewayDropdownList } from '@/types/fees/masters/masters';
import type {
    IFeeAcademicyearDropDownList,
    IFeeClassCategoryDropDownList,
    IFeeGroupDropDownList,
    IFeePreAdmissionStudentInformation,
    IFeePreAdmissionStudentTermsDetails,
    IFeePreAdmissionStudentsDropDownList,
    IFeePreAdmissionTransactionDetails,
    IFeeTransactionApiResponse,
    IMasterAmountEntryDetails
} from '@/types/fees/transactions/transactions';

export async function getFeePreadmissionTransactionList(asmay_Id: number, searchParams?: Record<string, any>) {
    if (!asmay_Id || asmay_Id === 0) {
        console.warn('getFeePreadmissionTransactionList called with asmay_Id=0');
        return { success: true, data: [], total: 0 };
    }

    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'modeOfPayment,paidAmount,paidDate,receiptNo,studentEmail,studentMobile,studentRegNo,studentName,classname'
    );
    const url = `/FeePreadmission/gettransactionlist?asmay_id=${asmay_Id}&${urlParams}`;
    console.info('API Call →', url);

    const res = await api.get<any>('fees', url);
    return res;
}
export async function getPreadmissionStudentDropdownData(
    searchText: string,
    radiovalue: string,
    asmayId: number
): Promise<IFeePreAdmissionStudentsDropDownList[]> {
    const url = `/FeePreadmission/getstudents?ASMAY_Id=${asmayId}&SearchText=${searchText}&filterinitialdata=${radiovalue}`;
    console.info('preadmissiontransactiondetials api', url);
    const res = await api.get<IFeePreAdmissionStudentsDropDownList[]>('fees', url);
    return res.data ?? [];
}

export async function getPreadmissionStudentInformation(
    asmay_Id: number,
    studentId: number,
    searchText: string
): Promise<IFeePreAdmissionStudentInformation[]> {
    const url = `/FeePreadmission/getStudentInfo?studentId=${studentId}&miId=30&asmayId=${asmay_Id}&filterType=${searchText}`;
    console.info('preadmissiontransactiondetials api', url);
    const res = await api.get<IFeePreAdmissionStudentInformation[]>('fees', url);
    console.info('preadmissiontransactiondetials api', res);
    return res.data ?? []; // null;
}

export async function getPreadmissionStudentTermsData(studentId: number): Promise<IFeePreAdmissionStudentTermsDetails[]> {
    const url = `/FeePreadmission/terms?AMST_Id=${studentId}`;
    const res = await api.get<IFeePreAdmissionStudentTermsDetails[]>('fees', url);

    // Always return an array (never null)
    return res.data ?? [];
}

export async function getPreadmissionStudentTrasactionData(
    studentId: number,
    termIds: number[],
    admissionType: string,
    termgrpflag: string
): Promise<IFeePreAdmissionTransactionDetails[]> {
    // const url = '/FeePreadmission/feedashboard?pasR_Id=1625&Grp_Term_flg=T&filterinitialdata=Preadmission&terms_groups=61';
    const url = `/FeePreadmission/feedashboard?pasR_Id=${studentId}&Grp_Term_flg=T&filterinitialdata=${admissionType}&${termIds.map((id) => `terms_groups=${id}`).join('&')}`;

    console.info('Constructed URL:', url);
    console.info('Requesting preadmission transaction details:', { baseUrlKey: 'fees', url });
    const res = (await api.get('fees', url)) as IFeeTransactionApiResponse;
    console.info('Full preadmission transaction API response:', JSON.stringify(res, null, 2));
    const transactions = res?.data?.feeTransactions ?? [];
    console.info('Extracted transactions:', transactions);
    return transactions;
}

export async function addOrUpdateAmountEntry(data: any) {
    const url = '/fee_amount_entry';
    return await api.post<any>('fees', url, data);
}

export async function deleteAmountEntry(asmay_id: number, id: number) {
    //mi_id: number,
    const url = `/fee_amount_entry/deletedetails/${asmay_id}/${id}`;
    console.info(url);
    return await api.put('fees', url);
}

export async function getCategorydrodowndata(academicYear_Id: number) {
    const url = `fee_amount_entry/getclass_categorylist?asmay_id=${academicYear_Id}`;
    console.info(url);
    return await api.post<IFeeClassCategoryDropDownList>('fees', url);
}

export async function getgroupdrodown(asmayId: number) {
    //academicYear_Id: number
    //const url = `fee_amount_entry/fee_grouplist?mi_id=30&asmay_id=${academicYear_Id}`;

    const url = `fee_amount_entry/fee_grouplist?asmay_id=${asmayId}`;
    return await api.post<IFeeGroupDropDownList>('fees', url);
}

export async function getAcademicYearDropdownData() {
    const url = '/fee_class_category/academicyearlist';
    return await api.get<IFeeAcademicyearDropDownList[]>('fees', url);
}

export async function addOrUpdatepaymentgatewaydetails(data: any) {
    const url = '/FeePreadmission/save_fee_preadmission_transaction';
    return await api.post<any>('fees', url, data);
}

export async function togglepaymentgatewaydetails(id: number) {
    const url = `/FeePaymentGatewayDetailsFacade/deletePaymentGatewayDetails/${id}`;
    return await api.put('fees', url);
}

export async function getpaymentgateway_dropdown(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/FeePaymentGatewayDetailsFacade/paymentgatewaylist?${urlParams}`;
    return await api.get<IMasterpaymentGatewayDropdownList[]>('fees', url);
}

export async function getAmountentrydetails(asmay_id: number, fmcC_id: number, fmG_id: number) {
    const url = `/fee_amount_entry/getgroupmappedheads/${asmay_id}/${fmcC_id}/${fmG_id}`;
    return await api.get<IMasterAmountEntryDetails[]>('fees', url);
}

export async function getPrintdetails(fyp_id: number, asmay_id: number, filterinitialdata: string, pasr_id: number) {
    const url = `FeePreadmission/print_receipt?fyp_id=${fyp_id}&asmay_id=${asmay_id}&filterinitialdata=${filterinitialdata}&pasr_id=${pasr_id}`;
    return await api.get<IFeePreAdmissionTransactionDetails[]>('fees', url);
}

export async function getFeeProspectusTransactionList(asmay_Id: number, searchParams?: Record<string, any>) {
    // if (!asmay_Id || asmay_Id === 0) {
    //    // console.warn('getFeePreadmissionTransactionList called with asmay_Id=0');
    //     return { success: true, data: [], total: 0 };
    // }

    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'modeOfPayment,paidAmount,paidDate,receiptNo,studentEmail,studentMobile,studentRegNo,studentName,classname'
    );
    const url = `/FeePreadmission/get-prospectus-transactionlist?asmay_id=${asmay_Id}&${urlParams}`;
    console.info('API Call →', url);

    const res = await api.get<any>('fees', url);
    return res;
}
