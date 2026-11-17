'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IReportsForm10 } from '@/types/hrms/reports/useReports';
export async function getMasterClassYearlyCategory(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'asmaY_Year,fmcC_ClassCategoryName,asmcL_ClassName');
    const url = `/fee_class_category/yearlyclasscategorylist?${urlParams}`;
    return await api.get<IReportsForm10[]>('fees', url);
}

export async function getForm10Dropdowns(data: any) {
    const url = 'PFForm10Facade/onloadgetdetails';
    return await api.post<any>('fees', url, data);
}
