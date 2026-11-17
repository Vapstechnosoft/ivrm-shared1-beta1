'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterpaymentGatewayDropdownList } from '@/types/fees/masters/masters';
import type {
    IFeeAcademicyearDropDownList,
    IFeeAmountEntryList,
    IFeeClassCategoryDropDownList,
    IFeeGroupDropDownList,
    IMasterAmountEntryDetails
} from '@/types/fees/transactions/transactions';

export async function getAmountEntry(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'fmA_Amount,fmG_GroupName,asmay_Year,fmcC_ClassCategoryName,fmH_FeeName,ftI_Name'
    );
    const url = `/fee_amount_entry/getdata?${urlParams}`;
    return await api.get<IFeeAmountEntryList[]>('fees', url);
}

export async function addOrUpdateAmountEntry(data: any) {
    const url = '/fee_amount_entry';
    return await api.post<any>('fees', url, data);
}

export async function deleteAmountEntry(asmay_id: number, id: number) {
    const url = `/fee_amount_entry/deletedetails/${asmay_id}/${id}`;
    console.info('fee_amount_entry/deletedetails', url);
    return await api.put('fees', url);
}

export async function getCategorydrodowndata(academicYear_Id: number) {
    const url = `fee_amount_entry/getclass_categorylist?asmay_id=${academicYear_Id}`;
    console.info(url);
    return await api.post<IFeeClassCategoryDropDownList>('fees', url);
}

export async function getgroupdrodown(academicYear_Id: number) {
    //const url = `fee_amount_entry/fee_grouplist?mi_id=30&asmay_id=${academicYear_Id}`;

    const url = `fee_amount_entry/fee_grouplist?asmay_id=${academicYear_Id}`;
    return await api.post<IFeeGroupDropDownList>('fees', url);
}

export async function getAcademicYearDropdownData() {
    const url = '/fee_class_category/academicyearlist';
    return await api.get<IFeeAcademicyearDropDownList[]>('fees', url);
}

export async function addOrUpdatepaymentgatewaydetails(data: any) {
    const url = '/FeePaymentGatewayDetailsFacade';
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
    console.info('fee_amount_entry/getgroupmappedheads', url);
    return await api.get<IMasterAmountEntryDetails[]>('fees', url);
}

export async function getFineslabDetails(regular?: string, ecs?: string) {
    const params = new URLSearchParams();

    // Add parameters only if they have values
    if (regular) {
        params.append('regularfalg', regular);
    }
    if (ecs) {
        params.append('ecsflag', ecs);
    }

    const queryString = params.toString();
    const url = `/fee_amount_entry/getfineslablist${queryString ? `?${queryString}` : ''}`;
    console.info('Fineslab Details URL:', url);
    return await api.get<any>('fees', url);
}
