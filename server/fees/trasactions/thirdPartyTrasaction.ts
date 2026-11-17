'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IFeeBankDetails,
    IFeeThirdPartyTransaction,
    IFeeThirdPartyTransactionGroupDropDown,
    IFeeThirdPartyTransactionHeadDropDown,
    IFeeThirdPartyTransactionStudentDetails,
    IThirdPartyReceiptFlag,
    IThirdPartyTransactionEditdata
} from '@/types/fees/transactions/transactions';

export async function getThirdPartyTrasaction(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/ThirdPartyTransaction?${urlParams}`;
    return await api.get<IFeeThirdPartyTransaction[]>('fees', url);
}

export async function getThirdPartyTrasactionGroupDropDown(searchParams?: ApiSearchparams) {
    //const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = '/ThirdPartyTransaction/group_drop_down_list';
    return await api.get<IFeeThirdPartyTransactionGroupDropDown[]>('fees', url);
}

export async function getThirdPartyTrasactionHeadDropDown(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `ThirdPartyTransaction/head_drop_down_list?${urlParams}`;
    return await api.get<IFeeThirdPartyTransactionHeadDropDown[]>('fees', url);
}

export async function getThirdPartyTrasactionBankDropDown(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `ThirdPartyTransaction/bank_drop_down_list?${urlParams}`;
    return await api.get<IFeeBankDetails[]>('fees', url);
}

export async function getThirdPartyTrasactionStudentDropDown(asmaY_Id: number) {
    //const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/ThirdPartyTransaction/SelectOrSearchStudent/${asmaY_Id}`;
    console.info('ThirdPartyTransaction', url);
    return await api.get<IFeeThirdPartyTransactionStudentDetails[]>('fees', url);
}

export async function saveorUpdateThirdPartyTrasaction(data: any) {
    const url = '/ThirdPartyTransaction/add-or-update-thirdparty-transaction';
    console.info('saveorUpdateThirdPartyTrasaction api', url, data);
    return await api.post<any>('fees', url, data);
}

export async function get_Receipt_number() {
    //const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = '/ThirdPartyTransaction/get_Receipt_number';
    console.info('ThirdPartyTransaction', url);
    return await api.get<any>('fees', url);
}

export async function geteditThirdpartytrasaction(mi_id: number, asmaY_Id: number, fyp_id: number) {
    //const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `ThirdPartyTransaction/OtherTransactionById/${mi_id}/${asmaY_Id}/${fyp_id}`;
    console.info('ThirdPartyTransaction', url);
    return await api.get<IThirdPartyTransactionEditdata[]>('fees', url);
}

export async function deleteThirdPartyTrasaction(fyp_id: number) {
    const url = `/ThirdPartyTransaction/delete/${fyp_id}`;
    console.info(url);
    return await api.delete('fees', url);
}

export async function receiptView(data: any) {
    const url = '/ThirdPartyTransaction/print_receipt';

    console.info('thirdPartyTrasaction', url);
    return await api.post<any>('fees', url, data);
}

export async function ThirdPartyTrasactionfeeReceiptNoflg() {
    const url = '/ThirdPartyTransaction/ThirdPartyTrasactionfeeReceiptNoflg';

    console.info('ThirdPartyTrasactionfeeReceiptNoflg', url);
    return await api.get<IThirdPartyReceiptFlag[]>('fees', url);
}
