
'use server';

import { api, ApiResponse } from '@/lib/apiService';
import type {
    IFeeDefaulterInitialData,
    IClass,
    ISection,
    ICustomGroup,
    IFeeGroup,
    IFeeTerm,
    IFeeDefaulterSearchRequest,
    IFeeDefaulterSearchResponse,
    ISaveRemarkRequest
} from '@/types/staff-portal/fee-defaulter-report';

const BASE_URL = '/FeeDefaulterReport';

export async function getInitialFeeDefaulterData(): Promise<ApiResponse<IFeeDefaulterInitialData>> {
    return await api.get<IFeeDefaulterInitialData>('portal', `${BASE_URL}/getalldetails/1`);
}

export async function getStaffWiseClasses(asmaY_Id: number): Promise<ApiResponse<{ fillclass: IClass[] }>> {
    return await api.post('portal', `${BASE_URL}/getstaffwiseclass`, { ASMAY_Id: asmaY_Id });
}

export async function getStaffTerms(asmaY_Id: number, reportType: string): Promise<ApiResponse<{ fillmastergroup: any[], fillterms: IFeeTerm[], customlist: ICustomGroup[], grouplist: IFeeGroup[] }>> {
    return await api.post('portal', `${BASE_URL}/getStaffterms`, { ASMAY_Id: asmaY_Id, reporttype: reportType });
}

export async function getSections(asmaY_Id: number, asmcL_Id: number): Promise<ApiResponse<{ fillsection: ISection[] }>> {
    return await api.post('portal', `${BASE_URL}/getsection`, { ASMAY_Id: asmaY_Id, ASMCL_Id: asmcL_Id });
}

export async function getGroupsByCustom(customIds: number[], reportType: string): Promise<ApiResponse<{ grouplist: IFeeGroup[] }>> {
    return await api.post('portal', `${BASE_URL}/get_groups`, { FMGG_Ids: customIds, reporttype: reportType });
}

export async function getReportData(data: IFeeDefaulterSearchRequest): Promise<ApiResponse<IFeeDefaulterSearchResponse>> {
    return await api.post('portal', `${BASE_URL}/radiobtndata`, data);
}

export async function saveRemark(data: ISaveRemarkRequest): Promise<ApiResponse<{ message: string }>> {
    return await api.post('portal', `${BASE_URL}/saveremark`, data);
}
