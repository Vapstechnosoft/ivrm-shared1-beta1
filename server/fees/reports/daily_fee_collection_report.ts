'use server';
import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMasterClassYearlyList, IMasterGroupList } from '@/types/fees/masters/masters';
import type { IFeeOpeningBalanceList } from '@/types/fees/transactions/transactions';

export async function getFeeOpeningBalance(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/FeeOpeningBalanceFacade?${urlParams}`;
    return await api.get<IFeeOpeningBalanceList[]>('fees', url);
}

export async function addOrUpdateFeeOpeningBalance(data: any) {
    const url = '/FeeOpeningBalance/save-opening-balance';
    return await api.post<any>('fees', url, data);
}

export async function studentNameDropdown(data: any) {
    const url = '/FeeOpeningBalance/student-name-dropdown';
    return await api.post<any>('fees', url, data);
}

export async function studentListDropdown(data: any) {
    const url = '/FeeOpeningBalance/opening-balance-student-list';
    return await api.post<any>('fees', url, data);
}
export async function toggleFeeOpeningBalance(id: number) {
    const url = `/FeeOpeningBalanceFacade/paymentDecative/${id}`;
    return await api.put('fees', url);
}

export async function getGroupsDropdown(asmay_Id: number) {
    const url = `/FeeDailycollection/group-dropdown-by-year-id/${asmay_Id}`;
    return await api.get<IMasterGroupList[]>('fees', url);
}

export async function getClassDropDown() {
    const url = '/FeesCommon/class-details/';

    return await api.get<IMasterClassYearlyList[]>('fees', url);
}

export async function getDailyFeeCollectionReport(data: any) {
    const url = '/FeeDailycollection/daily-fee-collection-report';

    return await api.post<any[]>('fees', url, data);
}
