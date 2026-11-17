'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterAllFeeHeadList, IMasterFeeHeadDropdownList, IMasterFeeInstallmentDropdownList } from '@/types/fees/masters/masters';

export async function getMasterfeehead() {
    const url = '/YearlyFeeGroupMappingFacade/feeheads';
    return await api.get<{
        success: boolean;
        message: string;
        data: IMasterFeeHeadDropdownList[];
    }>('fees', url);
}

export async function getMasterfeeInstallment() {
    const url = '/YearlyFeeGroupMappingFacade/feeinstallments';

    return await api.get<{
        success: boolean;
        message: string;
        data: IMasterFeeInstallmentDropdownList[];
    }>('fees', url);
}

export async function addMasterYearlyGroupMapping(data: any) {
    const url = '/YearlyFeeGroupMappingFacade/savefeeheadinstallment';
    return await api.post<any>('fees', url, data);
}

export async function getMasterAllFeeHead(asmay_Id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'mG_GroupName,fyghM_Id,fmH_FeeName,fmI_Name,fyghM_FineApplicableFlag,fyghM_Common_AmountFlag'
    );
    const url = `/YearlyFeeGroupMappingFacade/getallfeehead?asmay_Id=${asmay_Id}&${urlParams}`;

    return await api.get<IMasterAllFeeHeadList[]>('fees', url);
}
export async function deleteYearlyGroupMapping(id: number) {
    const url = `/YearlyFeeGroupMappingFacade/deletefeeheadsinstallment/${id}`;
    return await api.delete('fees', url);
}
