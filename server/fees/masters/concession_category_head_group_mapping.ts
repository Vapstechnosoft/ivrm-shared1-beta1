'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IConcessionCategoryDropdownList,
    IConcessionCategoryGroupDropdownList,
    IConcessionCategoryGroupHeadMappingList,
    IConcessionCategoryHeadsDropdownList
} from '@/types/fees/masters/masters';

export async function getConcessionCategoryGroupHeadMappingDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'fmcC_Id,fmG_Id,fmH_Id,fmaccG_Id,fmcC_ConcessionName,fmG_GroupName,fmH_FeeName'
    );
    const url = `/FeeMasterConcession/GetCategoryGroupHeadMappingList?${urlParams}`;
    return await api.get<IConcessionCategoryGroupHeadMappingList[]>('fees', url);
}

export async function addOrUpdateConcessionCategoryGroupHeadMapping(data: any) {
    const url = '/FeeMasterConcession/AddOrUpdateCategoryGroupHeadMapping';
    return await api.post<any>('fees', url, data);
}

export async function toggleConcessionCategoryGroupHeadMapping(fmaccG_Id: number) {
    const url = `/FeeMasterConcession/ToggleFeeMasterCategoryGroupHeadMapping/${fmaccG_Id}`;
    return await api.put('fees', url);
}

export async function getconcessioncategorydropdown() {
    const url = 'FeeMasterConcession/concession_dropdown_list';
    return await api.get<IConcessionCategoryDropdownList[]>('fees', url);
}

export async function getcategorygroupdropdown() {
    const url = '/FeeMasterConcession/group_drop_down_list';
    return await api.get<IConcessionCategoryGroupDropdownList[]>('fees', url);
}

export async function getcategoryheadsdropdown(groupId: number) {
    const url = `/FeeMasterConcession/head_drop_down_list/${groupId}`;
    console.info('FeeMasterConcession/head_drop_down_list', url);
    return await api.get<IConcessionCategoryHeadsDropdownList[]>('fees', url);
}

export async function getcategorydropdowndropdown() {
    // const url = '/FeeMasterConcession/groupheadmapping_category_dropdown_list';

    const url = '/FeeMasterConcession/concession_dropdown_list';

    return await api.get<IConcessionCategoryDropdownList[]>('fees', url);
}
