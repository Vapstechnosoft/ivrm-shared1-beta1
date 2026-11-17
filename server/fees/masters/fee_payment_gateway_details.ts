'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterPaymentGatewayList, IMasterpaymentGatewayDropdownList } from '@/types/fees/masters/masters';

export async function getpaymentgatewaydetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'fpgD_MerchantId,fpgD_SaltKey,fpgD_AuthorisationKey,impG_PGName,fpgD_AccNo,fpgD_SubMerchantId'
    );
    const url = `/FeePaymentGatewayDetailsFacade/getpagedetails?${urlParams}`;
    return await api.get<IMasterPaymentGatewayList[]>('fees', url);
}

export async function addOrUpdatepaymentgatewaydetails(data: any) {
    const url = '/FeePaymentGatewayDetailsFacade';
    return await api.post<any>('fees', url, data);
}

export async function togglepaymentgatewaydetails(id: number) {
    const url = `/FeePaymentGatewayDetailsFacade/toggle-PaymentGatewayDetails/${id}`;
    return await api.put('fees', url);
}

export async function getpaymentgateway_dropdown(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/FeePaymentGatewayDetailsFacade/paymentgatewaylist?${urlParams}`;
    return await api.get<IMasterpaymentGatewayDropdownList[]>('fees', url);
}

export async function deletepaymentgatewaydetails(id: number) {
    const url = `/FeePaymentGatewayDetailsFacade/deletePaymentGatewayDetails/${id}`;

    return await api.delete('fees', url);
}

export async function getpaymentgatewayInstitutionName() {
    const url = '/FeePaymentGatewayDetailsFacade/institution_name';
    return await api.get<any[]>('fees', url);
}
