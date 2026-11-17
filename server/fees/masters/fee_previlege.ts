'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
// import type { ApiSearchparams } from '@/types';
import type {
    IMasterFeePrevilegeList,
    IMasterGetHeadDropdown,
    IMasterGetUserNameDropdown,
    IMasterGroupDropdown,
    IMasterRoleDropdown
} from '@/types/fees/masters/masters';

export async function getGroupsDropdown() {
    const url = '/fee_class_category/academicyearlist';
    return await api.get<IMasterGroupDropdown[]>('fees', url);
}
export async function getRolesDropdown() {
    const url = '/FeePrevilege/GetRoleTypeDropdown';
    return await api.get<IMasterRoleDropdown[]>('fees', url);
}

export async function getUserNameDropdown(ivrtmt_Id: number) {
    const url = `/FeePrevilege/GetUserNameDropdown?ivrmrt_Id=${ivrtmt_Id}`;
    return await api.get<IMasterGetUserNameDropdown[]>('fees', url);
}

export async function addOrUpdateFeePrivilege(data: any) {
    const url = '/FeePrevilege/AddOrUpdateMasterFeePreviledge';
    return await api.post<any>('fees', url, data);
}

export async function getFeePrevilegeList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'normalizedUserName,fmG_GroupName,fmH_FeeName, ivrmrT_Role');
    const url = `/FeePrevilege/GetMasterFeePreviledgeList?${urlParams}`;
    return await api.get<IMasterFeePrevilegeList[]>('fees', url);
}

export async function getHeadDropDown(asmay_Id: number, fmg_Id: number) {
    const url = `/FeePrevilege/heads-by-group-and-academic-year?asmay_Id=${asmay_Id}&fmg_Id=${fmg_Id}`;
    console.info('url', url);
    return await api.get<IMasterGetHeadDropdown[]>('fees', url);
}

export async function deleteFeePrivilege(id: number) {
    const url = `/FeePrevilege/delete?flg_Id=${id}`;
    console.info('deleted url', url);

    return await api.delete('fees', url);
}
