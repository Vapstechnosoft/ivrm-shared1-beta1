'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterConcessionDetailsList } from '@/types/fees/masters';
import type { IConcessionCategoryDropdownList } from '@/types/fees/masters/masters';

export async function getMasterConcessionDetails(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(
        searchParams ?? {},
        'fmccD_PerOrAmtFlag,fmccD_FromNoSibblings,fmccD_ToNoSibblings,fmccD_PerOrAmt,fmcC_ConcessionName'
    );
    const url = `FeeMasterConcession/GetFeeCategoryList?${urlParams}`;

    console.info('url', url);
    return await api.get<IMasterConcessionDetailsList[]>('fees', url);
}

export async function addOrUpdateMasterConcessionDetails(data: any) {
    const url = '/FeeMasterConcession/AddorUpdateFeeCategoryDetails';
    return await api.post<any>('fees', url, data);
}

export async function toggleMasterConcessionDetails(fmccD_Id: number, fmccid: number) {
    const url = `/FeeMasterConcession/ToggleFeeCategoryDetails/${fmccD_Id}?FMCC_Id=${fmccid}`;
    return await api.put('fees', url);
}

export async function getconcessioncategorydropdown() {
    const url = 'FeeConcessionFacade/getfeeconcessioncategories';
    return await api.get<IConcessionCategoryDropdownList[]>('fees', url);
}
