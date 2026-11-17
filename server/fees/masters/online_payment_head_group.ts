'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IFeeOnlinehaedgroupMappingList, IMasterClassYearlyList, IinstitutionDetails } from '@/types/fees/masters/masters';

export async function getAcademicYearDropdown() {
    const url = '/fee_class_category/academicyearlist';
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getOnlinePaymentHeadGroupInstallment(academicYears?: number) {
    const url = `/OnlinePaymentHeadGroupMapping/fee_installment_yearlly_drop_down_list/${academicYears}`;
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getInstituteDropDownList() {
    const url = '/OnlinePaymentHeadGroupMapping/get_institution_name/';

    return await api.get<IMasterClassYearlyList[]>('fees', url);
}
export async function getClassDropDownList(academicYears?: number) {
    const url = `/OnlinePaymentHeadGroupMapping/class_drop_down_list/${academicYears}`;
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getSubMerchantDropDownList(academicYears?: number) {
    const url = `/OnlinePaymentHeadGroupMapping/sub_merchant_drop_down_list/${academicYears}`;
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getGroupNameDropDownList(academicYears?: number) {
    const url = `/OnlinePaymentHeadGroupMapping/groupName_drop_down_list/${academicYears}`;

    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getHeadNameDropDownList(academicYears?: number, groupName?: number) {
    const url = `/OnlinePaymentHeadGroupMapping/headname_drop_down_list/${academicYears}/${groupName}`;
    console.info('getHeadNameDropDownList', url);
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getFeeOnlinePaymentHeadGroupTable(searchParams?: ApiSearchparams) {
    console.info('OnlinePaymentHeadGroupMapping params:', searchParams);
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'fopM_Id,className,submerchandId,groupName,headName,installmentName,termName');
    const url = `/OnlinePaymentHeadGroupMapping/OnlinePaymentHeadGroupMappingList?${urlParams}`;
    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function addMasterOnlinePaymentHeadGroup(data: any) {
    const url = '/OnlinePaymentHeadGroupMapping/AddOrUpdateOnlinePaymentHeadGroupMapping';
    return await api.post<any>('fees', url, data);
}

export async function GetInstallmentMasterDropdown(payload: any) {
    const url = '/OnlinePaymentHeadGroupMapping/headwise_installment_dropdown';

    return await api.post<any>('fees', url, payload);
}

export async function getOnlinePaymentHeadGroupEdit(fopM_Id: number) {
    const url = `/OnlinePaymentHeadGroupMapping/edit/${fopM_Id}`;
    return await api.get<IFeeOnlinehaedgroupMappingList[]>('fees', url);
}

export async function deleteOnlinePaymentHeadGroup(fopM_Id: number) {
    const url = `/OnlinePaymentHeadGroupMapping/deleteDetails/${fopM_Id}`;
    return await api.put('fees', url);
}

export async function getInstitutionDetails() {
    const url = '/FeesCommon/institution-details';
    return await api.get<IinstitutionDetails[]>('fees', url);
}
