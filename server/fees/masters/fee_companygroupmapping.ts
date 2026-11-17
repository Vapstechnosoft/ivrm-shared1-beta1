'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    ICompanyGroupMappingCompanyDropdownList,
    ICompanyGroupMappingGroupDropdownList,
    IfeeCompanyGroupMappingList
} from '@/types/fees/masters';

export async function getfeecompanygroupmappingList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'ftmcoM_CompanyName,fmG_GroupName,ftmcoM_CompanyCode');
    const url = `/fee_yearly_group/get_feegroup_companymapping_list?${urlParams}`;
    return await api.get<IfeeCompanyGroupMappingList[]>('fees', url);
}

export async function getFeesGroupDropDown() {
    const url = '/FeesCommon/fee-group-details';
    return await api.get<ICompanyGroupMappingGroupDropdownList[]>('fees', url);
}

export async function addOrUpdateCompanyFeeGroupMapping(data: any) {
    const url = '/fee_yearly_group/AddOrUpdateFeeGroupCompanyMapping';
    return await api.post<any>('fees', url, data);
}

export async function toggleFeeCompanyGroup(id: number) {
    const url = `/fee_yearly_group/toggle-fee-group-company-mapping?FFGCMA_Id=${id}`;
    return await api.put('fees', url);
}

export async function getFeeCompanyGroupMappingCompanyDropdown() {
    const url = '/fee_yearly_group/company-dropdown';
    return await api.get<ICompanyGroupMappingCompanyDropdownList[]>('fees', url);
}
