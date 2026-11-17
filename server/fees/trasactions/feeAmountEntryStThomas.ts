'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IFeeAcademicyearDropDownList,
    IFeeAmountEntryList,
    IFeeClassCategoryDropDownList,
    IFeeGroupDropDownList
} from '@/types/fees/transactions/transactions';

export async function getAmountEntrystthomas(asmay_id?: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'fmA_Amount,fmG_GroupName,asmay_Year,fmcC_ClassCategoryName,fmH_FeeName,ftI_Name'
    );
    const url = `/FeeAmountEntryStthomas/amt-entry-details?asmay_id=${asmay_id || 0}&${urlParams}`;
    return await api.get<IFeeAmountEntryList[]>('fees', url);
}

export async function getAcademicYearDropdownDatastthomas() {
    const url = '/fee_class_category/academicyearlist';
    return await api.get<IFeeAcademicyearDropDownList[]>('fees', url);
}

export async function getCategorydrodowndatastthomas(academicYear_Id: number) {
    const url = `/FeeAmountEntryStthomas/class-categorylist?asmay_id=${academicYear_Id}`;
    console.info(url);
    return await api.get<IFeeClassCategoryDropDownList>('fees', url);
}

export async function getgroupdrodownstthomas(academicYear_Id: number) {
    const url = `/FeeAmountEntryStthomas/group_list?asmay_id=${academicYear_Id}`;
    return await api.get<IFeeGroupDropDownList>('fees', url);
}

export async function deleteAmountEntrystthomas(asmay_id: number, id: number) {
    const url = `/FeeAmountEntryStthomas/delete_details?asmay_id=${asmay_id}&fma_id=${id}`;
    console.info(url);
    return await api.get('fees', url);
}

export async function getAmountentrydetailsstthomas(asmay_id: number, fmcC_id: number, fmG_id: number) {
    const url = `/FeeAmountEntryStthomas/group_head_details?asmay_id=${asmay_id}&fmcc_id=${fmcC_id}&fmg_id=${fmG_id}`;
    return await api.get<any[]>('fees', url);
}

export async function addOrUpdateAmountEntrystthomas(data: any) {
    const url = '/FeeAmountEntryStthomas/amount-entry-save';
    return await api.post<any>('fees', url, data);
}
