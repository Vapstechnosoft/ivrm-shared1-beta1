'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IFeeAdjustmentGridList,
    IFeeAdjustmentGroupDropDown,
    IFeeAdjustmentGroupToDropDown,
    IFeeAdjustmentHeadDropDown,
    IFeeAdjustmentToHead
} from '@/types/fees/transactions/transactions';

export async function getFeeAdjutmentGridList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/FeeAdjustment/get-adjustead-list?${urlParams}`;
    return await api.get<IFeeAdjustmentGridList[]>('fees', url);
}

export async function getFeeAdjustmentSave(data: any) {
    const url = '/FeeAdjustment/insert';
    return await api.post<any>('fees', url, data);
}

export async function getFeeAdjustmentSectionDropDown(data: any) {
    const url = '/FeeAdjustment/getsection';
    return await api.post<any>('fees', url, data);
}
export async function getFeeAdjustmentToGroup(asmaY_Id: number, amsT_Id: number) {
    const url = `/FeeAdjustment/adjustment-to-group-details?asmayId=${asmaY_Id || 0}&amstId=${amsT_Id || 0}`;
    return await api.get<IFeeAdjustmentGroupToDropDown[]>('fees', url);
}
export async function getFeeAdjustmentGroupDropDown(filterrefund: string, asmaY_Id: number, amsT_Id: number) {
    const url = `/FeeAdjustment/adjustment-group-list?filterrefund=${filterrefund}&asmayId=${asmaY_Id || 0}&amstId=${amsT_Id || 0}`;
    return await api.get<IFeeAdjustmentGroupDropDown[]>('fees', url);
}
export async function getFeeAdjustmentFromHeadDropDown(filterrefund: string, asmaY_Id: number, amsT_Id: number, fmG_id: number) {
    const url = `/FeeAdjustment/adjustment-head-details?filterrefund=${filterrefund}&asmayId=${asmaY_Id || 0}&amstId=${amsT_Id || 0}&fmgId=${fmG_id || 0}`;
    return await api.get<IFeeAdjustmentHeadDropDown[]>('fees', url);
}
export async function deleteFeeAdjustment(fr_id: number) {
    const url = `/FeeAdjustment/deletedetails/${fr_id}`;

    return await api.delete('fees', url);
}

export async function getFeeAdjustmentToHeadDropDown(asmaY_Id: number, amsT_Id: number, fmG_id: number) {
    const url = `/FeeAdjustment/adjustment-to-head-details?asmayId=${asmaY_Id || 0}&amstId=${amsT_Id || 0}&fmgId=${fmG_id || 0}`;
    return await api.get<IFeeAdjustmentToHead[]>('fees', url);
}

export async function studentNameDropdown(data: any) {
    // const url = '/FeeOpeningBalance/student-name-dropdown';
    const url = '/FeeAdjustment/getstudent';
    return await api.post<any>('fees', url, data);
}
