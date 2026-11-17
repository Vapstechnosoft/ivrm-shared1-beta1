'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IFeeRefundableGroupDropDownList,
    IFeeRefundableHeadList,
    IFeeRefundableList,
    IFeeRefundableStudentDropDownList
} from '@/types/fees/transactions/transactions';

export async function getFeeRefundableDetails(asmay_id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'admisionNo,studentName,studentName,refundedAmount,modeOfPayment,fr_Date,amst_Id'
    );
    const url = `/FeeRefundableFacade/get-student-refundable-list/${asmay_id}?${urlParams}`;
    return await api.get<IFeeRefundableList[]>('fees', url);
}

export async function addOrUpdateFeeRefundableDetails(data: any) {
    const url = '/FeeRefundableFacade/saveOrUpdateFeeRefund';
    return await api.post<any>('fees', url, data);
}

export async function deleteFeeRefundableDetails(fr_id: number) {
    const url = `/FeeRefundableFacade/deleteRefund?FR_ID=${fr_id}`;

    console.info('deleteFeeRefundableDetails', url);
    return await api.delete('fees', url);
}

export async function getFeeRefundableStudentDropdownDetails(asmay_id: number, ASMCL_Id: number, ASMS_Id: number) {
    const url = `/FeeRefundableFacade/getStudentNamesBySection?ASMAY_Id=${asmay_id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}`;
    console.info('getStudentNamesBySection', url);
    return await api.get<IFeeRefundableStudentDropDownList[]>('fees', url);
}

export async function getFeeRefundableGroupDropdownDetails(ASMAY_Id: number, amsT_Id: number, IsRefundable: boolean) {
    const url = `/FeeRefundableFacade/getFeeGroupsByStudent?AMST_Id=${amsT_Id}&ASMAY_ID=${ASMAY_Id}&IsRefundable=${IsRefundable}`;
    console.info('getFeeGroupsByStudent', url);
    return await api.get<IFeeRefundableGroupDropDownList[]>('fees', url);
}

export async function getFeeRefundableHeadDetails(ASMAY_Id: number, amsT_Id: number, IsRefundable: boolean, FeeGroupIds: number[]) {
    const params = new URLSearchParams();

    params.append('ASMAY_Id', String(ASMAY_Id));
    params.append('AMST_Id', String(amsT_Id));
    params.append('IsRefundable', String(IsRefundable));
    // const feeGroupIdsToUse = [374];

    // Append FeeGroupIds as repeated query params
    FeeGroupIds.forEach((id) => {
        params.append('FeeGroupIds', String(id));
    });
    // feeGroupIdsToUse.forEach((id) => {
    //     params.append('FeeGroupIds', String(id));
    // });
    // const url = `/FeeRefundableFacade/get-refundable-headlist?ASMAY_Id=${ASMAY_Id}&AMST_Id=16857&IsRefundable=${IsRefundable}&FeeGroupIds=${FMG_Id}`;
    const url = `/FeeRefundableFacade/get-refundable-headlist?${params.toString()}`;
    console.info('getFeeRefundableHeadDetails api', url);
    return await api.get<IFeeRefundableHeadList[]>('fees', url);
}

export async function getFeeRefundableReceiptDetails(asmay_id: number, amst_Id: number, fr_refundno: number) {
    const url = `/FeeRefundableFacade/get-refundable-recepts?asmayId=${asmay_id}&amst_id=${amst_Id}&fr_refundno=${fr_refundno}`;

    //const url='/FeeRefundableFacade/get-refundable-recepts?asmayId=231&amst_id=16286&fr_refundno=132222222222222222';
    return await api.get<any>('fees', url);
}
